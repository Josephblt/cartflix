const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const SESSION_COOKIE = "cartflix_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const sessions = new Map();

const DEFAULT_AUTH_DATA = {
  type: "users",
  algorithm: "scrypt",
  params: {
    N: 16384,
    r: 8,
    p: 1,
    keyLength: 64
  },
  users: []
};

function authPath(config) {
  return path.join(config.dataDir, "auth.json");
}

async function ensureAuthFile(config) {
  await fs.mkdir(config.dataDir, { recursive: true });

  try {
    await fs.writeFile(authPath(config), `${JSON.stringify(DEFAULT_AUTH_DATA, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx"
    });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}

async function readAuth(config) {
  return JSON.parse(await fs.readFile(authPath(config), "utf8"));
}

async function writeAuth(config, auth) {
  await fs.writeFile(authPath(config), `${JSON.stringify(auth, null, 2)}\n`, "utf8");
}

function validateAuthData(auth) {
  return auth?.type === "users"
    && auth?.algorithm === "scrypt"
    && auth?.params
    && Array.isArray(auth?.users);
}

function hashPassword(password, params) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(String(password || ""), salt, params.keyLength, {
    N: params.N,
    r: params.r,
    p: params.p
  }).toString("base64url");

  return { salt, hash };
}

function verifyPassword(user, password, params) {
  const hash = crypto.scryptSync(String(password || ""), user.salt, params.keyLength, {
    N: params.N,
    r: params.r,
    p: params.p
  }).toString("base64url");

  const expected = Buffer.from(String(user.hash || ""));
  const actual = Buffer.from(hash);

  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  };
}

function validateUsername(username) {
  const value = String(username || "").trim();
  if (!/^[a-zA-Z0-9._-]{3,32}$/.test(value)) {
    throw Object.assign(new Error("Username must be 3-32 letters, numbers, dots, underscores, or hyphens."), {
      status: 400
    });
  }
  return value;
}

function validateDisplayName(displayName, username) {
  const value = String(displayName || "").trim();
  if (!value) return username;
  if (value.length > 80 || /[\r\n]/.test(value)) {
    throw Object.assign(new Error("Display name is invalid."), { status: 400 });
  }
  return value;
}

function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 8) {
    throw Object.assign(new Error("Password must be at least 8 characters."), { status: 400 });
  }
  if (/[\r\n]/.test(value)) {
    throw Object.assign(new Error("Password cannot contain newlines."), { status: 400 });
  }
  return value;
}

function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie || "";

  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function cookiePath(config) {
  return config.cookiePath || config.basePath || "/";
}

function shouldUseSecureCookie(req, config) {
  if (config.cookieSecure === true || config.cookieSecure === false) return config.cookieSecure;
  return String(req.headers["x-forwarded-proto"] || "").includes("https");
}

function sessionCookie(req, config, token, maxAgeSeconds) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=${cookiePath(config)}`,
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`
  ];

  if (shouldUseSecureCookie(req, config)) parts.push("Secure");
  return parts.join("; ");
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();

  sessions.set(token, {
    createdAt: now,
    lastSeenAt: now,
    user: publicUser(user)
  });

  return token;
}

function sessionForRequest(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() - session.lastSeenAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return null;
  }

  session.lastSeenAt = Date.now();
  return session;
}

function clearSession(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (token) sessions.delete(token);
}

async function authStatus(config, req) {
  const auth = await readAuth(config);
  const session = sessionForRequest(req);

  return {
    authenticated: Boolean(session),
    setupRequired: validateAuthData(auth) && auth.users.length === 0,
    user: session?.user || null
  };
}

async function setupFirstUser(config, input) {
  const auth = await readAuth(config);
  if (!validateAuthData(auth)) {
    throw Object.assign(new Error("Auth storage is invalid."), { status: 500 });
  }
  if (auth.users.length > 0) {
    throw Object.assign(new Error("Setup is already complete."), { status: 409 });
  }

  const username = validateUsername(input.username);
  const password = validatePassword(input.password);
  const now = new Date().toISOString();
  const { salt, hash } = hashPassword(password, auth.params);
  const user = {
    id: crypto.randomUUID(),
    username,
    displayName: validateDisplayName(input.displayName, username),
    salt,
    hash,
    createdAt: now,
    updatedAt: now
  };

  auth.users.push(user);
  await writeAuth(config, auth);
  return publicUser(user);
}

async function login(config, input) {
  const auth = await readAuth(config);
  if (!validateAuthData(auth)) {
    throw Object.assign(new Error("Auth storage is invalid."), { status: 500 });
  }

  const username = String(input.username || "").trim();
  const user = auth.users.find((candidate) => candidate.username === username);
  if (!user || !verifyPassword(user, input.password, auth.params)) {
    throw Object.assign(new Error("Invalid username or password."), { status: 401 });
  }

  return publicUser(user);
}

async function changePassword(config, session, input) {
  if (!session) {
    throw Object.assign(new Error("Login required."), { status: 401 });
  }

  const auth = await readAuth(config);
  if (!validateAuthData(auth)) {
    throw Object.assign(new Error("Auth storage is invalid."), { status: 500 });
  }

  const user = auth.users.find((candidate) => candidate.id === session.user.id);
  if (!user || !verifyPassword(user, input.currentPassword, auth.params)) {
    throw Object.assign(new Error("Current password is incorrect."), { status: 401 });
  }

  const { salt, hash } = hashPassword(validatePassword(input.newPassword), auth.params);
  user.salt = salt;
  user.hash = hash;
  user.updatedAt = new Date().toISOString();

  await writeAuth(config, auth);
}

module.exports = {
  SESSION_TTL_MS,
  authStatus,
  changePassword,
  clearSession,
  createSession,
  ensureAuthFile,
  login,
  sessionCookie,
  sessionForRequest,
  setupFirstUser
};

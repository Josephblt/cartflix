const crypto = require("node:crypto");
const { hashPassword, validatePassword, verifyPassword } = require("./passwords");
const { publicUser, sessionForRequest } = require("./sessions");
const { readAuth, validateAuthData, writeAuth } = require("./storage");

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

async function authStatus(config, req) {
  const auth = await readAuth(config);
  const session = sessionForRequest(req);
  const setupRequired = validateAuthData(auth) && auth.users.length === 0;

  return {
    authenticated: Boolean(session),
    setupAllowed: setupRequired && config.isLocalRequest(req),
    setupRequired,
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
  if (!config.isLocalRequest(input.req)) {
    throw Object.assign(new Error("First-time setup must be completed locally."), { status: 403 });
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
  authStatus,
  changePassword,
  login,
  setupFirstUser
};

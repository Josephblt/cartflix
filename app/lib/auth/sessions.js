const crypto = require("node:crypto");

const SESSION_COOKIE = "cartflix_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const sessions = new Map();

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  };
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

module.exports = {
  SESSION_TTL_MS,
  clearSession,
  createSession,
  publicUser,
  sessionCookie,
  sessionForRequest
};

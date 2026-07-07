const crypto = require("node:crypto");

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

function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 6) {
    throw Object.assign(new Error("Password must be at least 6 characters."), { status: 400 });
  }
  if (/[\r\n]/.test(value)) {
    throw Object.assign(new Error("Password cannot contain newlines."), { status: 400 });
  }
  return value;
}

module.exports = {
  hashPassword,
  validatePassword,
  verifyPassword
};

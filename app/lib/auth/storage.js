const fs = require("node:fs/promises");
const path = require("node:path");

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

module.exports = {
  ensureAuthFile,
  readAuth,
  validateAuthData,
  writeAuth
};

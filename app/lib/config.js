const path = require("node:path");
const os = require("node:os");
const { isLocalRequest } = require("./helpers/local-request");

function normalizeBasePath(value) {
  const raw = String(value || "/").trim();
  if (!raw || raw === "/") return "";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

function defaultDataDir(env = process.env, platform = process.platform) {
  const home = os.homedir();

  if (platform === "win32") {
    const dataHome = env.LOCALAPPDATA || env.APPDATA || path.win32.join(home, "AppData", "Local");
    return path.win32.join(dataHome, "Cartflix");
  }

  if (platform === "darwin") {
    return path.join(home, "Library", "Application Support", "Cartflix");
  }

  const dataHome = env.XDG_DATA_HOME || path.join(home, ".local", "share");
  return path.join(dataHome, "cartflix");
}

function createConfig(env = process.env) {
  const appDir = path.resolve(__dirname, "..");

  return {
    host: env.HOST || "127.0.0.1",
    port: Number(env.PORT || 18830),
    basePath: normalizeBasePath(env.BASE_PATH),
    cookiePath: normalizeBasePath(env.COOKIE_PATH || env.BASE_PATH) || "/",
    cookieSecure: env.CARTFLIX_COOKIE_SECURE === "true"
      ? true
      : env.CARTFLIX_COOKIE_SECURE === "false"
        ? false
        : null,
    dataDir: env.CARTFLIX_DATA_DIR || defaultDataDir(env),
    isLocalRequest,
    publicDir: env.CARTFLIX_PUBLIC_DIR || path.join(appDir, "public")
  };
}

module.exports = {
  createConfig,
  defaultDataDir
};

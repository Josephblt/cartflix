const path = require("node:path");
const os = require("node:os");

function normalizeBasePath(value) {
  const raw = String(value || "/").trim();
  if (!raw || raw === "/") return "";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

function createConfig(env = process.env) {
  const appDir = path.resolve(__dirname, "..");
  const dataHome = env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");

  return {
    host: env.HOST || "127.0.0.1",
    port: Number(env.PORT || 18830),
    basePath: normalizeBasePath(env.BASE_PATH),
    dataDir: env.CARTFLIX_DATA_DIR || path.join(dataHome, "cartflix"),
    publicDir: env.CARTFLIX_PUBLIC_DIR || path.join(appDir, "public")
  };
}

module.exports = {
  createConfig
};

const path = require("node:path");
const { createConfig } = require("../../app/lib/config");

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function createInstallerContext({ args = [], env = process.env } = {}) {
  const config = createConfig(env);

  return {
    args,
    config,
    env,
    paths: {
      repoRoot: REPO_ROOT,
      appEntry: path.join(REPO_ROOT, "app", "server.js"),
      publicDir: config.publicDir
    },
    service: {
      name: "cartflix.service"
    }
  };
}

module.exports = {
  createInstallerContext
};

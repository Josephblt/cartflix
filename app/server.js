const http = require("node:http");
const { ensureAuthFile } = require("./lib/auth/storage");
const { createConfig } = require("./lib/config");
const { ensureQuipFile } = require("./lib/quips/quips");
const { createRouter } = require("./lib/routes/router");

const config = createConfig();
const server = http.createServer(createRouter(config));
const displayPath = config.basePath || "/";

async function main() {
  await ensureAuthFile(config);
  await ensureQuipFile(config);

  server.listen(config.port, config.host, () => {
    console.log(`Cartflix listening on http://${config.host}:${config.port}${displayPath}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

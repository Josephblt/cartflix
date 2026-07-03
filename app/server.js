const http = require("node:http");
const { createConfig } = require("./lib/config");
const { ensureQuipFile } = require("./lib/quips");
const { createRouter } = require("./lib/router");

const config = createConfig();
const server = http.createServer(createRouter(config));
const displayPath = config.basePath || "/";

async function main() {
  await ensureQuipFile(config);

  server.listen(config.port, config.host, () => {
    console.log(`Cartflix listening on http://${config.host}:${config.port}${displayPath}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

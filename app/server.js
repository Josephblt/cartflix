const http = require("node:http");
const { createConfig } = require("./lib/config");
const { createRouter } = require("./lib/router");

const config = createConfig();
const server = http.createServer(createRouter(config));
const displayPath = config.basePath || "/";

server.listen(config.port, config.host, () => {
  console.log(`Cartflix listening on http://${config.host}:${config.port}${displayPath}`);
});

const http = require("node:http");
const net = require("node:net");

function requestStatus(config, timeout = 1000) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: config.host,
      port: config.port,
      path: `${config.basePath || ""}/api/auth/status`,
      timeout
    }, (res) => {
      let body = "";

      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
        if (body.length > 65536) req.destroy();
      });
      res.on("end", () => {
        let payload = null;
        try {
          payload = JSON.parse(body);
        } catch {
          // Non-JSON 200 responses are not Cartflix.
        }

        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 500 && payload?.ok === true,
          statusCode: res.statusCode,
          payload
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });

    req.on("error", (error) => {
      resolve({ ok: false, error: error.code || error.message });
    });
  });
}

function checkPort(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (error) => {
      resolve({
        available: false,
        error: error.code || error.message
      });
    });

    server.once("listening", () => {
      server.close(() => resolve({ available: true }));
    });

    server.listen(port, host);
  });
}

async function waitForLocalApp(config, timeoutMs = 5000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if ((await requestStatus(config, 500)).ok) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return false;
}

module.exports = {
  checkPort,
  requestStatus,
  waitForLocalApp
};

const { sendJson } = require("./responses");
const { serveStatic } = require("./static-files");

function createRouter(config) {
  return async function route(req, res) {
    try {
      if (req.method === "GET" || req.method === "HEAD") {
        await serveStatic(req, res, config);
        return;
      }

      sendJson(res, 405, { ok: false, error: "Method not allowed." }, {
        allow: "GET, HEAD"
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error.message || "Server error."
      });
    }
  };
}

module.exports = {
  createRouter
};

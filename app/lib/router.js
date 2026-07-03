const { sendJson } = require("./responses");
const { getOpeningQuip } = require("./quips");
const { pathFromRequest } = require("./request-path");
const { serveStatic } = require("./static-files");

function createRouter(config) {
  return async function route(req, res) {
    try {
      const head = req.method === "HEAD";
      const { pathname } = pathFromRequest(req, config.basePath);

      if (pathname === null) {
        sendJson(res, 404, { ok: false, error: "Not found." }, {}, { head });
        return;
      }

      if ((req.method === "GET" || req.method === "HEAD") && pathname === "/api/quips/opening") {
        sendJson(res, 200, { ok: true, quip: await getOpeningQuip(config) }, {}, { head });
        return;
      }

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

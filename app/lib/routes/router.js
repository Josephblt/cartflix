const { pathFromRequest } = require("../request-path");
const { sendJson } = require("../responses");
const { routeAuth } = require("./auth-routes");
const { routeQuips } = require("./quip-routes");
const { routeStatic } = require("./static-routes");

const apiRoutes = [
  routeAuth,
  routeQuips
];

function createRouter(config) {
  return async function route(req, res) {
    try {
      const context = {
        config,
        head: req.method === "HEAD",
        ...pathFromRequest(req, config.basePath)
      };

      if (context.pathname === null) {
        sendJson(res, 404, { ok: false, error: "Not found." }, {}, { head: context.head });
        return;
      }

      if (context.pathname.startsWith("/api/")) {
        for (const candidate of apiRoutes) {
          if (await candidate(req, res, context)) return;
        }

        sendJson(res, 404, { ok: false, error: "Not found." }, {}, { head: context.head });
        return;
      }

      await routeStatic(req, res, context);
    } catch (error) {
      sendJson(res, error.status || 500, {
        ok: false,
        error: error.message || "Server error."
      });
    }
  };
}

module.exports = {
  createRouter
};

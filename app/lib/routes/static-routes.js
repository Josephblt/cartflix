const { sendJson } = require("../helpers/responses");
const { serveStatic } = require("../static/static-files");

async function routeStatic(req, res, context) {
  if (req.method === "GET" || req.method === "HEAD") {
    await serveStatic(req, res, context.config);
    return true;
  }

  sendJson(res, 405, { ok: false, error: "Method not allowed." }, {
    allow: "GET, HEAD"
  });
  return true;
}

module.exports = {
  routeStatic
};

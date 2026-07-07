const { sendJson } = require("../helpers/responses");
const { getOpeningQuip } = require("../quips/quips");

async function routeQuips(req, res, context) {
  const { config, head, pathname } = context;

  if ((req.method === "GET" || req.method === "HEAD") && pathname === "/api/quips/opening") {
    sendJson(res, 200, { ok: true, quip: await getOpeningQuip(config) }, {}, { head });
    return true;
  }

  return false;
}

module.exports = {
  routeQuips
};

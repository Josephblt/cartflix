const {
  SESSION_TTL_MS,
  authStatus,
  changePassword,
  clearSession,
  createSession,
  login,
  sessionCookie,
  sessionForRequest,
  setupFirstUser
} = require("./auth");
const { readJsonBody } = require("./body");
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

      if ((req.method === "GET" || req.method === "HEAD") && pathname === "/api/auth/status") {
        sendJson(res, 200, { ok: true, ...(await authStatus(config, req)) }, {}, { head });
        return;
      }

      if (req.method === "POST" && pathname === "/api/auth/setup") {
        const user = await setupFirstUser(config, await readJsonBody(req));
        const token = createSession(user);

        sendJson(res, 200, { ok: true, user }, {
          "set-cookie": sessionCookie(req, config, token, Math.floor(SESSION_TTL_MS / 1000))
        });
        return;
      }

      if (req.method === "POST" && pathname === "/api/auth/login") {
        const user = await login(config, await readJsonBody(req));
        const token = createSession(user);

        sendJson(res, 200, { ok: true, user }, {
          "set-cookie": sessionCookie(req, config, token, Math.floor(SESSION_TTL_MS / 1000))
        });
        return;
      }

      if (req.method === "POST" && pathname === "/api/auth/logout") {
        clearSession(req);
        sendJson(res, 200, { ok: true }, {
          "set-cookie": sessionCookie(req, config, "", 0)
        });
        return;
      }

      if (req.method === "POST" && pathname === "/api/auth/change-password") {
        await changePassword(config, sessionForRequest(req), await readJsonBody(req));
        sendJson(res, 200, { ok: true });
        return;
      }

      if (pathname.startsWith("/api/")) {
        sendJson(res, 404, { ok: false, error: "Not found." });
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

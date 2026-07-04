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
} = require("../auth");
const { readJsonBody } = require("../body");
const { sendJson } = require("../responses");

async function routeAuth(req, res, context) {
  const { config, head, pathname } = context;

  if ((req.method === "GET" || req.method === "HEAD") && pathname === "/api/auth/status") {
    sendJson(res, 200, { ok: true, ...(await authStatus(config, req)) }, {}, { head });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/setup") {
    const user = await setupFirstUser(config, await readJsonBody(req));
    const token = createSession(user);

    sendJson(res, 200, { ok: true, user }, {
      "set-cookie": sessionCookie(req, config, token, Math.floor(SESSION_TTL_MS / 1000))
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const user = await login(config, await readJsonBody(req));
    const token = createSession(user);

    sendJson(res, 200, { ok: true, user }, {
      "set-cookie": sessionCookie(req, config, token, Math.floor(SESSION_TTL_MS / 1000))
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    clearSession(req);
    sendJson(res, 200, { ok: true }, {
      "set-cookie": sessionCookie(req, config, "", 0)
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/auth/change-password") {
    await changePassword(config, sessionForRequest(req), await readJsonBody(req));
    sendJson(res, 200, { ok: true });
    return true;
  }

  return false;
}

module.exports = {
  routeAuth
};

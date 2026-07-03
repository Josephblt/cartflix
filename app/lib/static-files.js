const fs = require("node:fs/promises");
const path = require("node:path");
const { send, sendJson } = require("./responses");

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function stripBasePath(pathname, basePath) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);
  return null;
}

function resolveStaticPath(publicDir, pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const resolved = path.resolve(publicDir, relativePath);
  const root = path.resolve(publicDir);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  return resolved;
}

async function serveStatic(req, res, config) {
  const head = req.method === "HEAD";
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = stripBasePath(url.pathname, config.basePath);

  if (pathname === null) {
    sendJson(res, 404, { ok: false, error: "Not found." }, {}, { head });
    return;
  }

  const filePath = resolveStaticPath(config.publicDir, pathname);

  if (!filePath) {
    sendJson(res, 403, { ok: false, error: "Forbidden." }, {}, { head });
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    send(res, 200, body, {
      "content-type": CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream"
    }, { head });
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      sendJson(res, 404, { ok: false, error: "Not found." }, {}, { head });
      return;
    }

    throw error;
  }
}

module.exports = {
  serveStatic
};

function stripBasePath(pathname, basePath) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);
  return null;
}

function pathFromRequest(req, basePath) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  return {
    url,
    pathname: stripBasePath(url.pathname, basePath)
  };
}

module.exports = {
  pathFromRequest,
  stripBasePath
};

const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "[::1]"
]);

function hostnameFromHeader(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    return new URL(raw.includes("://") ? raw : `http://${raw}`).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isLocalHost(value) {
  return LOCAL_HOSTNAMES.has(hostnameFromHeader(value));
}

function isLocalRequest(req) {
  const host = req.headers.host;
  const origin = req.headers.origin;

  if (!isLocalHost(host)) return false;
  if (origin && !isLocalHost(origin)) return false;

  return true;
}

module.exports = {
  isLocalRequest
};

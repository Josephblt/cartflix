function send(res, status, body, headers = {}, options = {}) {
  const payload = Buffer.isBuffer(body) || typeof body === "string" ? body : JSON.stringify(body);

  res.writeHead(status, {
    "cache-control": "no-store",
    ...headers
  });
  if (options.head) {
    res.end();
    return;
  }
  res.end(payload);
}

function sendJson(res, status, body, headers = {}, options = {}) {
  send(res, status, body, {
    "content-type": "application/json; charset=utf-8",
    ...headers
  }, options);
}

module.exports = {
  send,
  sendJson
};

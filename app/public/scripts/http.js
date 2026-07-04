export async function requestJson(path, options = {}) {
  const headers = {
    accept: "application/json",
    ...(options.headers || {})
  };

  if (options.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const response = await fetch(path, {
    ...options,
    headers,
    cache: "no-store"
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result;
}

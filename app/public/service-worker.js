const CACHE_NAME = "cartflix-shell-v2";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/screens/app.css",
  "/screens/app.js",
  "/screens/shared/tokens.css",
  "/screens/shared/base.css",
  "/screens/shared/screen.css",
  "/screens/opening/opening-screen.css",
  "/screens/opening/opening-screen.html",
  "/screens/opening/opening-screen.js",
  "/screens/login/login-screen.css",
  "/screens/login/login-screen.html",
  "/screens/login/login-screen.js",
  "/utils/html.js",
  "/utils/http.js",
  "/images/c_logo.png",
  "/images/icons/cartflix-192.png",
  "/images/icons/cartflix-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/")));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

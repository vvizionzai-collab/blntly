const CACHE_VERSION = "blntly-v2";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/blntly-icon.svg",
];

// Install: pre-cache the shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: drop old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API/navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Always go network for API calls, age-verification, health checks
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_vinext/") ||
    url.pathname.startsWith("/cdn-cgi/")
  ) {
    return;
  }

  // Network-first for HTML navigation (fresh content + offline fallback)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/") ?? new Response("BLNTLY is offline", { status: 503 }))
    );
    return;
  }

  // Cache-first for static assets (fonts, icons, css, js chunks)
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});

// Push notifications for order status updates
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "BLNTLY", {
      body: data.body,
      icon: "/blntly-icon.svg",
      badge: "/icons/badge-96.png",
      tag: data.tag ?? "blntly-order",
      data: { url: data.url ?? "/" },
      requireInteraction: data.requireInteraction ?? false,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find((c) => c.url.includes(self.registration.scope));
        if (existing) {
          existing.focus();
          existing.navigate(target);
        } else {
          clients.openWindow(target);
        }
      })
  );
});

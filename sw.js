// Service Worker: offline caching and versioned updates
const SITE_VERSION = "20260214-01";
const CACHE_NAME = `open-ar-${SITE_VERSION}`;
const CORE_ASSETS = [
  "index.html",
  "ar-scene.html",
  "landing.html",
  "manifest.json",
  "assets/style.css?v=20260214-01",
  "assets/reset-button.css?v=20260214-01",
  "assets/img/Icon/app-icon.svg",
  "version.json",
];

async function purgeLegacyCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(async (k) => {
      if (k.startsWith("open-ar-")) return;
      try {
        await caches.delete(k);
        console.log("SW: Purged legacy cache", k);
      } catch (e) {}
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cn) => {
          if (cn.startsWith("open-ar-") && cn !== CACHE_NAME) {
            return caches.delete(cn);
          }
        }),
      );
      await purgeLegacyCaches();
    })(),
  );
  self.clients.claim();
  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    clients.forEach((c) =>
      c.postMessage({ type: "SW_VERSION", version: SITE_VERSION }),
    );
  });
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const req = event.request;
  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith(".glb") || url.pathname.endsWith(".mind")) {
    event.respondWith(
      (async () => {
        const runtimeCache = await caches.open("open-ar-runtime");
        const cached = await runtimeCache.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              runtimeCache.put(req, res.clone()).catch(() => {});
            }
            return res;
          })
          .catch((err) => {
            if (!cached) console.log("SW: GLB/MIND fetch fail", url.href, err);
            return cached || Response.error();
          });
        if (cached) {
          networkPromise.catch(() => {});
          return cached;
        }
        return networkPromise;
      })(),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkResp) => {
          if (
            networkResp &&
            networkResp.status === 200 &&
            networkResp.type === "basic" &&
            !req.url.startsWith("chrome-extension://")
          ) {
            const clone = networkResp.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(req, clone))
              .catch(() => {});
          }
          return networkResp;
        })
        .catch((err) => {
          if (!cached)
            console.log("SW: Network fail & no cache", err, url.href);
          return (
            cached ||
            (req.mode === "navigate" ? caches.match("index.html") : undefined)
          );
        });
      return cached || fetchPromise;
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

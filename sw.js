const CACHE_NAME = "scholars-point-v7-offline";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/styles/design-system.css",
  "./src/config/classes.js",
  "./src/db/database.js",
  "./src/auth/auth.js",
  "./src/ui/illustrations.js",
  "./src/curriculum/seed_part1.js",
  "./src/curriculum/seed_part2.js",
  "./src/curriculum/curriculumService.js",
  "./src/reader/textbookReader.js",
  "./src/games/gameEngine.js",
  "./src/assessment/examEngine.js",
  "./src/cms/cmsModule.js",
  "./src/app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return resp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

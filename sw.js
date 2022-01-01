const staticCacheName = "site-static";
const assets = [
  "/",
  "index.html",
  "Ar.html",
  "/assets/js/app.js",
  "/assets/js/main.js",
  "/assets/css/style.css",
  "/assets/images/icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css",
];

// install sevice worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate service worker
self.addEventListener("activate", (event) => {
  console.log("service worker has been activated");
});

// fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachRes) => {
      return cachRes || fetch(event.request);
    })
  );
});

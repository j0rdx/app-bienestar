const CACHE_NAME = 'mj-studio-cache-v3'; // Cambiamos a v2 para forzar la actualización
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icon-512.png'
];

// Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación (Limpia cualquier rastro anterior)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia: Primero va a internet, si falla (offline), usa la caché.
// ¡Esto evita el error 404 por completo!
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

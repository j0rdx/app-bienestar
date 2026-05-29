const CACHE_NAME = 'mj-studio-cache-v2'; // Cambiamos a v2 para forzar la actualización
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icon-512.png'
];

// Evento de Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Guardando recursos estáticos en caché...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Activación: Limpia la caché vieja (la v1 que te daba error)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch (Corregido para GitHub Pages)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si el archivo está en caché, lo usa; si no, va a internet
        return cachedResponse || fetch(event.request);
      }).catch(() => {
        console.log('Error al traer recurso en red o caché');
      })
  );
});

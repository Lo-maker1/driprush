// Service worker minimal — nécessaire pour que le navigateur propose l'installation
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});

// ============================================================
// DRIPRUSH — Service Worker avec support FCM (notifications push)
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Config Firebase (identique à celle de tes fichiers HTML)
firebase.initializeApp({
    apiKey: "AIzaSyBuzgGc5iumNCurtTpVM5X3_3TK95qbQpc",
    authDomain: "vroomiam.firebaseapp.com",
    databaseURL: "https://vroomiam-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vroomiam",
    storageBucket: "vroomiam.firebasestorage.app",
    messagingSenderId: "13433812189",
    appId: "1:13433812189:web:40b8ba4b14cb0a4deb9734"
});

const messaging = firebase.messaging();

// ✅ Notifications reçues quand le site est en arrière-plan ou fermé
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Message reçu en arrière-plan :', payload);

    const title = (payload.notification && payload.notification.title) || 'Driprush 🔥';
    const body = (payload.notification && payload.notification.body) || 'Tu as un nouveau message';
    const url = (payload.data && payload.data.url) || '/';

    const options = {
        body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [200, 100, 200],
        data: { url },
        actions: [{ action: 'open', title: 'Voir 👀' }]
    };

    return self.registration.showNotification(title, options);
});

// ✅ Clic sur la notification → ouvre la bonne page
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url)
        ? event.notification.data.url
        : 'https://lo-maker1.github.io/driprush/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Si une fenêtre Driprush est déjà ouverte, on la focus
            for (const client of clientList) {
                if (client.url.includes('driprush') && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            // Sinon on ouvre une nouvelle fenêtre
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});

// ✅ Installation et activation immédiates
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// ✅ Fetch : réseau d'abord, pas de cache (PWA légère)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

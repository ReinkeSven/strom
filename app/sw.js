// Service Worker: hält die App offline verfügbar.
// Der Spielstand liegt im localStorage, nicht hier. Bei jeder Änderung an App-Dateien VERSION erhöhen.
const VERSION = '0.5.0';
const CACHE = `strom-labor-${VERSION}`;
const CORE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/model.js',
  './js/content.js',
  './js/exercises-data.js',
  './js/exercises.js',
  './js/circuits.js',
  './js/svg.js',
  './js/demos.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('strom-labor-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Netz zuerst, Cache als Rückfall: Updates kommen sofort an, offline läuft es trotzdem.
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || cache.match('./index.html');
  }
}

// Schriften ändern sich nicht: Cache zuerst.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) event.respondWith(networkFirst(request));
  else if (FONT_HOSTS.includes(url.hostname)) event.respondWith(cacheFirst(request));
});

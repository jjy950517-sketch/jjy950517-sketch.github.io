// STEP 46: keep HTML and Supabase requests network-based to avoid stale user data.
const CACHE = 'jjupjjup-pwa-static-v2';
const STATIC = ['./icon-192.png', './icon-512.png', './apple-touch-icon.png', './manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (STATIC.some(path => url.pathname.endsWith(path.replace('./', '/')))) {
    event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
  }
});

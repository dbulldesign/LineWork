/* LineWork offline shell.
   Cache-first for the app's own files so an installed copy opens with no
   network; anything else falls through to the network untouched.
   Bump CACHE when the shell changes so old copies are evicted. It must stay in
   step with APP_VER in index.html: the app reads the version out of this file,
   because this file is the one thing the cache is never allowed to answer for. */
const CACHE = 'linework-v1.78.0';
const SHELL = [
  './',
  './index.html',
  './ui/linework-ui.css',
  './ui/linework-ui.js',
  './vendor/pdf.min.js',
  './vendor/pdf.worker.min.js',
  './manifest.webmanifest',
  './favicon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  /* Two things must always reach the server, or an installed copy can never learn
     that a newer build exists: anything asked for with no-store, and this worker's
     own script. Serving a version check out of the very cache it is checking on is
     how a stale copy stays stale for ever. Neither is cached here. */
  const path = new URL(req.url).pathname;
  if (req.cache === 'no-store' || req.cache === 'reload' || path.endsWith('/sw.js')) {
    e.respondWith(fetch(req).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) {
        // refresh in the background so the next open is current
        fetch(req).then(r => { if (r && r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); }).catch(() => {});
        return hit;
      }
      return fetch(req).then(r => {
        if (r && r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

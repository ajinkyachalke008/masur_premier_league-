const CACHE_NAME = 'mpl-2026-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA: Some assets failed to precache', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API calls, functions, analytics, non-GET requests
  if (
    event.request.method !== 'GET' ||
    url.pathname.includes('/functions/v1/') ||
    url.pathname.includes('/rest/v1/') ||
    url.hostname.includes('supabase.co')
  ) {
    return;
  }

  // Network-First strategy with fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid responses for static assets
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error occurred', { status: 408 });
        });
      })
  );
});

/**
 * Service worker: offline fallback and fast repeat visits.
 *
 * - Page navigations: network-first, falling back to the cached copy, then /offline.
 * - Versioned assets (/assets/*?v=hash, favicon): cache-first.
 * - SPA fragment requests, the chat API, video (range requests) and all
 *   cross-origin requests are never touched.
 */
const CACHE_NAME = 'symnexus-v1';
const OFFLINE_URL = '/offline';
const PRECACHE = [OFFLINE_URL, '/favicon.svg'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

function cacheResponse(request, response) {
    if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (request.headers.get('X-SPA-Request') === 'true') return;
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/video/')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => cacheResponse(request, response))
                .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
        );
        return;
    }

    if (url.pathname.startsWith('/assets/') || url.pathname === '/favicon.svg') {
        event.respondWith(
            caches.match(request).then((cached) => cached || fetch(request).then((response) => cacheResponse(request, response)))
        );
    }
});

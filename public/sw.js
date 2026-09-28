/**
 * Service worker: offline fallback and fast repeat visits.
 *
 * - Page navigations: network-first, falling back to the cached copy, then /offline.
 * - Pages reached through the SPA router are cached on request from the router
 *   ('cache-page' message), since the router itself only fetches fragments.
 * - Versioned assets (/assets/*?v=hash, favicon): cache-first; older versions of
 *   the same file are pruned when a new one is stored.
 * - SPA fragment requests, the chat API, video (range requests) and all
 *   cross-origin requests are never touched.
 */
const CACHE_NAME = 'symnexus-v1';
const OFFLINE_URL = '/offline';
const PRECACHE = [OFFLINE_URL, '/favicon.svg'];
const MAX_PAGES = 40;

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

async function store(request, response) {
    if (!response || !response.ok || response.type !== 'basic') return;
    const cache = await caches.open(CACHE_NAME);
    const url = new URL(request.url);
    const keys = await cache.keys();

    if (url.pathname.startsWith('/assets/')) {
        // Drop superseded versions of this asset (same path, different ?v=).
        await Promise.all(keys
            .filter((k) => { const u = new URL(k.url); return u.pathname === url.pathname && u.search !== url.search; })
            .map((k) => cache.delete(k)));
    } else {
        // Keep the page cache bounded (oldest first).
        const pages = keys.filter((k) => !new URL(k.url).pathname.startsWith('/assets/') && !PRECACHE.includes(new URL(k.url).pathname));
        await Promise.all(pages.slice(0, Math.max(0, pages.length - MAX_PAGES + 1)).map((k) => cache.delete(k)));
    }
    await cache.put(request, response);
}

function cacheAndReturn(event, request, response) {
    if (response && response.ok) event.waitUntil(store(request, response.clone()));
    return response;
}

self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type !== 'cache-page' || typeof data.url !== 'string') return;
    const url = new URL(data.url, self.location.origin);
    if (url.origin !== self.location.origin) return;
    const request = new Request(url.href, { credentials: 'same-origin' });
    event.waitUntil(fetch(request).then((response) => store(request, response)).catch(() => {}));
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (request.headers.get('X-SPA-Request') === 'true') return;
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/video/')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => cacheAndReturn(event, request, response))
                .catch(() => caches.match(request, { ignoreVary: true })
                    .then((cached) => cached || caches.match(OFFLINE_URL, { ignoreVary: true })))
        );
        return;
    }

    if (url.pathname.startsWith('/assets/') || url.pathname === '/favicon.svg') {
        event.respondWith(
            caches.match(request).then((cached) => cached || fetch(request).then((response) => cacheAndReturn(event, request, response)))
        );
    }
});

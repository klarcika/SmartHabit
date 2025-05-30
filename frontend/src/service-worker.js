import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
const CACHE_NAME = 'habit-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js', // Main JS bundle
    '/static/js/*.js', // Wildcard for other JS chunks
    '/static/css/*.css', // Wildcard for CSS files
    '/assets/*', // Cache assets folder if used
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event to handle requests
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Handle API requests (e.g., /api/habits, /api/achievements, /api/milestones)
    if (requestUrl.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ message: 'Offline, request queued' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                });
            })
        );
    } else {
        // Cache-first strategy for static assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Listen for sync events
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-habits') {
        event.waitUntil(Promise.resolve());
    }
});
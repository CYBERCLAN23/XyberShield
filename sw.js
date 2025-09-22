// Service Worker for XyberShield
const CACHE_NAME = 'xybershield-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/home.html',
  '/Education.html',
  '/privacy-policy.html',
  '/reset-password.html',
  '/style/style.css',
  '/style/responsive.css',
  '/style/utilities.css',
  '/style/login.css',
  '/animation/login.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap',
  'https://cdn.lordicon.com/lordicon.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, like those for Google Analytics
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('', { status: 408, statusText: 'Network request failed' });
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const title = 'XyberShield';
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/badge.png',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    // Handle form sync
  }
});

// Handle offline page
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(error => {
        return caches.match(OFFLINE_PAGE);
      })
    );
  }
});

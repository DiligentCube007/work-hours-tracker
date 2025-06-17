// A unique name for our cache
const CACHE_NAME = 'work-hours-cache-v1';

// List all the core files to be cached for the app shell
const CACHE_FILES = [
  '/',
  '/index.html',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// The install event fires when the service worker is first installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  // waitUntil() ensures the service worker doesn't install until the code inside has successfully completed.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell files');
      return cache.addAll(CACHE_FILES);
    })
  );
});

// The activate event fires when the service worker is activated.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // This is a good time to clean up old caches.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// The fetch event fires for every network request the page makes.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests for our app shell.
  if (event.request.method !== 'GET') {
    return;
  }

  // For Firebase, Google Fonts APIs, etc., always fetch from the network.
  // This ensures authentication and dynamic data always work.
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    return; 
  }
  
  // For our app files, we'll follow a "cache-first" strategy.
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If we find a match in the cache, return it.
      // Otherwise, fetch the resource from the network.
      return response || fetch(event.request);
    })
  );
});

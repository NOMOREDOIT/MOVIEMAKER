// Define a name for our cache
const CACHE_NAME = 'movie-meme-maker-v1';

// List the files that should be cached automatically when the app is first installed.
// This is the "app shell" - the minimum files needed for the app to run.
const URLS_TO_CACHE = [
  '/', // This caches the root URL, which is your index.html
  'manifest.json',
  'favicon.ico',
  'assets/wallpaper.png',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// 1. The 'install' event
// This runs when the service worker is first installed.
self.addEventListener('install', (event) => {
  // We wait until the installation is complete
  event.waitUntil(
    // Open the cache by name
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all the specified URLs to the cache
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. The 'fetch' event
// This runs every time the app makes a network request (e.g., for a file, an image).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Check if the requested file is already in our cache
    caches.match(event.request)
      .then((response) => {
        // If we found a match in the cache, return the cached version.
        if (response) {
          return response;
        }
        // If the file is not in the cache, fetch it from the network.
        return fetch(event.request);
      })
  );
});

// 3. The 'activate' event
// This is a good place to clean up old, unused caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If a cache is not in our whitelist, delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

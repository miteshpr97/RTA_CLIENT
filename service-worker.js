// service-worker.js

const CACHE_NAME = 'rta-v3';
const urlsToCache = [
    '/',
    '/index.html',
    './Login/Login.html',
    './Login/Login.css',
    './Login/login.js',
    './InspectionCockpit/InspectionCockpit.html',
    './InspectionCockpit/InspectionCockpit.css',
    './InspectionCockpit/InspectionCockpit.js',
    './BusNumber/BusNumber.html',
    './BusNumber/BusNumber.css',
    './BusNumber/BusNumber.js',
    './BusReading/BusReading.html',
    './BusReading/BusReading.css',
    './BusReading/BusReading.js',
    './InspectionType/InspectionType.html',
    './InspectionType/InspectionType.css',
    './InspectionType/InspectionType.js',
    './Questions/visualinsQuestion/visualQ1.html',
    './Questions/visualinsQuestion/visualQ2.html',
    './Questions/visualinsQuestion/visualQ3.html',
    './Questions/visualinsQuestion/visualQ4.html',
    './Questions/visualinsQuestion/visualQ5.html',
    './Questions/EngineOpsQuestion/engineQ1.html',
    './Questions/EngineOpsQuestion/engineQ2.html',
    './Questions/EngineOpsQuestion/engineQ3.html',
    './Questions/EngineOpsQuestion/engineQ4.html',
    './Questions/EngineOpsQuestion/engineQ5.html',
    'https://unpkg.com/idb@7.0.2/build/iife/index-min.js',
];

self.addEventListener('install', event => {
    console.log('Service Worker: Installing');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker: Opening cache');
            const cachePromises = urlsToCache.map(url => {
                console.log(`Service Worker: Attempting to cache ${url}`);
                return fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            console.error(`Service Worker: Failed to fetch ${url}, status: ${response.status}`);
                            return null;
                        }
                        console.log(`Service Worker: Successfully fetched ${url}, status: ${response.status}`);
                        return cache.put(url, response);
                    })
                    .catch(error => {
                        console.error(`Service Worker: Fetch failed for ${url}:`, error);
                        return null;
                    });
            });
            return Promise.all(cachePromises).then(() => {
                console.log('Service Worker: Caching completed');
            });
        }).catch(error => {
            console.error('Service Worker: Cache open failed:', error);
        })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
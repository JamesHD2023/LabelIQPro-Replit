const CACHE_NAME = 'labeliq-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Installation event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event - Network First strategy for API calls, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls - Network First with fallback to cache
  if (url.hostname.includes('internal.liq') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If we get a valid response, clone it and store in cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache First strategy
  if (request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.includes('/static/')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // For all other requests, try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline scan results
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-scan-results') {
    event.waitUntil(syncScanResults());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from LabelIQ.Pro',
    icon: '/logo192.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LabelIQ.Pro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync scan results when online
async function syncScanResults() {
  try {
    // Get pending scan results from IndexedDB
    const db = await openDB();
    const transaction = db.transaction(['pendingScans'], 'readonly');
    const objectStore = transaction.objectStore('pendingScans');
    const pendingScans = await objectStore.getAll();

    // Send each pending scan to the server
    for (const scan of pendingScans) {
      try {
        const response = await fetch('/api/scans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scan.data),
        });

        if (response.ok) {
          // Remove from pending scans
          const deleteTransaction = db.transaction(['pendingScans'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('pendingScans');
          await deleteStore.delete(scan.id);
        }
      } catch (error) {
        console.error('Failed to sync scan result:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LabelIQ.ProDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('pendingScans')) {
        const objectStore = db.createObjectStore('pendingScans', { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}
// public/sw.js - Mínimo y funcional
self.addEventListener('install', (event) => {
  console.log('SW instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW activado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/points-loyalty') && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow('/points-loyalty/points');
      }
    })
  );
});
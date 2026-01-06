// public/service-worker.js
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado para puntos');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado para puntos');
  event.waitUntil(self.clients.claim());
});

// Manejar notificación push
self.addEventListener('push', (event) => {
  console.log('Push recibido:', event.data);
  
  const options = {
    body: event.data ? event.data.text() : 'Tienes puntos disponibles',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'points-notification'
  };

  event.waitUntil(
    self.registration.showNotification('¡Recordatorio de puntos!', options)
  );
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event.notification.tag);
  
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/points-loyalty/points') && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow('/points-loyalty/points');
      }
    })
  );
});

// Escuchar mensajes de la página principal
self.addEventListener('message', (event) => {
  console.log('Mensaje recibido en SW:', event.data);
  
  if (event.data.type === 'SHOW_POINTS_NOTIFICATION') {
    const { title, body, userName, points } = event.data;
    
    self.registration.showNotification(title || `¡Hola ${userName}!`, {
      body: body || `Recuerda que tienes ${points} puntos disponibles`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'points-reminder',
      vibrate: [200, 100, 200],
      requireInteraction: false
    });
  }
});
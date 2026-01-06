// public/service-worker.js (versión optimizada para Android)
const CACHE_NAME = 'points-v2';

// Instalación simple
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado');
  event.waitUntil(self.clients.claim());
});

// Manejar mensajes de la app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Mensaje recibido:', event.data.type);
  
  if (event.data.type === 'TEST_NOTIFICATION') {
    const { title, options } = event.data;
    
    event.waitUntil(
      self.registration.showNotification(title, {
        ...options,
        icon: options.icon || '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: false
      })
    );
  }
  
  if (event.data.type === 'DAILY_NOTIFICATION') {
    const { userName, points, businessName, businessLogo } = event.data;
    
    event.waitUntil(
      self.registration.showNotification(
        `¡Hola ${userName}!`,
        {
          body: `Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
          icon: businessLogo || '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'daily-reminder',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'Ver puntos'
            }
          ]
        }
      )
    );
  }
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificación clickeada:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'view') {
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
  }
});
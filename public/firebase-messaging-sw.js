//public/firebase-messaging-sw.js
// Importar scripts de Firebase para Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmOg_UCihT0ps7c6h6xT23Vfuaa99Hbq0",
  authDomain: "arcane-fire-423218-f5.firebaseapp.com",
  projectId: "arcane-fire-423218-f5",
  storageBucket: "arcane-fire-423218-f5.firebasestorage.app",
  messagingSenderId: "936752702411",
  appId: "1:936752702411:web:b3001d1d86f5d4229dcc4e",
  measurementId: "G-Z6E9G2DFZC"
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Configurar manejo de mensajes en background
messaging.onBackgroundMessage((payload) => {
  console.log('[Firebase SW] Mensaje en background recibido:', payload);

  // Personalizar notificación
  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    tag: payload.data?.tag || 'firebase-notification',
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  // Mostrar notificación
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clic en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[Firebase SW] Notificación clickeada:', event.notification.tag);
  
  // Cerrar notificación
  event.notification.close();

  // URL a abrir
  const urlToOpen = '/points-loyalty/points';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // Buscar ventana existente
      for (const client of windowClients) {
        if (client.url.includes('/points-loyalty') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Abrir nueva ventana si no existe
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Manejar eventos de instalación y activación
self.addEventListener('install', (event) => {
  console.log('[Firebase SW] Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Firebase SW] Service Worker activado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'send-notifications') {
    event.waitUntil(
      // Intentar mostrar notificación aunque esté en background
      self.registration.showNotification('Recordatorio', {
        body: 'Sincronización en background',
        icon: '/favicon.ico'
      })
    );
  }
});
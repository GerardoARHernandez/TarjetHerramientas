// public/sw.js (¡mismo nombre y contenido que tu Microsite!)
self.addEventListener("install", function (event) {
  console.log("Service Worker instalado para puntos");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activado para puntos");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notificación clickeada:", event.notification.tag);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes("/points-loyalty/points") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/points-loyalty/points");
      }
    })
  );
});

// Agregar este listener para mensajes
self.addEventListener("message", function (event) {
  console.log("Mensaje recibido en SW:", event.data);
  
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: event.data.tag || "points-notification",
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }
});
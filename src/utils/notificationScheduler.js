// src/utils/notificationScheduler.js
export class WorkingNotificationScheduler {
  constructor(hour = 17, minute = 0) {
    this.hour = hour;
    this.minute = minute;
    this.timeoutId = null;
    this.userData = null;
    this.registration = null;
  }

  async init(userData) {
    this.userData = userData;
    console.log('Inicializando WorkingNotificationScheduler');
    
    // Registrar Service Worker (IMPORTANTE)
    this.registration = await this.registerServiceWorker();
    
    if (userData) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Programar notificaciones si hay permiso
    if (this.hasPermission() && this.registration) {
      this.scheduleNextNotification();
    }
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no soportado');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado:', registration);
      
      // Esperar a que esté listo
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              console.log('Service Worker activado y listo');
              resolve();
            }
          });
        });
      }
      
      return registration;
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      return null;
    }
  }

  // Método PRINCIPAL que SÍ funciona (igual que tu código)
  async showNotification(title, options = {}) {
    if (!this.hasPermission() || !this.registration) {
      throw new Error('Sin permiso o Service Worker no disponible');
    }

    console.log('Mostrando notificación con Service Worker');
    
    try {
      // ESTA ES LA LÍNEA CLAVE QUE SÍ FUNCIONA:
      await this.registration.showNotification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        ...options
      });
      
      return true;
    } catch (error) {
      console.error('Error mostrando notificación:', error);
      throw error;
    }
  }

  // Método de prueba simplificado
  async testNotification() {
    console.log('Ejecutando testNotification');
    
    if (!('Notification' in window)) {
      throw new Error('Notificaciones no soportadas');
    }

    // Solicitar permiso si es necesario
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso no concedido');
      }
      
      // Re-registrar Service Worker después de obtener permiso
      if (!this.registration) {
        this.registration = await this.registerServiceWorker();
      }
    }

    if (Notification.permission !== 'granted' || !this.registration) {
      throw new Error('Sin permiso o Service Worker');
    }

    // Obtener datos
    const data = this.getNotificationData();
    
    console.log('Datos para prueba:', data);

    // Mostrar notificación (USANDO EL MÉTODO QUE SÍ FUNCIONA)
    await this.showNotification(
      `¡Hola ${data.displayName}!`,
      {
        body: `Prueba exitosa. Tienes ${data.displayPoints} puntos disponibles.`,
        tag: 'test-' + Date.now()
      }
    );
    
    console.log('✅ Notificación de prueba mostrada correctamente');
    return true;
  }

  // Método para notificación diaria
  async showDailyNotification() {
    if (!this.hasPermission() || !this.registration || !this.userData) return;
    
    const { userName, points, businessName } = this.userData;
    const today = new Date().toDateString();
    const lastNotification = localStorage.getItem('lastDailyNotification');
    
    if (lastNotification === today || points <= 0) return;
    
    try {
      await this.showNotification(
        `¡Hola ${userName}!`,
        {
          body: `Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
          tag: 'daily-reminder'
        }
      );
      
      localStorage.setItem('lastDailyNotification', today);
    } catch (error) {
      console.error('Error notificación diaria:', error);
    }
  }

  // Métodos auxiliares
  getNotificationData() {
    let displayName = 'Usuario';
    let displayPoints = 0;
    let displayBusiness = 'el establecimiento';

    if (this.userData) {
      displayName = this.userData.userName || displayName;
      displayPoints = this.userData.points || displayPoints;
      displayBusiness = this.userData.businessName || displayBusiness;
    } else {
      const savedData = localStorage.getItem('notificationUserData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          displayName = parsedData.userName || displayName;
          displayPoints = parsedData.points || displayPoints;
          displayBusiness = parsedData.businessName || displayBusiness;
        } catch (e) {
          console.error('Error parseando datos:', e);
        }
      }
    }

    return { displayName, displayPoints, displayBusiness };
  }

  hasPermission() {
    return Notification.permission === 'granted';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      console.log('Permiso:', permission);
      
      if (permission === 'granted') {
        // Asegurar Service Worker
        if (!this.registration) {
          this.registration = await this.registerServiceWorker();
        }
        this.scheduleNextNotification();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error permiso:', error);
      return false;
    }
  }

  calculateTimeUntilNextNotification() {
    const now = new Date();
    const target = new Date();
    target.setHours(this.hour, this.minute, 0, 0);
    
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }
    
    return target.getTime() - now.getTime();
  }

  scheduleNextNotification() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    const timeUntil = this.calculateTimeUntilNextNotification();
    console.log(`Programando notificación en ${timeUntil}ms`);
    
    this.timeoutId = setTimeout(() => {
      this.showDailyNotification();
      this.scheduleNextNotification();
    }, timeUntil);
  }

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
  }

  destroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
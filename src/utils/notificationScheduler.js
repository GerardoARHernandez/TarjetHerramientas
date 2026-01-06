// src/utils/notificationScheduler.js
export class UniversalNotificationScheduler {
  constructor(hour = 17, minute = 0) {
    this.hour = hour;
    this.minute = minute;
    this.timeoutId = null;
    this.userData = null;
    this.isMobile = this.checkIfMobile();
    this.isDesktopMode = false;
  }

  checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Método principal de inicialización
  async init(userData) {
    this.userData = userData;
    
    console.log('Dispositivo:', this.isMobile ? 'Móvil' : 'Escritorio');
    console.log('User Agent:', navigator.userAgent);
    
    // Guardar datos
    if (userData) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Si ya tenemos permiso, programar
    if (this.hasPermission()) {
      this.scheduleNextNotification();
    }
  }

  // Método UNIVERSAL que funciona en ambos modos
  async showNotification(title, options = {}) {
    if (!this.hasPermission()) {
      throw new Error('No hay permiso para notificaciones');
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: false
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // ESTRATEGIA 1: Si es móvil, intentar con Service Worker primero
    if (this.isMobile && 'serviceWorker' in navigator) {
      try {
        console.log('Móvil detectado - usando Service Worker');
        return await this.showNotificationViaServiceWorker(title, mergedOptions);
      } catch (swError) {
        console.log('Fallback a Notification API:', swError);
        // Continuar con fallback
      }
    }

    // ESTRATEGIA 2: Notification API directa (funciona en escritorio y móvil en modo escritorio)
    try {
      console.log('Usando Notification API directa');
      return this.showNotificationDirect(title, mergedOptions);
    } catch (directError) {
      console.log('Error con Notification API:', directError);
      
      // ESTRATEGIA 3: Fallback para móviles - Alert
      if (this.isMobile) {
        console.log('Usando fallback para móviles');
        this.showMobileFallback(title, mergedOptions.body);
        return true;
      }
      
      throw directError;
    }
  }

  // Método específico para Service Worker
  async showNotificationViaServiceWorker(title, options) {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker no soportado');
    }

    // Verificar HTTPS para móviles
    if (this.isMobile && window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost') {
      console.warn('HTTPS recomendado para Service Workers en móviles');
    }

    try {
      // Registrar Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);

      // Esperar a que esté activo
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              resolve();
            }
          });
        });
      }

      // Mostrar notificación VIA SERVICE WORKER (clave para móviles)
      await registration.showNotification(title, options);
      console.log('✅ Notificación mostrada via Service Worker');
      return true;
    } catch (error) {
      console.error('Error con Service Worker:', error);
      throw error;
    }
  }

  // Método para Notification API directa
  showNotificationDirect(title, options) {
    if (typeof Notification === 'undefined') {
      throw new Error('Notification API no disponible');
    }

    // ¡IMPORTANTE! En móviles, `new Notification()` puede fallar
    // Pero en modo escritorio (user agent forzado) funciona
    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-cerrar
    setTimeout(() => {
      try {
        notification.close();
      } catch (e) {
        // Ignorar
      }
    }, 8000);

    return true;
  }

  // Fallback para móviles cuando nada funciona
  showMobileFallback(title, body) {
    console.log('Mostrando fallback móvil');
    
    // Opción 1: Alert nativo
    if (window.alert) {
      alert(`${title}\n\n${body}`);
      return true;
    }
    
    // Opción 2: Toast en la página
    this.showToast(body);
    return true;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      max-width: 90%;
      text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }

  // Método de prueba optimizado
  async testNotification() {
    console.log('=== TEST NOTIFICATION INICIADO ===');
    console.log('Modo:', this.isMobile ? 'Móvil' : 'Escritorio');

    if (!('Notification' in window)) {
      throw new Error('Notificaciones no soportadas en este navegador');
    }

    // Si es móvil, verificar Service Worker
    if (this.isMobile && !('serviceWorker' in navigator)) {
      throw new Error('Service Worker requerido para notificaciones en móvil');
    }

    // Solicitar permiso si es necesario
    if (Notification.permission === 'default') {
      console.log('Solicitando permiso...');
      const permission = await Notification.requestPermission();
      console.log('Permiso:', permission);
      
      if (permission !== 'granted') {
        throw new Error('Permiso no concedido');
      }
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Permiso denegado');
    }

    // Obtener datos
    const data = this.getNotificationData();
    console.log('Datos:', data);

    // Mostrar notificación usando el método universal
    await this.showNotification(
      `¡Hola ${data.displayName}!`,
      {
        body: `✅ Prueba exitosa. Tienes ${data.displayPoints} puntos disponibles.`,
        tag: 'test-' + Date.now(),
        requireInteraction: true
      }
    );

    console.log('✅ Test completado');
    return true;
  }

  // Programar notificación diaria
  scheduleNextNotification() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    const timeUntil = this.calculateTimeUntilNextNotification();
    console.log(`Programando notificación en ${Math.round(timeUntil/1000/60)} minutos`);
    
    this.timeoutId = setTimeout(() => {
      this.showDailyNotification();
      this.scheduleNextNotification();
    }, timeUntil);
  }

  async showDailyNotification() {
    if (!this.hasPermission() || !this.userData) return;
    
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
      return permission === 'granted';
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

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
  }

  destroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
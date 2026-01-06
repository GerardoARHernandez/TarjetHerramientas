// src/utils/notificationScheduler.js (versión Android)
export class SimpleNotificationScheduler {
  constructor(hour = 17, minute = 0) {
    this.hour = hour;
    this.minute = minute;
    this.timeoutId = null;
    this.userData = null;
    this.swRegistration = null;
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.isChrome = /Chrome/.test(navigator.userAgent);
  }

  // Método principal para inicializar
  async init(userData) {
    this.userData = userData;
    console.log('Inicializando para Android Chrome');
    
    // Registrar Service Worker SIEMPRE para Android Chrome
    this.swRegistration = await this.registerServiceWorker();
    
    // Guardar datos
    if (userData) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Configurar escucha de mensajes del Service Worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
    }
    
    // Programar notificaciones si hay permiso
    if (this.hasPermission()) {
      this.scheduleNextNotification();
    }
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker no soportado');
      return null;
    }

    try {
      // Para desarrollo local, permitir HTTP
      if (window.location.protocol !== 'https:' && 
          window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        console.warn('Service Worker requiere HTTPS en producción');
        return null;
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registrado:', registration);
      
      // Esperar activación
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              console.log('Service Worker activado');
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

  // Método universal para mostrar notificaciones en Android
  async showNotification(title, options = {}) {
    if (!this.hasPermission()) {
      throw new Error('No hay permiso para notificaciones');
    }

    const defaultOptions = {
      icon: this.userData?.businessLogo || '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      silent: false
    };

    const mergedOptions = { ...defaultOptions, ...options };

    console.log('Intentando mostrar notificación:', { title, mergedOptions });

    // ESTRATEGIA 1: Service Worker (recomendado para Android)
    if (this.swRegistration) {
      try {
        console.log('Usando Service Worker para notificación');
        await this.swRegistration.showNotification(title, mergedOptions);
        return true;
      } catch (swError) {
        console.log('Error con Service Worker, intentando fallback:', swError);
      }
    }

    // ESTRATEGIA 2: Notification API directa (solo si el contexto lo permite)
    try {
      if (typeof Notification !== 'undefined' && document.visibilityState === 'visible') {
        console.log('Usando Notification API directa');
        const notification = new Notification(title, mergedOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        // Auto-cerrar
        setTimeout(() => notification.close(), 8000);
        return true;
      }
    } catch (directError) {
      console.log('Error con Notification API:', directError);
    }

    // ESTRATEGIA 3: Mensaje al Service Worker activo
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      try {
        console.log('Enviando mensaje al Service Worker');
        navigator.serviceWorker.controller.postMessage({
          type: 'TEST_NOTIFICATION',
          title,
          options: mergedOptions
        });
        return true;
      } catch (msgError) {
        console.error('Error enviando mensaje:', msgError);
      }
    }

    throw new Error('No se pudo mostrar la notificación');
  }

  // Método de prueba específico para Android
  async testNotification() {
    console.log('testNotification iniciado en Android');
    
    // Verificar soporte
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }

    // Solicitar permiso si es necesario
    if (Notification.permission === 'default') {
      console.log('Solicitando permiso...');
      const granted = await this.requestPermission();
      if (!granted) {
        throw new Error('Permiso no concedido por el usuario');
      }
    }

    if (Notification.permission !== 'granted') {
      throw new Error('Permiso denegado para notificaciones');
    }

    // Preparar datos
    const data = this.getNotificationData();
    
    console.log('Datos para notificación:', data);

    // Mostrar notificación de prueba
    try {
      await this.showNotification(
        `¡Hola ${data.displayName}!`,
        {
          body: `✅ Prueba exitosa. Tienes ${data.displayPoints} puntos en ${data.displayBusiness}.`,
          icon: data.displayLogo,
          tag: 'test-' + Date.now(),
          requireInteraction: true
        }
      );
      
      console.log('Notificación de prueba mostrada exitosamente');
      return true;
    } catch (error) {
      console.error('Error en testNotification:', error);
      
      // Fallback para Android específico
      if (this.isAndroid) {
        console.log('Intentando fallback para Android...');
        
        // Fallback 1: Alert nativo
        if (window.alert) {
          alert(`🔔 Notificación de prueba:\n\nHola ${data.displayName}, tienes ${data.displayPoints} puntos disponibles.`);
          return true;
        }
        
        // Fallback 2: Toast (si tienes una librería)
        this.showToast(`Prueba: ${data.displayPoints} puntos disponibles`);
      }
      
      throw error;
    }
  }

  // Obtener datos para notificación
  getNotificationData() {
    let displayName = 'Usuario';
    let displayPoints = 0;
    let displayBusiness = 'nuestro establecimiento';
    let displayLogo = '/favicon.ico';

    if (this.userData) {
      displayName = this.userData.userName || displayName;
      displayPoints = this.userData.points || displayPoints;
      displayBusiness = this.userData.businessName || displayBusiness;
      displayLogo = this.userData.businessLogo || displayLogo;
    } else {
      const savedData = localStorage.getItem('notificationUserData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          displayName = parsedData.userName || displayName;
          displayPoints = parsedData.points || displayPoints;
          displayBusiness = parsedData.businessName || displayBusiness;
          displayLogo = parsedData.businessLogo || displayLogo;
        } catch (e) {
          console.error('Error parseando datos guardados:', e);
        }
      }
    }

    return { displayName, displayPoints, displayBusiness, displayLogo };
  }

  // Toast simple para fallback
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
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }

  // Métodos auxiliares
  hasPermission() {
    return Notification.permission === 'granted';
  }

  async requestPermission() {
    try {
      // En Android Chrome, requestPermission puede fallar si no es desde un evento de usuario
      const permission = await Notification.requestPermission();
      console.log('Resultado permiso:', permission);
      
      if (permission === 'granted') {
        // Reprogramar notificaciones
        this.scheduleNextNotification();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error solicitando permiso:', error);
      
      // Fallback para navegadores antiguos
      if (typeof Notification.requestPermission === 'function') {
        return new Promise((resolve) => {
          Notification.requestPermission((permission) => {
            resolve(permission === 'granted');
          });
        });
      }
      
      return false;
    }
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
          tag: 'daily-reminder',
          requireInteraction: true
        }
      );
      
      localStorage.setItem('lastDailyNotification', today);
    } catch (error) {
      console.error('Error mostrando notificación diaria:', error);
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
    if (navigator.serviceWorker) {
      navigator.serviceWorker.removeEventListener('message', this.handleSWMessage);
    }
  }

  handleSWMessage(event) {
    console.log('Mensaje del Service Worker:', event.data);
  }
}
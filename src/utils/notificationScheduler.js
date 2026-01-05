// src/utils/notificationScheduler.js
export class SimpleNotificationScheduler {
  constructor(hour = 16, minute = 15) {
    this.hour = hour;
    this.minute = minute;
    this.timeoutId = null;
    this.intervalId = null;
    this.userData = null;
    this.isInitialized = false;
  }

  // Método para inicializar
  async init(userData) {
    if (this.isInitialized) return;
    
    this.userData = userData;
    console.log('NotificationScheduler inicializado para', this.hour + ':' + this.minute);
    
    // Guardar datos en localStorage para persistencia
    if (userData && userData.points > 0) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Verificar permiso actual
    if (Notification.permission === 'granted') {
      this.scheduleNextNotification();
    } else if (Notification.permission === 'default') {
      console.log('Permiso pendiente, se solicitará con interacción del usuario');
    }
    
    this.isInitialized = true;
  }

  // Método para actualizar datos del usuario
  updateUserData(newData) {
    if (!this.userData) {
      this.userData = {};
    }
    this.userData = { ...this.userData, ...newData };
    
    // Actualizar localStorage
    if (this.userData.points > 0) {
      localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
    }
  }

  // Calcular tiempo hasta la próxima notificación
  calculateTimeUntilNextNotification() {
    const now = new Date();
    const target = new Date();
    
    // Establecer hora objetivo (ej: 16:15)
    target.setHours(this.hour, this.minute, 0, 0);
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }
    
    const timeUntil = target.getTime() - now.getTime();
    
    console.log(`Tiempo hasta próxima notificación: ${Math.round(timeUntil/1000/60)} minutos`);
    console.log(`Próxima notificación: ${target.toLocaleTimeString()}`);
    
    return timeUntil;
  }

  // Programar la próxima notificación
  scheduleNextNotification() {
    // Limpiar timeout anterior
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const timeUntil = this.calculateTimeUntilNextNotification();
    
    // Programar la notificación
    this.timeoutId = setTimeout(() => {
      this.showScheduledNotification();
      // Reprogramar para el siguiente día
      this.scheduleNextNotification();
    }, timeUntil);
  }

  // Mostrar notificación programada
  async showScheduledNotification() {
    if (!this.hasPermission()) {
      console.log('No hay permiso para mostrar notificación programada');
      return;
    }

    try {
      // Cargar datos desde localStorage si no están en memoria
      if (!this.userData) {
        const savedData = localStorage.getItem('notificationUserData');
        if (savedData) {
          this.userData = JSON.parse(savedData);
        }
      }

      if (!this.userData || !this.userData.userName || this.userData.points <= 0) {
        console.log('Datos insuficientes para mostrar notificación');
        return;
      }

      const { userName, points, businessName, businessLogo } = this.userData;
      const today = new Date().toDateString();
      const lastNotificationDate = localStorage.getItem('lastNotificationDate');
      
      // Solo mostrar una notificación por día
      if (lastNotificationDate === today) {
        console.log('Ya se mostró notificación hoy');
        return;
      }

      console.log('Mostrando notificación programada para:', userName);

      // Mostrar notificación
      const notification = new Notification(
        `¡Hola ${userName}!`,
        {
          body: `Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
          icon: businessLogo || '/favicon.ico',
          badge: '/badge.png',
          tag: `daily-reminder-${Date.now()}`,
          requireInteraction: true
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navegar a la página de puntos
        if (window.location.pathname !== '/points-loyalty/points') {
          window.location.href = '/points-loyalty/points';
        }
      };

      // Cerrar automáticamente después de 10 segundos
      setTimeout(() => {
        try {
          notification.close();
        } catch (e) {
          // Ignorar error si ya fue cerrada
        }
      }, 10000);

      // Guardar que ya mostramos notificación hoy
      localStorage.setItem('lastNotificationDate', today);
      
      console.log('Notificación programada mostrada exitosamente');

    } catch (error) {
      console.error('Error mostrando notificación programada:', error);
    }
  }

  // Método para probar notificación inmediatamente
  async testNotification() {
    console.log('Iniciando testNotification...');
    
    // Verificar soporte
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }

    // Verificar permiso
    if (Notification.permission !== 'granted') {
      throw new Error('Permiso no concedido para notificaciones');
    }

    try {
      // Intentar obtener datos del usuario
      let displayName = 'Usuario';
      let displayPoints = 0;
      let displayBusiness = 'nuestro establecimiento';
      let displayLogo = '/favicon.ico';

      // Primero de userData en memoria
      if (this.userData) {
        displayName = this.userData.userName || displayName;
        displayPoints = this.userData.points || displayPoints;
        displayBusiness = this.userData.businessName || displayBusiness;
        displayLogo = this.userData.businessLogo || displayLogo;
      } 
      // Si no, de localStorage
      else {
        const savedData = localStorage.getItem('notificationUserData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          displayName = parsedData.userName || displayName;
          displayPoints = parsedData.points || displayPoints;
          displayBusiness = parsedData.businessName || displayBusiness;
          displayLogo = parsedData.businessLogo || displayLogo;
        }
      }

      console.log('Mostrando notificación de prueba con datos:', {
        displayName,
        displayPoints,
        displayBusiness
      });

      // Crear notificación de prueba
      const notification = new Notification(
        `¡Hola ${displayName}!`,
        {
          body: `Esta es una notificación de prueba. ${displayPoints > 0 ? `Tienes ${displayPoints} puntos disponibles en ${displayBusiness}.` : 'Bienvenido al sistema de puntos.'}`,
          icon: displayLogo,
          badge: '/badge.png',
          tag: 'test-notification-' + Date.now(),
          requireInteraction: true,
          vibrate: [200, 100, 200] // Para dispositivos móviles
        }
      );

      notification.onclick = () => {
        console.log('Notificación de prueba clickeada');
        window.focus();
        notification.close();
      };

      // Cerrar automáticamente después de 5 segundos
      setTimeout(() => {
        try {
          notification.close();
        } catch (e) {
          // Ignorar error
        }
      }, 5000);

      console.log('Notificación de prueba mostrada exitosamente');
      return true;

    } catch (error) {
      console.error('Error en testNotification:', error);
      throw error;
    }
  }

  // Verificar si tenemos permiso
  hasPermission() {
    return Notification.permission === 'granted';
  }

  // Solicitar permiso (debe llamarse desde un evento de click en móviles)
  async requestPermission() {
    try {
      console.log('Solicitando permiso para notificaciones...');
      
      // Para navegadores modernos (promise-based)
      if (typeof Notification.requestPermission === 'function') {
        const permission = await Notification.requestPermission();
        console.log('Permiso obtenido (promise):', permission);
        
        if (permission === 'granted') {
          this.scheduleNextNotification();
          return true;
        }
        return false;
      } 
      // Para navegadores antiguos (callback-based)
      else if (typeof Notification.requestPermission === 'function') {
        return new Promise((resolve) => {
          Notification.requestPermission((permission) => {
            console.log('Permiso obtenido (callback):', permission);
            
            if (permission === 'granted') {
              this.scheduleNextNotification();
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error solicitando permiso:', error);
      return false;
    }
  }

  // Limpiar recursos
  destroy() {
    console.log('Destruyendo NotificationScheduler...');
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isInitialized = false;
  }
}
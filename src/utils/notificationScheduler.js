// src/utils/notificationScheduler.js
export class NotificationScheduler {
  constructor() {
    this.notificationHour = 16; // 4:00 PM
    this.notificationMinute = 30; // 15 minutos
    this.checkInterval = null;
  }

  // Inicializar programador
  init(userData) {
    this.userData = userData;
    
    // Verificar permiso
    if (!this.hasPermission()) {
      this.requestPermission();
      return;
    }

    // Programar chequeos
    this.scheduleChecks();
    
    // Verificar inmediatamente
    this.checkAndShowNotification();
  }

  hasPermission() {
    return Notification.permission === 'granted';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.scheduleChecks();
        this.checkAndShowNotification();
      }
    } catch (error) {
      console.error('Error solicitando permiso:', error);
    }
  }

  scheduleChecks() {
    // Limpiar intervalo anterior
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Verificar cada minuto para mayor precisión
    this.checkInterval = setInterval(() => {
      this.checkAndShowNotification();
    }, 60 * 1000); // Cada minuto

    // También verificar cuando la página se vuelve visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkAndShowNotification();
      }
    });

    // Calcular tiempo hasta la próxima notificación
    this.scheduleNextCheck();
  }

  // Calcular tiempo exacto para la próxima verificación
  scheduleNextCheck() {
    const now = new Date();
    const nextCheck = this.getNextNotificationTime();
    const timeUntilNextCheck = nextCheck.getTime() - now.getTime();

    // Si ya pasó la hora de hoy, programar para mañana
    if (timeUntilNextCheck < 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(this.notificationHour, this.notificationMinute, 0, 0);
      
      const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
      
      console.log(`Próxima notificación programada para mañana a las ${tomorrow.getHours()}:${tomorrow.getMinutes()}`);
      
      // Programar chequeo para mañana
      setTimeout(() => {
        this.checkAndShowNotification();
      }, timeUntilTomorrow);
    } else {
      console.log(`Próxima notificación programada para hoy a las ${nextCheck.getHours()}:${nextCheck.getMinutes()}`);
      
      // Programar chequeo para hoy
      setTimeout(() => {
        this.checkAndShowNotification();
      }, timeUntilNextCheck);
    }
  }

  // Obtener la próxima hora de notificación
  getNextNotificationTime() {
    const now = new Date();
    const nextTime = new Date();
    
    // Establecer la hora objetivo (16:15)
    nextTime.setHours(this.notificationHour, this.notificationMinute, 0, 0);
    
    // Si ya pasó la hora de hoy, devolver mañana
    if (now > nextTime) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    return nextTime;
  }

  checkAndShowNotification() {
    const now = new Date();
    const today = now.toDateString();
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    
    // Solo mostrar una notificación por día
    if (lastNotificationDate === today) {
      return;
    }

    // Verificar si es hora exacta de la notificación (16:15)
    if (now.getHours() === this.notificationHour && now.getMinutes() === this.notificationMinute) {
      this.showNotification();
      localStorage.setItem('lastNotificationDate', today);
      
      // Reprogramar para mañana
      this.scheduleNextCheck();
    }
  }

  // Versión mejorada con margen de error (opcional)
  checkAndShowNotificationWithMargin() {
    const now = new Date();
    const today = now.toDateString();
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    
    // Solo mostrar una notificación por día
    if (lastNotificationDate === today) {
      return;
    }

    // Margen de +/- 1 minuto para evitar perder la notificación
    const targetHour = this.notificationHour;
    const targetMinute = this.notificationMinute;
    
    // Crear tiempo objetivo
    const targetTime = new Date();
    targetTime.setHours(targetHour, targetMinute, 0, 0);
    
    // Calcular diferencia en minutos
    const diffInMinutes = Math.abs(now - targetTime) / (1000 * 60);
    
    // Mostrar notificación si estamos dentro de 1 minuto del tiempo objetivo
    if (diffInMinutes <= 1) {
      this.showNotification();
      localStorage.setItem('lastNotificationDate', today);
      
      // Reprogramar para mañana
      this.scheduleNextCheck();
    }
  }

  showNotification() {
    if (!this.userData || !this.hasPermission()) return;

    const { userName, points, businessName, businessLogo } = this.userData;
    
    if (points > 0) {
      const notification = new Notification(
        `¡Hola ${userName}!`,
        {
          body: `Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
          icon: businessLogo || '/favicon.ico',
          badge: '/badge.png',
          tag: 'daily-points-reminder',
          requireInteraction: true,
          // Opcional: vibrar en dispositivos móviles
          vibrate: [200, 100, 200]
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navegar a la página de puntos si es posible
        if (window.location.pathname !== '/points-loyalty/points') {
          window.location.href = '/points-loyalty/points';
        }
      };

      // Cerrar automáticamente después de 10 segundos
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    
    // Guardar en localStorage para persistencia
    if (this.userData.points > 0) {
      localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
    }
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    // Remover event listeners
    document.removeEventListener('visibilitychange', this.checkAndShowNotification);
  }
}

// Versión alternativa más simple
export class SimpleNotificationScheduler {
  constructor(hour = 16, minute = 15) {
    this.hour = hour;
    this.minute = minute;
    this.intervalId = null;
    this.timeoutId = null;
  }

  init(userData) {
    this.userData = userData;
    
    if (!this.hasPermission()) {
      this.requestPermission();
      return;
    }

    // Calcular tiempo hasta la próxima notificación
    this.scheduleNextNotification();
    
    // También verificar cada vez que la página se hace visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  hasPermission() {
    return Notification.permission === 'granted';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error solicitando permiso:', error);
      return false;
    }
  }

  calculateTimeUntilNextNotification() {
    const now = new Date();
    const target = new Date();
    
    // Establecer hora objetivo (16:15)
    target.setHours(this.hour, this.minute, 0, 0);
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }
    
    return target.getTime() - now.getTime();
  }

  scheduleNextNotification() {
    // Limpiar timeout anterior
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const timeUntilNotification = this.calculateTimeUntilNextNotification();
    const nextNotificationTime = new Date(Date.now() + timeUntilNotification);
    
    console.log(`Notificación programada para: ${nextNotificationTime.toLocaleTimeString()}`);
    
    this.timeoutId = setTimeout(() => {
      this.showNotification();
      
      // Programar la siguiente notificación para mañana
      this.scheduleNextNotification();
    }, timeUntilNotification);
  }

  handleVisibilityChange() {
    if (!document.hidden) {
      // Cuando la página se vuelve visible, verificar si deberíamos mostrar notificación
      const now = new Date();
      const today = now.toDateString();
      const lastNotificationDate = localStorage.getItem('lastNotificationDate');
      
      // Si no hemos mostrado notificación hoy y es después de las 16:15
      if (lastNotificationDate !== today) {
        const targetHour = this.hour;
        const targetMinute = this.minute;
        
        // Verificar si ya pasó la hora de hoy
        if (
          now.getHours() > targetHour || 
          (now.getHours() === targetHour && now.getMinutes() >= targetMinute)
        ) {
          this.showNotification();
          localStorage.setItem('lastNotificationDate', today);
        }
      }
    }
  }

  showNotification() {
    if (!this.userData || !this.hasPermission()) return;

    const { userName, points, businessName, businessLogo } = this.userData;
    
    if (points > 0) {
      const today = new Date().toDateString();
      localStorage.setItem('lastNotificationDate', today);
      
      const notification = new Notification(
        `¡Hola ${userName}!`,
        {
          body: `Recuerda que tienes ${points} puntos disponibles en ${businessName} xd`,
          icon: businessLogo || '/favicon.ico',
          badge: '/badge.png',
          tag: `daily-reminder-${today}`,
          requireInteraction: true
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
        
        if (window.location.pathname !== '/points-loyalty/points') {
          window.location.href = '/points-loyalty/points';
        }
      };

      // Cerrar después de 8 segundos
      setTimeout(() => notification.close(), 8000);
    }
  }

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    
    if (this.userData.points > 0) {
      localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
    }
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
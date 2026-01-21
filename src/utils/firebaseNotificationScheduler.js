import { firebaseConfig, messaging, checkFirebaseSupport } from '../firebase/config';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

export class FirebaseNotificationScheduler {
  constructor(hour = 17, minute = 3) {
    this.hour = hour;
    this.minute = minute;
    this.timeoutId = null;
    this.userData = null;
    this.isMobile = this.checkIfMobile();
    this.vapidKey = "BCHcLjBBpycW_V6v5Uf4-iDUiTkR00x-sp4_Yehh9m3nDNQtwBLt9x-bPCtljSwaLznVIEPpJoTo6nlJLpzSUFA"
    
    this.token = null;
    this.isFirebaseInitialized = false;
    this.fcmSupported = false;
    
    // Inicializar Firebase de forma asíncrona
    this.initializeFirebase();
  }

  async initializeFirebase() {
    try {
      this.fcmSupported = await checkFirebaseSupport();
      
      if (this.fcmSupported && messaging) {
        this.isFirebaseInitialized = true;
        console.log('✅ Firebase Cloud Messaging compatible e inicializado');
        
        // Configurar mensajes en primer plano
        this.setupForegroundMessages();
      } else {
        console.log('⚠️ Firebase Messaging no disponible, usando notificaciones nativas');
        this.isFirebaseInitialized = false;
      }
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      this.isFirebaseInitialized = false;
    }
  }

  checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  setupForegroundMessages() {
    if (!this.isFirebaseInitialized || !messaging) return;

    // Escuchar mensajes cuando la app está en primer plano
    onMessage(messaging, (payload) => {
      console.log('📱 Mensaje FCM en primer plano:', payload);
      
      // Mostrar notificación inmediatamente
      this.showForegroundNotification(payload);
    });
  }

  showForegroundNotification(payload) {
    const { title, body, icon } = payload.notification || {};
    const notificationTitle = title || 'Nueva notificación';
    
    const notificationOptions = {
      body: body || 'Tienes una nueva notificación',
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'fcm-foreground-' + Date.now(),
      requireInteraction: false,
      vibrate: [200, 100, 200]
    };

    // Solo mostrar si tenemos permisos
    if (Notification.permission === 'granted') {
      const notification = new Notification(notificationTitle, notificationOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        // Redirigir a la página de puntos
        if (window.location.pathname !== '/points-loyalty/points') {
          window.location.href = '/points-loyalty/points';
        }
      };
    }
  }

  async init(userData) {
    this.userData = userData;
    
    console.log('📱 Dispositivo:', this.isMobile ? 'Móvil' : 'Escritorio');
    console.log('🔥 Firebase:', this.isFirebaseInitialized ? 'Activado' : 'Desactivado');
    
    // Guardar datos del usuario
    if (userData) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Si tenemos permisos, obtener token y programar
    if (await this.hasPermission()) {
      await this.getFCMToken();
      this.scheduleNextNotification();
    }
  }

  async getFCMToken() {
    // Solo intentar con Firebase si está inicializado
    if (this.isFirebaseInitialized && messaging) {
      try {
        // Registrar Service Worker para Firebase si no está registrado
        let serviceWorkerRegistration;
        
        if ('serviceWorker' in navigator) {
          try {
            // Intentar obtener el registration existente
            serviceWorkerRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
            
            if (!serviceWorkerRegistration) {
              // Registrar nuevo Service Worker
              serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
              console.log('✅ Service Worker de Firebase registrado');
            }
          } catch (swError) {
            console.warn('⚠️ Error con Service Worker:', swError);
          }
        }

        // Obtener token FCM
        const currentToken = await getToken(messaging, {
          vapidKey: this.vapidKey,
          serviceWorkerRegistration: serviceWorkerRegistration
        });

        if (currentToken) {
          console.log('✅ Token FCM obtenido (primeros 20 chars):', currentToken.substring(0, 20) + '...');
          this.token = currentToken;
          localStorage.setItem('fcmToken', currentToken);
          
          // Enviar token al backend
          await this.sendTokenToServer(currentToken);
          
          return currentToken;
        } else {
          console.log('⚠️ No se pudo obtener token FCM - usuario puede haber bloqueado notificaciones');
        }
      } catch (error) {
        console.error('❌ Error obteniendo token FCM:', error);
        
        // Error específico para VAPID key incorrecta
        if (error.code === 'messaging/invalid-vapid-key') {
          console.error('❌ VAPID Key incorrecta. Obtén una nueva de Firebase Console');
        }
      }
    } else {
      console.log('⚠️ Firebase no inicializado, usando modo nativo');
    }
    
    return null;
  }

  async sendTokenToServer(token) {
    // Simulación de envío al backend
    console.log('📤 Token listo para enviar al backend:', token.substring(0, 20) + '...');
    
    // En producción, implementa esto:
    /*
    try {
      const response = await fetch('/api/save-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          userId: this.userData?.userId,
          platform: this.isMobile ? 'mobile' : 'desktop'
        })
      });
      
      if (response.ok) {
        console.log('✅ Token guardado en backend');
      }
    } catch (error) {
      console.error('❌ Error enviando token:', error);
    }
    */
  }

  async hasPermission() {
    return Notification.permission === 'granted';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permiso concedido');
        
        // Obtener token FCM si Firebase está disponible
        let token = null;
        if (this.isFirebaseInitialized) {
          token = await this.getFCMToken();
        }
        
        return {
          granted: true,
          token,
          isFirebase: this.isFirebaseInitialized,
          canReceiveInBackground: this.isFirebaseInitialized
        };
      } else {
        console.log('❌ Permiso denegado');
        return {
          granted: false,
          token: null,
          isFirebase: false,
          canReceiveInBackground: false
        };
      }
    } catch (error) {
      console.error('❌ Error solicitando permiso:', error);
      return {
        granted: false,
        token: null,
        isFirebase: false,
        canReceiveInBackground: false
      };
    }
  }

  async showNotification(title, options = {}) {
    // Verificar permisos
    if (!(await this.hasPermission())) {
      throw new Error('No hay permiso para notificaciones');
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Estrategia según disponibilidad
    if (this.isFirebaseInitialized) {
      console.log('🔥 Usando notificación nativa (FCM para background)');
      // FCM manejará las notificaciones en background
      // Aquí solo mostramos en foreground
    }
    
    return this.showNativeNotification(title, mergedOptions);
  }

  showNativeNotification(title, options) {
    if (typeof Notification === 'undefined') {
      throw new Error('API de notificaciones no disponible');
    }

    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (window.location.pathname !== '/points-loyalty/points') {
        window.location.href = '/points-loyalty/points';
      }
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

  async testNotification() {
    console.log('🧪 Iniciando prueba completa de notificaciones...');

    if (!('Notification' in window)) {
      throw new Error('Tu navegador no soporta notificaciones');
    }

    // Verificar/obtener permisos
    if (Notification.permission === 'default') {
      const result = await this.requestPermission();
      if (!result.granted) {
        throw new Error('Permiso no concedido por el usuario');
      }
      
      console.log('📱 Capacidades:', {
        firebase: result.isFirebase,
        background: result.canReceiveInBackground
      });
    } else if (Notification.permission !== 'granted') {
      throw new Error('Permiso denegado previamente. Revise configuración del navegador.');
    }

    // Obtener datos
    const data = this.getNotificationData();
    
    // Información sobre capacidades
    const capabilities = {
      platform: this.isMobile ? 'mobile' : 'desktop',
      firebaseEnabled: this.isFirebaseInitialized,
      canReceiveInBackground: this.isFirebaseInitialized,
      token: this.token ? 'Disponible' : 'No disponible'
    };
    
    console.log('🔧 Capacidades del sistema:', capabilities);
    
    // Mostrar notificación de prueba
    await this.showNotification(
      `🧪 Prueba ${this.isMobile ? 'Móvil' : 'PC'}`,
      {
        body: `✅ Sistema ${this.isFirebaseInitialized ? 'FCM' : 'Nativo'} activo\n` +
              `Puntos: ${data.displayPoints}\n` +
              `Background: ${this.isFirebaseInitialized ? '✅ Sí' : '❌ Solo con app abierta'}`,
        tag: 'test-' + Date.now(),
        requireInteraction: true,
        icon: this.userData?.businessLogo || '/favicon.ico'
      }
    );

    console.log('✅ Prueba completada');
    
    // Información para el usuario
    if (this.isMobile) {
      setTimeout(() => {
        alert(
          `📱 Prueba completada en ${this.isMobile ? 'Móvil' : 'PC'}\n\n` +
          `Firebase FCM: ${this.isFirebaseInitialized ? '✅ ACTIVADO' : '❌ DESACTIVADO'}\n` +
          `Notificaciones en background: ${this.isFirebaseInitialized ? '✅ POSIBLE' : '❌ Solo con app abierta'}\n\n` +
          `Para habilitar notificaciones en background:\n` +
          `1. Asegúrate de usar HTTPS (no localhost)\n` +
          `2. Verifica la VAPID Key en Firebase\n` +
          `3. Instala como PWA para mejor experiencia`
        );
      }, 1000);
    }

    return {
      success: true,
      method: this.isFirebaseInitialized ? 'firebase' : 'native',
      canReceiveInBackground: this.isFirebaseInitialized,
      token: this.token
    };
  }

  getNotificationData() {
    let displayName = 'Usuario';
    let displayPoints = 0;
    let displayBusiness = 'nuestro establecimiento';

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
          console.error('Error parseando datos guardados:', e);
        }
      }
    }

    return { displayName, displayPoints, displayBusiness };
  }

  scheduleNextNotification() {
    // Limpiar timeout anterior
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    const timeUntil = this.calculateTimeUntilNextNotification();
    const minutes = Math.round(timeUntil / 1000 / 60);
    
    console.log(`⏰ Programando próxima notificación en ${minutes} minutos`);
    
    this.timeoutId = setTimeout(() => {
      this.showDailyNotification();
      this.scheduleNextNotification();
    }, timeUntil);
  }

  async showDailyNotification() {
    if (!(await this.hasPermission()) || !this.userData) return;
    
    const { userName, points, businessName } = this.userData;
    const today = new Date().toDateString();
    const lastNotification = localStorage.getItem('lastDailyNotification');
    
    // Verificar si ya se mostró hoy o si no hay puntos
    if (lastNotification === today || points <= 0) return;
    
    try {
      await this.showNotification(
        `📅 Recordatorio Diario`,
        {
          body: `¡Hola ${userName}! Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
          tag: 'daily-reminder',
          icon: this.userData?.businessLogo || '/favicon.ico'
        }
      );
      
      // Guardar fecha de última notificación
      localStorage.setItem('lastDailyNotification', today);
      console.log('✅ Notificación diaria enviada');
    } catch (error) {
      console.error('❌ Error mostrando notificación diaria:', error);
    }
  }

  calculateTimeUntilNextNotification() {
    const now = new Date();
    const target = new Date();
    
    target.setHours(this.hour, this.minute, 0, 0);
    
    // Si ya pasó la hora de hoy, programar para mañana
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }
    
    return target.getTime() - now.getTime();
  }

  async unsubscribe() {
    try {
      // Eliminar token de Firebase
      if (this.isFirebaseInitialized && messaging && this.token) {
        await deleteToken(messaging);
        console.log('✅ Token FCM eliminado');
      }
      
      // Limpiar timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      // Limpiar localStorage
      localStorage.removeItem('fcmToken');
      localStorage.removeItem('lastDailyNotification');
      
      console.log('✅ Desuscrito de notificaciones');
      return true;
    } catch (error) {
      console.error('❌ Error desuscribiendo:', error);
      return false;
    }
  }

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    localStorage.setItem('notificationUserData', JSON.stringify(this.userData));
    console.log('✅ Datos de notificación actualizados');
  }

  destroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    console.log('✅ Notification scheduler destruido');
  }
}
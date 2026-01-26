// src/utils/firebaseNotificationScheduler.js
import { firebaseConfig, messaging, checkFirebaseSupport } from '../firebase/config';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

export class FirebaseNotificationScheduler {
  constructor(scheduleHours = [9, 11, 13, 15, 17, 19, 21], minute = 0) {
    this.scheduleHours = scheduleHours;
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

  // Función para verificar si Notification está disponible de forma segura
  isNotificationAvailable() {
    return this.safeNotificationCheck();
  }

  // Función para obtener permiso de forma segura
  getNotificationPermission() {
    if (!this.isNotificationAvailable()) {
      return 'denied';
    }
    return Notification.permission;
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

    // Solo mostrar si tenemos permisos y Notification está disponible
    if (this.isNotificationAvailable() && this.getNotificationPermission() === 'granted') {
      try {
        const notification = new Notification(notificationTitle, notificationOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
          if (window.location.pathname !== '/points-loyalty/points') {
            window.location.href = '/points-loyalty/points';
          }
        };
      } catch (error) {
        console.error('Error creando notificación:', error);
      }
    }
  }

  async init(userData) {
    this.userData = userData;
    
    console.log('📱 Dispositivo:', this.isMobile ? 'Móvil' : 'Escritorio');
    console.log('🔥 Firebase:', this.isFirebaseInitialized ? 'Activado' : 'Desactivado');
    console.log('⏰ Horarios programados:', this.scheduleHours.map(h => `${h}:${this.minute.toString().padStart(2, '0')}`).join(', '));
    
    // Guardar datos del usuario
    if (userData) {
      localStorage.setItem('notificationUserData', JSON.stringify(userData));
    }
    
    // Si tenemos permisos, obtener token y programar
    if (await this.hasPermission()) {
      await this.getFCMToken();
      this.startScheduledNotifications();
    }
  }

  async hasPermission() {
    if (!this.isNotificationAvailable()) {
      return false;
    }
    return this.getNotificationPermission() === 'granted';
  }

  async requestPermission() {
    try {
      console.log('🔄 Solicitando permiso para notificaciones...');
      
      // Verificar si Notification está disponible
      if (!this.isNotificationAvailable()) {
        console.log('❌ API de Notificaciones no disponible en este navegador');
        return {
          granted: false,
          token: null,
          isFirebase: false,
          canReceiveInBackground: false
        };
      }
      
      const permission = await Notification.requestPermission();
      console.log('Permiso resultante:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Permiso concedido');
        
        // Obtener token FCM inmediatamente después del permiso
        let token = null;
        if (this.isFirebaseInitialized) {
          console.log('🔄 Obteniendo token FCM después del permiso...');
          token = await this.getFCMToken();
          
          if (token) {
            console.log('✅ Token FCM obtenido después del permiso');
            // Programar notificaciones ahora que tenemos token
            this.startScheduledNotifications();
          }
        }
        
        return {
          granted: true,
          token,
          isFirebase: this.isFirebaseInitialized,
          canReceiveInBackground: !!token
        };
      } else {
        console.log('❌ Permiso denegado:', permission);
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

  // También corrige showNotificationDesktop:
  async showNotificationDesktop(title, options) {
    console.log('💻 Usando notificación para escritorio...');
    
    // Usar nuestra función segura para verificar disponibilidad
    if (!this.isNotificationAvailable()) {
      throw new Error('API de notificaciones no disponible');
    }

    try {
      // Intentar con Notification API directa
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
    } catch (error) {
      console.error('❌ Error con Notification API:', error);
      
      // Si falla en escritorio, intentar con Service Worker también
      if ('serviceWorker' in navigator) {
        console.log('🔄 Fallback a Service Worker en escritorio');
        return await this.showNotificationViaServiceWorker(title, options);
      }
      
      throw error;
    }
  }
 
  safeNotificationCheck() {
    // Verificar de forma segura si Notification está disponible
    if (typeof window === 'undefined') return false;
    
    try {
      // Intenta acceder a Notification de forma segura
      if (!('Notification' in window)) return false;
      if (typeof window.Notification === 'undefined') return false;
      if (typeof window.Notification.requestPermission === 'undefined') return false;
      
      // Intenta acceder a una propiedad para ver si realmente funciona
      return window.Notification.permission !== undefined;
    } catch (error) {
      console.log('Notification no disponible:', error.message);
      return false;
    }
  }

  async testNotification() {
  console.log('🧪 Iniciando prueba completa de notificaciones...');
  console.log('📱 Es móvil:', this.isMobile);
  console.log('🌐 Protocolo:', window.location.protocol);

  // Verificación segura de Notification - USAR LA FUNCIÓN SEGURA
  if (!this.isNotificationAvailable()) {
    throw new Error('Tu navegador no soporta notificaciones');
  }

  // Información específica para móviles
  if (this.isMobile) {
    console.log('📱 MODO MÓVIL DETECTADO - Configuración especial:');
    console.log('• Usará Service Worker obligatoriamente');
    console.log('• HTTPS requerido:', window.location.protocol === 'https:');
    console.log('• Service Worker soportado:', 'serviceWorker' in navigator);
    
    // Verificar HTTPS en móvil
    if (window.location.protocol !== 'https:' && 
        !window.location.hostname.includes('localhost')) {
      console.warn('⚠️ Móvil requiere HTTPS para notificaciones confiables');
    }
  }

  // Verificar/obtener permisos - USAR getNotificationPermission()
  if (this.getNotificationPermission() === 'default') {
    console.log('🔄 Solicitando permiso...');
    
    // En móvil, mostrar mensaje especial antes de pedir permiso
    if (this.isMobile) {
      const shouldContinue = confirm(
        '📱 Modo móvil detectado\n\n' +
        'Para notificaciones en móvil:\n' +
        '1. Acepta el permiso cuando aparezca\n' +
        '2. Permite las notificaciones\n' +
        '3. Para mejor experiencia, instala como PWA\n\n' +
        '¿Continuar con la prueba?'
      );
      
      if (!shouldContinue) {
        throw new Error('Prueba cancelada por el usuario');
      }
    }
    
    const result = await this.requestPermission();
    if (!result.granted) {
      throw new Error('Permiso no concedido por el usuario');
    }
    
    console.log('✅ Permiso concedido');
    console.log('- Firebase activo:', result.isFirebase);
    console.log('- Background disponible:', result.canReceiveInBackground);
    console.log('- Token obtenido:', result.token ? 'Sí' : 'No');
  } else if (this.getNotificationPermission() !== 'granted') {
    throw new Error('Permiso denegado previamente. Revise configuración del navegador.');
  }

  if (this.getNotificationPermission() === 'granted' && this.isFirebaseInitialized) {
    console.log('🔄 Verificando token FCM...');
    
    if (!this.token) {
      console.log('🔄 No hay token, obteniendo uno...');
      await this.getFCMToken();
    } else {
      console.log('✅ Token ya disponible');
      console.log('Token:', this.token ? this.token.substring(0, 30) + '...' : 'No disponible');
    }
  }

  // Si ya teníamos permiso, obtener token ahora
  if (this.getNotificationPermission() === 'granted' && this.isFirebaseInitialized && !this.token) {
    console.log('🔄 Obteniendo token FCM...');
    await this.getFCMToken();
  }

  // Obtener datos
  const data = this.getNotificationData();
  
  // Información sobre capacidades
  const capabilities = {
    platform: this.isMobile ? 'mobile' : 'desktop',
    firebaseEnabled: this.isFirebaseInitialized,
    canReceiveInBackground: this.isFirebaseInitialized && !!this.token,
    token: this.token ? 'Disponible' : 'No disponible',
    notificationMethod: this.isMobile ? 'Service Worker' : 'Notification API'
  };
  
  console.log('🔧 Capacidades del sistema:', capabilities);
  
  // Mostrar información del horario
  const scheduleInfo = this.getScheduleInfo();
  console.log('📅 Horario programado:', scheduleInfo.scheduleString);
  console.log('⏰ Próxima notificación:', scheduleInfo.nextTime);
  
  // Mostrar notificación de prueba
  console.log('🔄 Mostrando notificación de prueba...');
  
  await this.showNotification(
    `🧪 Prueba ${this.isMobile ? 'Móvil' : 'PC'}`,
    {
      body: `✅ Sistema ${this.isFirebaseInitialized ? 'FCM' : 'Nativo'} activo\n` +
            `Puntos: ${data.displayPoints}\n` +
            `Método: ${this.isMobile ? 'Service Worker' : 'API nativa'}\n` +
            `Horario: ${scheduleInfo.scheduleString}\n` +
            `Próxima: ${scheduleInfo.nextTime}`,
      tag: 'test-' + Date.now(),
      requireInteraction: true,
      icon: this.userData?.businessLogo || '/favicon.ico',
      data: {
        test: 'true',
        platform: this.isMobile ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString()
      }
    }
  );

  console.log('✅✅✅ Prueba completada exitosamente');
  
  // Mensaje informativo para móvil
  if (this.isMobile) {
    const mobileInfo = `
📱 PRUEBA MÓVIL COMPLETADA
────────────────────────
• Método usado: Service Worker ✅
• Firebase FCM: ${this.isFirebaseInitialized ? 'ACTIVADO' : 'DESACTIVADO'}
• Token FCM: ${this.token ? 'OBTENIDO' : 'NO OBTENIDO'}
• Background: ${this.isFirebaseInitialized && this.token ? 'POSIBLE' : 'Solo foreground'}
• Horario programado: ${scheduleInfo.scheduleString}
• Próxima notificación: ${scheduleInfo.nextTime}

${!this.token ? `
⚠️ PARA NOTIFICACIONES EN BACKGROUND:
────────────────────────
1. Necesitas HTTPS (no HTTP)
2. Configura correctamente Firebase
3. Instala como PWA para mejor experiencia
` : '✅ Listo para notificaciones en background'}

💡 CONSEJOS PARA MÓVIL:
────────────────────────
• Para pruebas, usa "Modo escritorio" en Chrome móvil
• O instala la app como PWA
• Asegúrate de aceptar todos los permisos
    `;
    
    console.log(mobileInfo);
    
    // Mostrar alerta informativa
    setTimeout(() => {
      alert(mobileInfo);
    }, 1500);
  }

  return {
    success: true,
    method: this.isFirebaseInitialized ? 'firebase' : 'native',
    canReceiveInBackground: this.isFirebaseInitialized && !!this.token,
    token: this.token,
    platform: this.isMobile ? 'mobile' : 'desktop',
    schedule: scheduleInfo
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

  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      // Registrar sincronización en background
      await registration.sync.register('send-notifications');
      console.log('✅ Background Sync registrado');
    }
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
      localStorage.removeItem('scheduledNotifications');
      localStorage.removeItem('intervalNotifications');
      
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
//src/utils/firebaseNotificationScheduler.js
import { firebaseConfig, messaging, checkFirebaseSupport } from '../firebase/config';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

export class FirebaseNotificationScheduler {
  constructor(hour = 18, minute = 12) {
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
    if (this.isFirebaseInitialized && messaging) {
      try {
        console.log('🔄 Intentando obtener token FCM...');
        console.log('VAPID Key configurada:', !!this.vapidKey);
        
        let serviceWorkerRegistration = null;
        
        if ('serviceWorker' in navigator) {
          try {
            // Obtener el Service Worker registrado
            serviceWorkerRegistration = await navigator.serviceWorker.ready;
            console.log('✅ Service Worker listo:', serviceWorkerRegistration);
            
            // Verificar que tenemos el Service Worker correcto
            const registrations = await navigator.serviceWorker.getRegistrations();
            console.log('📋 Service Workers registrados:', registrations.length);
            
            for (const reg of registrations) {
              console.log(`SW: ${reg.scope}, Estado: ${reg.active?.state}`);
              if (reg.active && reg.active.scriptURL.includes('firebase-messaging')) {
                serviceWorkerRegistration = reg;
                console.log('✅ Firebase Service Worker encontrado');
                break;
              }
            }
            
          } catch (swError) {
            console.error('❌ Error obteniendo Service Worker:', swError);
            return null;
          }
        }

        if (serviceWorkerRegistration) {
          console.log('🔑 Solicitando token FCM con Service Worker...');
          
          try {
            // IMPORTANTE: Usar getToken con la configuración correcta
            const currentToken = await getToken(messaging, {
              vapidKey: this.vapidKey,
              serviceWorkerRegistration: serviceWorkerRegistration
            });

            if (currentToken) {
              console.log('✅✅✅ TOKEN FCM OBTENIDO EXITOSAMENTE');
              console.log('Token (primeros 30):', currentToken.substring(0, 30) + '...');
              console.log('Longitud:', currentToken.length);
              
              this.token = currentToken;
              localStorage.setItem('fcmToken', currentToken);
              
              // Mostrar información del token
              this.showTokenDebugInfo(currentToken);
              
              return currentToken;
            } else {
              console.log('⚠️ getToken() devolvió null/undefined');
              console.log('Posibles causas:');
              console.log('1. Permisos de notificación no concedidos');
              console.log('2. VAPID Key incorrecta');
              console.log('3. Service Worker no tiene permisos');
              
              // Diagnosticar el error
              await this.diagnoseFCMError();
            }
          } catch (tokenError) {
            console.error('❌ Error en getToken():', tokenError);
            console.error('Código de error:', tokenError.code);
            console.error('Mensaje:', tokenError.message);
            
            if (tokenError.code === 'messaging/invalid-vapid-key') {
              console.error('🔥 ERROR: VAPID Key incorrecta!');
              console.error('Tu VAPID Key:', this.vapidKey);
              alert('❌ Error: VAPID Key incorrecta. Verifica en Firebase Console');
            }
          }
        } else {
          console.log('⚠️ No hay Service Worker disponible');
        }
      } catch (error) {
        console.error('❌ Error general obteniendo token FCM:', error);
      }
    } else {
      console.log('⚠️ Firebase no inicializado para obtener token');
      console.log('isFirebaseInitialized:', this.isFirebaseInitialized);
      console.log('messaging:', !!messaging);
    }
    
    return null;
  }

  async diagnoseFCMError() {
    console.log('🔍 DIAGNÓSTICO FCM:');
    
    // 1. Verificar permisos
    console.log('Permiso notificaciones:', Notification.permission);
    
    // 2. Verificar Service Worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('Service Workers:', registrations.length);
      registrations.forEach(reg => {
        console.log('- Scope:', reg.scope);
        console.log('  Estado:', reg.active?.state);
        console.log('  Script:', reg.active?.scriptURL);
      });
    }
    
    // 3. Verificar Firebase
    console.log('Firebase configurado:', this.isFirebaseInitialized);
    console.log('VAPID Key longitud:', this.vapidKey?.length || 0);
    
    // 4. Verificar localStorage
    const savedToken = localStorage.getItem('fcmToken');
    console.log('Token guardado anteriormente:', savedToken ? 'Sí' : 'No');
    
    // 5. Verificar HTTPS
    console.log('HTTPS:', window.location.protocol === 'https:');
  }

  showTokenDebugInfo(token) {
    console.log('📊 INFORMACIÓN DEL TOKEN FCM:');
    console.log('Token completo:', token);
    console.log('Longitud:', token.length);
    console.log('Comienza con:', token.substring(0, 3));
    console.log('Formato válido:', /^[A-Za-z0-9_-]+$/.test(token));
    
    // Guardar para debugging
    localStorage.setItem('fcmTokenDebug', JSON.stringify({
      tokenPreview: token.substring(0, 20) + '...',
      length: token.length,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }));
  }

async createDynamicServiceWorker() {
  console.log('🛠️ Creando Service Worker dinámico...');
  
  // Crear un Service Worker básico en memoria
  const swContent = `
// Dynamic Service Worker for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

try {
  const firebaseConfig = ${JSON.stringify(firebaseConfig)};
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[Dynamic SW] Background message:', payload);
    const notificationTitle = payload.notification?.title || 'Notificación';
    const notificationOptions = {
      body: payload.notification?.body || 'Nueva notificación',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: payload.data || {}
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
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
  });

  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  console.log('[Dynamic SW] Firebase inicializado');
} catch (error) {
  console.error('[Dynamic SW] Error:', error);
}
`;

  // Crear blob URL para el Service Worker
  const blob = new Blob([swContent], { type: 'application/javascript' });
  const swUrl = URL.createObjectURL(blob);
  
  // Registrar el Service Worker dinámico
  const registration = await navigator.serviceWorker.register(swUrl, {
    scope: '/',
    updateViaCache: 'none'
  });
  
  console.log('✅ Service Worker dinámico registrado');
  
  // Limpiar URL después del registro
  setTimeout(() => URL.revokeObjectURL(swUrl), 1000);
  
  return registration;
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
    console.log('🔄 Solicitando permiso para notificaciones...');
    
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
          this.scheduleNextNotification();
        }
      }
      
      return {
        granted: true,
        token,
        isFirebase: this.isFirebaseInitialized,
        canReceiveInBackground: !!token // Solo true si tenemos token
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

  async showNotification(title, options = {}) {
  console.log('🎬 showNotification() INICIADO');
  console.log('Título:', title);
  console.log('Opciones:', options);
  
  try {
    // Verificar permisos
    const hasPerm = await this.hasPermission();
    console.log('✅ Permiso verificado en showNotification:', hasPerm);
    
    if (!hasPerm) {
      throw new Error('No hay permiso para notificaciones');
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    };

    const mergedOptions = { ...defaultOptions, ...options };
    console.log('⚙️ Opciones combinadas:', mergedOptions);

    // ESTRATEGIA DIFERENCIADA POR DISPOSITIVO
    if (this.isMobile) {
      console.log('📱 Dispositivo móvil detectado');
      console.log('🔄 Usando showNotificationViaServiceWorker()');
      const result = await this.showNotificationViaServiceWorker(title, mergedOptions);
      console.log('✅ showNotificationViaServiceWorker retornó:', result);
      return result;
    } else {
      console.log('💻 Dispositivo escritorio detectado');
      console.log('🔄 Usando showNotificationDesktop()');
      const result = await this.showNotificationDesktop(title, mergedOptions);
      console.log('✅ showNotificationDesktop retornó:', result);
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error en showNotification():', error);
    console.error('Stack:', error.stack);
    throw error;
  }
}

  async showNotificationViaServiceWorker(title, options) {
    console.log('🔄 Mostrando notificación vía Service Worker...');
    
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker no soportado en este navegador móvil');
    }

    try {
      // Obtener o registrar Service Worker
      let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      
      if (!registration) {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service Worker registrado para notificación');
        
        // Esperar activación
        if (registration.installing) {
          await new Promise((resolve) => {
            registration.installing.addEventListener('statechange', (e) => {
              if (e.target.state === 'activated') {
                console.log('✅ Service Worker activado');
                resolve();
              }
            });
          });
        }
      }

      // Usar showNotification del Service Worker
      await registration.showNotification(title, options);
      console.log('✅ Notificación mostrada vía Service Worker');
      return true;
    } catch (error) {
      console.error('❌ Error mostrando notificación vía Service Worker:', error);
      
      // Fallback para móviles muy restrictivos
      if (this.isMobile) {
        console.log('⚠️ Intentando fallback para móvil...');
        return this.showMobileFallback(title, options.body);
      }
      
      throw error;
    }
  }

async showNotificationDesktop(title, options) {
  console.log('💻 Usando notificación para escritorio...');
  
  if (typeof Notification === 'undefined') {
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

showMobileFallback(title, body) {
  console.log('📱 Usando fallback móvil (alert/UI)');
  
  // Opción 1: Alert nativo (funciona en todos los móviles)
  if (typeof alert !== 'undefined') {
    alert(`${title}\n\n${body}`);
    return true;
  }
  
  // Opción 2: Toast/Modal en la página
  this.showToastInPage(title, body);
  return true;
}

showToastInPage(title, body) {
  const toast = document.createElement('div');
  toast.className = 'mobile-notification-fallback';
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 99999;
      max-width: 90%;
      width: 350px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: slideDown 0.3s ease;
    ">
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.9;">${body}</div>
      <button style="
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      " onclick="this.parentElement.remove()">×</button>
    </div>
  `;
  
  // Agregar animación CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 5000);
  
  return true;
}

  async testNotification() {
  console.log('🧪 Iniciando prueba completa de notificaciones...');
  console.log('📱 Es móvil:', this.isMobile);
  console.log('🌐 Protocolo:', window.location.protocol);

  if (!('Notification' in window)) {
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

  // Verificar/obtener permisos
  if (Notification.permission === 'default') {
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
  } else if (Notification.permission !== 'granted') {
    throw new Error('Permiso denegado previamente. Revise configuración del navegador.');
  }

  if (Notification.permission === 'granted' && this.isFirebaseInitialized) {
    console.log('🔄 Verificando token FCM...');
    
    if (!this.token) {
      console.log('🔄 No hay token, obteniendo uno...');
      await this.getFCMToken();
    } else {
      console.log('✅ Token ya disponible');
      console.log('Token:', this.token.substring(0, 30) + '...');
    }
  }

  // Si ya teníamos permiso, obtener token ahora
  if (Notification.permission === 'granted' && this.isFirebaseInitialized && !this.token) {
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
  
  // Mostrar notificación de prueba
  console.log('🔄 Mostrando notificación de prueba...');
  
  await this.showNotification(
    `🧪 Prueba ${this.isMobile ? 'Móvil' : 'PC'}`,
    {
      body: `✅ Sistema ${this.isFirebaseInitialized ? 'FCM' : 'Nativo'} activo\n` +
            `Puntos: ${data.displayPoints}\n` +
            `Método: ${this.isMobile ? 'Service Worker' : 'API nativa'}\n` +
            `Background: ${this.isFirebaseInitialized && this.token ? '✅ Sí' : '❌ Solo foreground'}`,
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
    platform: this.isMobile ? 'mobile' : 'desktop'
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
  console.log('🔔 EJECUTANDO showDailyNotification() - INICIO');
  
  try {
    // 1. Verificar permisos
    const hasPerm = await this.hasPermission();
    console.log('✅ Permiso verificado:', hasPerm);
    
    if (!hasPerm) {
      console.log('❌ No tiene permisos para notificaciones');
      return;
    }
    
    // 2. Verificar datos de usuario
    console.log('📋 Datos de usuario:', this.userData);
    
    if (!this.userData) {
      console.log('❌ No hay datos de usuario');
      return;
    }
    
    const { userName, points, businessName } = this.userData;
    const today = new Date().toDateString();
    const lastNotification = localStorage.getItem('lastDailyNotification');
    
    console.log('📊 Información detallada:');
    console.log('- Usuario:', userName);
    console.log('- Puntos:', points);
    console.log('- Negocio:', businessName);
    console.log('- Hoy:', today);
    console.log('- Última notificación en localStorage:', lastNotification || 'Nunca');
    
    // IMPORTANTE: Solo verificar si es EXACTAMENTE igual
    if (lastNotification === today) {
      console.log('⏭️ Ya se mostró notificación hoy según localStorage');
      console.log('💡 Para forzar prueba, ejecuta: localStorage.removeItem("lastDailyNotification")');
      return;
    }
    
    // Verificar si hay puntos
    if (points <= 0) {
      console.log('⏭️ Usuario no tiene puntos, omitiendo');
      return;
    }
    
    console.log('✅✅✅ TODAS LAS CONDICIONES PASARON!');
    console.log('🎯 Preparando notificación...');
    
    // Crear opciones de notificación
    const notificationOptions = {
      body: `¡Hola ${userName}! Recuerda que tienes ${points} puntos disponibles en ${businessName}`,
      tag: 'daily-reminder-' + Date.now(),
      icon: this.userData?.businessLogo || '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: {
        type: 'daily-reminder',
        date: today,
        points: points,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('📨 Opciones de notificación:', notificationOptions);
    
    // MOSTRAR NOTIFICACIÓN PRIMERO, LUEGO GUARDAR
    console.log('🚀 Llamando a showNotification()...');
    const result = await this.showNotification(`📅 Recordatorio Diario`, notificationOptions);
    console.log('✅ showNotification() retornó:', result);
    
    if (result) {
      // SOLO guardar si la notificación se mostró exitosamente
      localStorage.setItem('lastDailyNotification', today);
      console.log('✅✅✅ Notificación diaria enviada exitosamente y fecha guardada:', today);
    } else {
      console.log('⚠️ showNotification() retornó falso, no guardando fecha');
    }
    
  } catch (error) {
    console.error('❌❌❌ ERROR CRÍTICO en showDailyNotification():', error);
    console.error('Stack:', error.stack);
    console.error('Error completo:', error);
  }
}

  calculateTimeUntilNextNotification() {
  const now = new Date();
  const target = new Date();
  
  console.log('🔧 CALCULANDO HORA OBJETIVO:');
  console.log('Configuración - hour:', this.hour, 'minute:', this.minute);
  
  // OPCIÓN 1: Usar hora local (normal)
  target.setHours(this.hour, this.minute, 0, 0, 0);
  
  // OPCIÓN 2: Usar hora UTC (si hay problemas de zona)
  // target.setUTCHours(this.hour, this.minute, 0, 0, 0);
  
  console.log('📅 Fecha actual:', now.toLocaleString());
  console.log('🎯 Fecha objetivo:', target.toLocaleString());
  console.log('🕐 Hora actual (local):', now.getHours() + ':' + now.getMinutes());
  console.log('🎯 Hora objetivo (local):', target.getHours() + ':' + target.getMinutes());
  
  // Calcular si ya pasó hoy
  if (now > target) {
    console.log('⏭️ La hora objetivo YA PASÓ hoy, programando para mañana');
    target.setDate(target.getDate() + 1);
    console.log('📅 Nueva fecha objetivo:', target.toLocaleString());
  } else {
    console.log('✅ Programando para hoy mismo');
  }
  
  const timeUntil = target.getTime() - now.getTime();
  const minutes = Math.round(timeUntil / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  console.log(`⏰ Próxima notificación en: ${hours}h ${remainingMinutes}m`);
  console.log(`⏰ Eso sería a las: ${target.toLocaleTimeString()}`);
  
  return timeUntil;
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
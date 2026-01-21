import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmOg_UCihT0ps7c6h6xT23Vfuaa99Hbq0",
  authDomain: "arcane-fire-423218-f5.firebaseapp.com",
  projectId: "arcane-fire-423218-f5",
  storageBucket: "arcane-fire-423218-f5.firebasestorage.app",
  messagingSenderId: "936752702411",
  appId: "1:936752702411:web:b3001d1d86f5d4229dcc4e",
  measurementId: "G-Z6E9G2DFZC"
};

// Inicializar Firebase App
let app;
let analytics = null;
let messaging = null;

try {
  app = initializeApp(firebaseConfig);
  
  if (typeof window !== 'undefined') {
    // Inicializar Analytics solo en cliente
    analytics = getAnalytics(app);
    
    // Verificar y obtener Messaging
    isSupported().then(supported => {
      if (supported) {
        messaging = getMessaging(app);
        console.log('✅ Firebase Messaging inicializado correctamente');
        
        // Configurar manejo automático de mensajes
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            console.log('✅ Service Worker listo para Firebase');
          });
        }
      } else {
        console.log('⚠️ Firebase Messaging no compatible en este navegador');
      }
    }).catch(error => {
      console.error('❌ Error verificando soporte de Firebase:', error);
    });
  }
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
}

export { app, analytics, messaging, firebaseConfig };

// Función para verificar compatibilidad
export const checkFirebaseSupport = async () => {
  return await isSupported();
};
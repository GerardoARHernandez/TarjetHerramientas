// src/hooks/useWebNotifications.jsx
import { useState, useEffect, useCallback } from 'react';

export const useWebNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  // Verificar si el navegador soporta notificaciones
  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Solicitar permiso para notificaciones
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones web');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error al solicitar permiso:', error);
      return false;
    }
  }, []);

  // Enviar notificación
  const sendNotification = useCallback((title, options) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, options);
    
    // Manejar clic en la notificación
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }, []);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification
  };
};
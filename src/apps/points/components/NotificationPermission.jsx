// src/apps/points/components/NotificationPermission.jsx
import { Bell, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useWebNotifications } from '../../../hooks/useWebNotifications';

const NotificationPermission = ({ onPermissionChange }) => {
  const { isSupported, permission, requestPermission } = useWebNotifications();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const granted = await requestPermission();
    setIsRequesting(false);
    
    if (onPermissionChange) {
      onPermissionChange(granted);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Tu navegador no soporta notificaciones web
        </p>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
        <Check className="w-5 h-5 text-green-600" />
        <span className="text-green-800 text-sm font-medium">
          Notificaciones activadas ✓
        </span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
        <X className="w-5 h-5 text-red-600" />
        <span className="text-red-800 text-sm">
          Notificaciones bloqueadas. Permite en configuración del navegador.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-blue-800 font-medium mb-1">
            ¿Quieres recibir recordatorios de tus puntos?
          </p>
          <p className="text-blue-700 text-sm mb-3">
            Te notificaremos sobre tus puntos y promociones disponibles.
          </p>
          <button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isRequesting ? 'Solicitando...' : 'Activar notificaciones'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;
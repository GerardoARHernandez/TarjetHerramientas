//src/apps/points/components/Points/NotificationTestButton.jsx
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UniversalNotificationScheduler } from '../../../../utils/notificationScheduler';

const NotificationTestButton = () => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState({
        isTesting: false,
        permission: 'default',
        lastTestResult: null
    });

    const [notificationScheduler] = useState(() => new UniversalNotificationScheduler(17, 0));

    useEffect(() => {
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobileDevice(mobileCheck);
    }, []);

    const testNotification = async () => {
        console.log('🔔 Iniciando prueba en:', isMobileDevice ? 'Móvil' : 'Escritorio');
        
        if (!('Notification' in window)) {
            alert('❌ Tu navegador no soporta notificaciones');
            return;
        }

        if (isMobileDevice) {
            const shouldContinue = window.confirm(
                '📱 Modo móvil detectado\n\n' +
                'Para notificaciones en Android/iPhone:\n' +
                '1. Acepta el permiso cuando aparezca\n' +
                '2. Si falla, prueba en "modo escritorio"\n' +
                '3. O instala la app como PWA\n\n' +
                '¿Continuar con la prueba?'
            );
            
            if (!shouldContinue) return;
        }

        setNotificationStatus(prev => ({ ...prev, isTesting: true }));

        try {
            await notificationScheduler.testNotification();
            
            setNotificationStatus(prev => ({ 
                ...prev, 
                isTesting: false,
                lastTestResult: 'success'
            }));
            
            if (isMobileDevice) {
                setTimeout(() => {
                    alert('✅ Prueba completada\n\n' +
                          'Si no viste la notificación:\n' +
                          '• Verifica la bandeja de notificaciones\n' +
                          '• Prueba en "modo escritorio"\n' +
                          '• O revisa permisos del navegador');
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error en prueba:', error);
            
            let errorMessage = 'Error: ';
            
            if (error.message.includes('Service Worker')) {
                errorMessage = 'Error técnico en móvil\n\n' +
                              'Soluciones:\n' +
                              '1. Recarga la página\n' +
                              '2. Activa "modo escritorio"\n' +
                              '3. Usa Chrome > Configuración > Notificaciones';
            } else if (error.message.includes('Illegal constructor')) {
                errorMessage = '⚡ Restricción de Android Chrome\n\n' +
                              'En móvil necesitas:\n' +
                              '• HTTPS (no HTTP)\n' +
                              '• O usar "modo escritorio"\n' +
                              '• O instalar como PWA';
            } else {
                errorMessage += error.message;
            }
            
            alert(errorMessage);
            
            setNotificationStatus(prev => ({ 
                ...prev, 
                isTesting: false,
                lastTestResult: 'error'
            }));
        }
    };

    return (
        <button
            onClick={testNotification}
            disabled={notificationStatus.isTesting || notificationStatus.permission === 'denied'}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                notificationStatus.permission === 'denied'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : notificationStatus.isTesting
                        ? 'bg-blue-400 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
            } ${isMobileDevice ? 'border-2 border-yellow-300' : ''}`}
        >
            {notificationStatus.isTesting ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Probando...
                </>
            ) : (
                <>
                    <Bell className="w-5 h-5" />
                    {isMobileDevice ? 'Probar (modo móvil)' : 'Probar notificación'}
                    {isMobileDevice && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📱</span>}
                </>
            )}
        </button>
    );
};

export default NotificationTestButton;
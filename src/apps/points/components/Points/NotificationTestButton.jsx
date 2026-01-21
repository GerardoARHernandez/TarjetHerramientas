// src/apps/points/components/Points/NotificationTestButton.jsx
import { Bell, Cloud, Smartphone, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FirebaseNotificationScheduler } from '../../../../utils/firebaseNotificationScheduler';

const NotificationTestButton = () => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState({
        isTesting: false,
        permission: Notification.permission,
        lastTestResult: null,
        capabilities: null
    });

    const [notificationScheduler, setNotificationScheduler] = useState(null);

    useEffect(() => {
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobileDevice(mobileCheck);

        const scheduler = new FirebaseNotificationScheduler();
        setNotificationScheduler(scheduler);

        return () => {
            if (scheduler) {
                scheduler.destroy();
            }
        };
    }, []);

    const testNotification = async () => {
        console.log('🔔 Iniciando prueba completa...');
        
        if (!('Notification' in window)) {
            alert('❌ Tu navegador no soporta notificaciones');
            return;
        }

        setNotificationStatus(prev => ({ ...prev, isTesting: true }));

        try {
            if (!notificationScheduler) {
                throw new Error('Sistema de notificaciones no inicializado');
            }

            const result = await notificationScheduler.testNotification();
            
            setNotificationStatus(prev => ({ 
                ...prev, 
                isTesting: false,
                lastTestResult: 'success',
                capabilities: {
                    firebase: result.method === 'firebase',
                    background: result.canReceiveInBackground,
                    token: result.token
                }
            }));
            
        } catch (error) {
            console.error('Error en prueba:', error);
            
            let errorMessage = error.message;
            
            if (error.message.includes('VAPID')) {
                errorMessage = '🔥 Error de configuración Firebase\n\n' +
                              'Necesitas configurar la VAPID Key:\n' +
                              '1. Ve a Firebase Console\n' +
                              '2. Cloud Messaging > Configuración web\n' +
                              '3. Genera par de claves\n' +
                              '4. Copia la clave pública al código';
            } else if (error.message.includes('Service Worker')) {
                errorMessage = '🔧 Error técnico\n\n' +
                              'Solución:\n' +
                              '1. Usa HTTPS (no HTTP)\n' +
                              '2. Limpia caché del navegador\n' +
                              '3. Prueba en modo incógnito';
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
        <div className="space-y-4">
            <button
                onClick={testNotification}
                disabled={notificationStatus.isTesting || notificationStatus.permission === 'denied'}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                    notificationStatus.permission === 'denied'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : notificationStatus.isTesting
                            ? 'bg-blue-400 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                } ${isMobileDevice ? 'border-2 border-blue-400' : ''}`}
            >
                {notificationStatus.isTesting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Probando sistema...
                    </>
                ) : (
                    <>
                        {isMobileDevice ? <Smartphone className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
                        {isMobileDevice ? 'Probar en móvil' : 'Probar notificación'}
                        {isMobileDevice && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">📱</span>}
                    </>
                )}
            </button>
            
            {notificationStatus.capabilities && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Cloud className="w-4 h-4" />
                        Estado del sistema
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Plataforma:</span>
                            <span className="font-medium">
                                {isMobileDevice ? 'Móvil' : 'Escritorio'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Firebase FCM:</span>
                            <span className={`flex items-center gap-1 ${notificationStatus.capabilities.firebase ? 'text-green-600' : 'text-yellow-600'}`}>
                                {notificationStatus.capabilities.firebase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                {notificationStatus.capabilities.firebase ? 'Activado' : 'Desactivado'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Background:</span>
                            <span className={`flex items-center gap-1 ${notificationStatus.capabilities.background ? 'text-green-600' : 'text-yellow-600'}`}>
                                {notificationStatus.capabilities.background ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                {notificationStatus.capabilities.background ? 'Disponible' : 'Solo foreground'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            {isMobileDevice && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                📱 Notificaciones en móvil
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Para recibir notificaciones con la app cerrada, necesitas:
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>Configurar correctamente Firebase</li>
                                    <li>Usar HTTPS (no HTTP local)</li>
                                    <li>Aceptar permisos cuando se soliciten</li>
                                    <li>Instalar como PWA para mejor experiencia</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationTestButton;
//src/apps/points/components/Points/PointsNotificationManager.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { UniversalNotificationScheduler } from '../../../../utils/notificationScheduler';

const PointsNotificationManager = ({ 
    isLoading, 
    userPoints, 
    userName, 
    business, 
    onPermissionPrompt 
}) => {
    const notificationCheckRef = useRef(false);
    const [notificationScheduler] = useState(() => new UniversalNotificationScheduler(17, 0));

    const isNotificationSupported = () => {
        return 'Notification' in window;
    };

    const getNotificationPermission = () => {
        if (!isNotificationSupported()) return 'unsupported';
        return Notification.permission;
    };

    // Inicializar scheduler
    useEffect(() => {
        if (!isLoading && userPoints > 0) {
            notificationScheduler.init({
                userName,
                points: userPoints,
                businessName: business?.NegocioDesc,
                businessLogo: business?.NegocioImagenUrl
            });
        }
        
        return () => {
            notificationScheduler.destroy();
        };
    }, [isLoading, userName, userPoints, business]);

    // Mostrar prompt de notificaciones después de 5 segundos
    useEffect(() => {
        if (!isLoading && getNotificationPermission() === 'default' && !notificationCheckRef.current) {
            const timer = setTimeout(() => {
                onPermissionPrompt();
                notificationCheckRef.current = true;
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, onPermissionPrompt]);

    return null; // Este componente no renderiza nada visualmente
};

export default PointsNotificationManager;
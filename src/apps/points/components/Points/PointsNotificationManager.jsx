import { useState, useEffect, useRef } from 'react';
import { FirebaseNotificationScheduler } from '../../../../utils/firebaseNotificationScheduler';

const PointsNotificationManager = ({ 
    isLoading, 
    userPoints, 
    userName, 
    business, 
    onPermissionPrompt 
}) => {
    const notificationCheckRef = useRef(false);
    const [notificationScheduler, setNotificationScheduler] = useState(null);

    // Inicializar scheduler
    useEffect(() => {
        const scheduler = new FirebaseNotificationScheduler();
        setNotificationScheduler(scheduler);

        return () => {
            if (scheduler) {
                scheduler.destroy();
            }
        };
    }, []);

    // Inicializar con datos del usuario
    useEffect(() => {
        if (!isLoading && userPoints > 0 && notificationScheduler) {
            notificationScheduler.init({
                userName,
                points: userPoints,
                businessName: business?.NegocioDesc,
                businessLogo: business?.NegocioImagenUrl,
                userId: localStorage.getItem('userId') // Agrega si tienes userId
            });
        }
    }, [isLoading, userName, userPoints, business, notificationScheduler]);

    // Mostrar prompt después de 5 segundos
    useEffect(() => {
        if (!isLoading && Notification.permission === 'default' && !notificationCheckRef.current) {
            const timer = setTimeout(() => {
                onPermissionPrompt();
                notificationCheckRef.current = true;
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, onPermissionPrompt]);

    return null;
};

export default PointsNotificationManager;
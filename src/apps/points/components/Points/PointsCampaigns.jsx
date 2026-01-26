// src/apps/points/components/Points/PointsCampaigns.jsx 
import { Coins, Gift, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import PromoQRGenerator from '../PromoQRGenerator';

const PointsCampaigns = ({ campaigns, userPoints, business, color1, color2, detallesColor, accountData }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [showPromoQR, setShowPromoQR] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // FUNCIÓN PARA LANZAR CONFETI
    const launchConfetti = () => {
        confetti({
            particleCount: 950,
            spread: 95,
            origin: { y: 0.6 },
            colors: [color1, color2, detallesColor, '#ffffff'],
            shapes: ['circle', 'square'],
            gravity: 0.9,
            scalar: 1.2
        });
    };

    // Función para verificar si Notification está realmente disponible
    const isNotificationAvailable = () => {
        try {
            // Verificar si existe en window
            if (!('Notification' in window)) {
                return false;
            }
            
            // Verificar si el constructor está disponible
            if (typeof Notification === 'undefined') {
                return false;
            }
            
            // Verificar si es soportado por el navegador
            if (typeof Notification.requestPermission === 'undefined') {
                return false;
            }
            
            return true;
        } catch (error) {
            console.log('Notification no disponible:', error.message);
            return false;
        }
    };

    // Función para mostrar notificación con fallback
    const showNotification = (title, body, icon) => {
        try {
            // Verificar si está disponible
            if (!isNotificationAvailable()) {
                console.log('Notificaciones no disponibles en este dispositivo');
                return false;
            }

            // Verificar permisos
            if (Notification.permission !== 'granted') {
                console.log('Permiso para notificaciones no concedido');
                return false;
            }

            // Intentar crear notificación
            const notification = new Notification(title, {
                body: body,
                icon: icon || '/favicon.ico'
            });

            // Configurar evento onclick
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto-cerrar después de 4 segundos
            setTimeout(() => {
                try {
                    notification.close();
                } catch (e) {
                    // Ignorar errores al cerrar
                }
            }, 4000);

            console.log('Notificación mostrada exitosamente');
            return true;

        } catch (error) {
            console.error('Error al mostrar notificación:', error);
            
            // Fallback para iOS/Safari que no soporta Notification API
            if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                console.log('Usando fallback para iOS');
                showiOSFallback(title, body);
            }
            
            return false;
        }
    };

    // Fallback para iOS que no soporta Notification API
    const showiOSFallback = (title, body) => {
        // Crear un toast/alert en la página
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 99999;
            max-width: 90%;
            width: 350px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        toast.innerHTML = `
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
        `;
        
        // Agregar animación CSS
        if (!document.querySelector('#ios-toast-style')) {
            const style = document.createElement('style');
            style.id = 'ios-toast-style';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    };

    console.log('User Points:', campaigns);

    // FUNCIÓN PARA MANEJAR EL CLICK (animación + QR)
    const handleClick = (campaign) => {
        if (isAnimating) return;
        
        const isCanjeable = userPoints >= campaign.CampaCantPSCanje;
        
        if (isCanjeable) {
            setIsAnimating(true);
            
            // LANZAR CONFETI
            launchConfetti();
            
            // ENVIAR NOTIFICACIÓN CON VERIFICACIÓN ROBUSTA
            showNotification(
                '¡Puedes canjear!',
                `Tienes suficientes puntos para: ${campaign.CampaRecompensa}`,
                business?.NegocioImagenUrl || '/favicon.ico'
            );

            // Mostrar QR después de la animación
            setTimeout(() => {
                setIsAnimating(false);
                // Mostrar QR solo si hay teléfono disponible
                if (accountData?.Telefono) {
                    setSelectedCampaign(campaign);
                    setShowPromoQR(true);
                } else {
                    alert('No se pudo generar el QR. Falta información del teléfono.');
                }
            }, 1500);
        }
    };

    // Función para mostrar solo el QR (sin confetti)
    const handleShowQR = (campaign) => {
        if (accountData?.Telefono) {
            setSelectedCampaign(campaign);
            setShowPromoQR(true);
        } else {
            alert('No se pudo generar el QR. Falta información del teléfono.');
        }
    };

    if (campaigns.length === 0) return null;

    // URL de imagen para NegocioId == 3
    const defaultImageUrl = "https://i0.wp.com/pizza-christian.mexicowebs.com/wp-content/uploads/2023/12/Papas-Oduladas.jpg?fit=984%2C984&ssl=1";

    return (
        <>
            <div 
                className="rounded-3xl p-8 shadow-lg border"
                style={{
                    backgroundColor: 'white',
                    borderColor: `${detallesColor}30`
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Coins className="w-6 h-6" style={{ color: detallesColor }}/>
                        Promociones Activas
                    </h3>
                    <span className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{
                            backgroundColor: `${detallesColor}15`,
                            color: detallesColor
                        }}>
                        {campaigns.length} {campaigns.length === 1 ? 'promoción' : 'promociones'}
                    </span>
                </div>

                <div className="space-y-6">
                    {campaigns.map((campaign) => {
                        const isCanjeable = userPoints >= campaign.CampaCantPSCanje;
                        
                        return (
                            <div 
                                key={campaign.CampaId} 
                                className="rounded-2xl p-6 border-2 overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`,
                                    borderColor: `${detallesColor}30`
                                }}
                            >
                                {/* ... resto del código ... */}
                                
                                {/* Botón principal - Mantiene el texto original */}
                                <button
                                    onClick={() => handleClick(campaign)}
                                    disabled={!isCanjeable || isAnimating}
                                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 relative overflow-hidden
                                        ${isCanjeable && !isAnimating
                                            ? 'text-white shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                    style={isCanjeable && !isAnimating ? {
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                    } : {}}
                                >
                                    {isAnimating ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ¡Disponible para canjear!
                                        </div>
                                    ) : isCanjeable ? (
                                        `Disponible para canjear`
                                    ) : (
                                        `Necesitas ${campaign.CampaCantPSCanje - userPoints} puntos más`
                                    )}
                                </button>
                                
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal del QR de Promoción */}
            {showPromoQR && selectedCampaign && (
                <PromoQRGenerator
                    isOpen={showPromoQR}
                    onClose={() => setShowPromoQR(false)}
                    campaign={selectedCampaign}
                    phoneNumber={accountData?.Telefono}
                    clientName={`${accountData?.Nombre} ${accountData?.Apellido}`}
                    business={business}
                    color1={color1}
                    color2={color2}
                    detallesColor={detallesColor}
                />
            )}
        </>
    );
};

export default PointsCampaigns;
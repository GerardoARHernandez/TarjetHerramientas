//src/apps/points/components/Points/PointsCampaigns.jsx 
import { Coins, Gift } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';

const PointsCampaigns = ({ campaigns, userPoints, business, color1, color2, detallesColor, onRedeem }) => {
    const [isRedeeming, setIsRedeeming] = useState(false);

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

    const generateRedeemCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    const handleRedeem = async (campaign) => {
        if (isRedeeming) return;
        
        setIsRedeeming(true);
        
        // Lanzar confeti
        launchConfetti();
        
        // Enviar notificación de canje exitoso
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(
                    '¡Canje realizado!',
                    {
                        body: `Has canjeado ${campaign.CampaCantPSCanje} puntos por: ${campaign.CampaRecompensa}`,
                        icon: business?.NegocioImagenUrl || '/favicon.ico'
                    }
                );
            } catch (error) {
                console.error('Error al enviar notificación de canje:', error);
            }
        }

        // Simular procesamiento del canje
        setTimeout(() => {
            const newCode = generateRedeemCode();
            onRedeem(campaign, newCode);
            setIsRedeeming(false);
        }, 1500);
    };

    if (campaigns.length === 0) return null;

    return (
        <div 
            className="rounded-3xl p-8 shadow-lg border"
            style={{
                backgroundColor: 'white',
                borderColor: `${detallesColor}30`
            }}
        >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Coins className="w-6 h-6" style={{ color: detallesColor }}/>
                Promociones Activas
            </h3>

            <div className="space-y-6">
                {campaigns.map((campaign) => {
                    const isCanjeable = userPoints >= campaign.CampaCantPSCanje;
                    
                    return (
                        <div 
                            key={campaign.CampaId} 
                            className="rounded-2xl p-6 border-2"
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`,
                                borderColor: `${detallesColor}30`
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800">{campaign.CampaNombre}</h4>
                                    <p className="text-sm font-medium" style={{ color: detallesColor }}>
                                        Válida hasta: {new Date(campaign.CampaVigeFin).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="font-bold text-xl" style={{ color: color2 }}>
                                    {campaign.CampaCantPSCanje} pts
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                {campaign.CampaDesc}
                            </p>

                            <div 
                                className="rounded-xl p-4 mb-4"
                                style={{
                                    backgroundColor: `${detallesColor}08`
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Puntos necesarios:</span>
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-4 h-4" style={{ color: color1 }}/>
                                        <span className="font-bold" style={{ color: color2 }}>{campaign.CampaCantPSCanje}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min((userPoints / campaign.CampaCantPSCanje) * 100, 100)}%`,
                                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Progreso: {userPoints}/{campaign.CampaCantPSCanje} puntos
                                </p>
                            </div>

                            <div 
                                className="rounded-xl p-4 border mb-4"
                                style={{
                                    backgroundColor: `${detallesColor}08`,
                                    borderColor: `${detallesColor}30`
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Gift className="w-4 h-4" style={{ color: detallesColor }}/>
                                    <span className="text-sm font-medium" style={{ color: detallesColor }}>Tu recompensa:</span>
                                </div>
                                <p className="font-bold" style={{ color: detallesColor }}>{campaign.CampaRecompensa}</p>
                            </div>

                            <button
                                onClick={() => isCanjeable && handleRedeem(campaign)}
                                disabled={!isCanjeable || isRedeeming}
                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 relative overflow-hidden
                                    ${isCanjeable && !isRedeeming
                                        ? 'text-white shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                style={isCanjeable && !isRedeeming ? {
                                    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                } : {}}
                            >
                                {isRedeeming ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Procesando canje...
                                    </div>
                                ) : isCanjeable ? (
                                    `Canjeable por ${campaign.CampaCantPSCanje} Puntos`
                                ) : (
                                    `Necesitas ${campaign.CampaCantPSCanje - userPoints} puntos más`
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PointsCampaigns;
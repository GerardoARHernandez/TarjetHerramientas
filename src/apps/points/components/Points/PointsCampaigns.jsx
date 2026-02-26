// src/apps/points/components/Points/PointsCampaigns.jsx 
import { Coins, Gift, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import PromoQRGenerator from '../PromoQRGenerator';
import PRUEBACatalogo from './PRUEBACatalogo';

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

    console.log('User Points:', campaigns);

    // FUNCIÓN PARA MANEJAR EL CLICK (animación + QR) - SIN NOTIFICACIÓN
    const handleClick = (campaign) => {
        if (isAnimating) return;
        
        const isCanjeable = userPoints >= campaign.CampaCantPSCanje;
        
        if (isCanjeable) {
            setIsAnimating(true);
            
            // LANZAR CONFETI
            launchConfetti();

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

    // URL de imagen 

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
                        Promociones
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
                                className="rounded-2xl p-0.5 border-2 overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`,
                                    borderColor: `${detallesColor}30`
                                }}
                            >
                                {/* Sección de Imagen */}
                                {campaign.URLImagen !== "" && (
                                    <div className="mb-4">                                        
                                        <div className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: `${detallesColor}30` }}>
                                            <div className="relative h-48 md:h-56 lg:h-64 w-full">
                                                <img
                                                    src={campaign.URLImagen}
                                                    alt={`Imagen de promoción: ${campaign.CampaNombre}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `
                                                            <div class="w-full h-full flex flex-col items-center justify-center" style="background: linear-gradient(135deg, ${detallesColor}20, ${detallesColor}10)">
                                                                <ImageIcon class="w-12 h-12 mb-2" style="color: ${detallesColor}60" />
                                                                <p class="text-sm font-medium" style="color: ${detallesColor}80">Imagen de la promoción</p>
                                                                <p class="text-xs mt-1" style="color: ${detallesColor}60">${campaign.CampaNombre}</p>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                                {/* Overlay sutil */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{campaign.CampaNombre}</h4>
                                        <p className="text-sm font-medium" style={{ color: detallesColor }}>
                                            Válida hasta: {new Date(campaign.CampaVigeFin).toLocaleDateString()}
                                        </p>
                                    </div>
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

                {business.NegocioId == 3 && (
                    <div className='my-6 '>
                        <PRUEBACatalogo />
                    </div>
                )}
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
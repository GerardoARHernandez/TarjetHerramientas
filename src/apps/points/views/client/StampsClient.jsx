// src/apps/points-loyalty/views/client/Stamps.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Gift, Award, Coins, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import ClientFooter from '../../components/ClientFooter';

const Stamps = () => {
    const { user } = useAuth();
    const { business, activeCampaigns, isLoading: businessLoading } = useBusiness();
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();
    const [calculatedStamps, setCalculatedStamps] = useState(0);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [hasShownWelcomeConfetti, setHasShownWelcomeConfetti] = useState(false);
    const [stampIconError, setStampIconError] = useState(false);

    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 || '#ffb900';
    const color2 = business?.NegocioColor2 || '#f0b100';
    const detallesColor = business?.NegocioColor2 || '#FF9800';

    // Determinar el ícono de sellos a usar
    const stampIcon = business?.NegocioIconoSellosUrl 
        ? business.NegocioIconoSellosUrl 
        : null; // Si está vacío, usaremos el ícono por defecto (Star)

    // Mover la declaración de isLoading aquí, antes de los useEffects que lo usan
    const isLoading = businessLoading || accountLoading;

    // Calcular sellos basado en el historial para mayor precisión
    useEffect(() => {
        if (accountData?.Movimientos) {
            let totalStamps = 0;
            
            accountData.Movimientos.forEach(mov => {
                if (mov.TransaccionTipo === 'A') {
                    // Acumulación - sumar sellos
                    totalStamps += mov.TransaccionCant;
                } else if (mov.TransaccionTipo === 'C') {
                    // Canje - restar sellos
                    totalStamps -= mov.TransaccionCant;
                }
            });
            
            setCalculatedStamps(totalStamps);
        }
    }, [accountData]);

    // Usar tanto los puntosDisponibles como el cálculo para verificar
    const apiStamps = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    const userStamps = calculatedStamps > 0 ? calculatedStamps : apiStamps;

    // Transformar el historial para sellos
    const stampsHistory = accountData?.Movimientos ? accountData.Movimientos.map(mov => ({
        id: mov.TransaccionId,
        date: new Date(mov.TransaccionFecha).toLocaleDateString(),
        action: mov.TransaccionTipo === 'A' ? `+ ${mov.TransaccionCant} Sellos` : `- Canje (${mov.TransaccionCant} sellos)`,
        type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
        details: `Ref: ${mov.TransaccionNoReferen}`,
        cantidad: mov.TransaccionCant,
        importe: mov.TransaccionImporte
    })).reverse() : [];

    const stampsCampaigns = activeCampaigns.filter(campaign =>
        campaign.NegocioTipoPS === 'S'
    );

    // Obtener solo las primeras 2 campañas para mostrar
    const displayedCampaigns = stampsCampaigns.slice(0, 2);
    const hasMoreCampaigns = stampsCampaigns.length > 2;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Función para lanzar confeti
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

    // Función para manejar el canje con animación
    const handleRedeem = async (campaign) => {
        if (isRedeeming) return;
        
        setIsRedeeming(true);
        
        // Lanzar confeti
        launchConfetti();
        
        // Simular delay para evitar múltiples clicks
        setTimeout(() => {
            setIsRedeeming(false);
        }, 2000); // 2 segundos de bloqueo
    };

    // Función para navegar a todas las promociones
    const handleViewAllRewards = () => {
        navigate('/points-loyalty/promos');
    };

    // Verificar si el usuario tiene suficientes sellos para alguna campaña al cargar
    useEffect(() => {
        if (!isLoading && !hasShownWelcomeConfetti && stampsCampaigns.length > 0) {
            const hasEnoughStampsForAnyCampaign = stampsCampaigns.some(campaign => {
                const requiredStamps = parseInt(campaign.CampaCantPSCanje) || 10;
                return userStamps >= requiredStamps;
            });

            if (hasEnoughStampsForAnyCampaign) {
                // Pequeño delay para que la página termine de cargar
                const timer = setTimeout(() => {
                    launchConfetti();
                    setHasShownWelcomeConfetti(true);
                }, 1000);

                return () => clearTimeout(timer);
            }
        }
    }, [isLoading, hasShownWelcomeConfetti, stampsCampaigns, userStamps]);

    // Si el negocio no usa sellos, redirigir a puntos
    useEffect(() => {
        if (businessType === 'P') {
            navigate('/points-loyalty/points');
        }
    }, [businessType, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                        style={{ borderColor: color1 }}
                    ></div>
                    <p className="mt-4 text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    // Función para renderizar el ícono del sello
    const renderStampIcon = (size = 'w-13 h-13 sm:w-12 sm:h-12') => {
        // Si hay un ícono personalizado y no ha habido error, mostrarlo
        if (stampIcon && !stampIconError) {
            return (
                <img 
                    src={stampIcon} 
                    alt="Sello" 
                    className={`${size} object-contain`}
                    onError={() => {
                        console.log('Error cargando ícono personalizado, usando ícono por defecto');
                        setStampIconError(true);
                    }}
                />
            );
        }
        // Si no hay ícono personalizado o hubo error, usar el ícono por defecto
        return <Star className={`${size} fill-current`} />;
    };

    // Calcular el progreso basado en 10 círculos (siempre 10)
    const totalCircles = 10;
    const filledCircles = Math.min(userStamps, totalCircles);
    const progressPercentage = (filledCircles / totalCircles) * 100;

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <ClientHeader
                title="Sellos & Recompensas"
                userName={userName}
                businessName={business?.NegocioDesc}
                businessLogo={business?.NegocioImagenUrl}
                color1={color1}
                color2={color2}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation */}
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
                            <div className="flex space-x-2">
                                <button
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`,
                                    }}
                                    className="flex-1 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
                                >
                                    <Gift className="w-4 h-4" />
                                    Sellos
                                </button>
                            </div>
                        </div>

                        {/* ÚNICA SECCIÓN DE PROGRESO DE SELLOS - SIN MAPEO */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
                                    <Award 
                                    className="w-6 h-6" 
                                    style={{ color: detallesColor }}
                                    />
                                    Mi Progreso de Sellos
                                </h3>
                                <div className="bg-orange-100 rounded-2xl p-4 mb-4">
                                    <div className="text-4xl font-bold mb-2" style={{ color: detallesColor }}>
                                        {userStamps} Sellos
                                    </div>
                                    <div className="text-gray-600">Tus sellos acumulados</div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                                    <div
                                        className="h-3 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Stamps Grid - Siempre 10 círculos */}
                            <h4 className="text-lg font-semibold mb-4 text-gray-800 text-center">Mis Sellos</h4>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-6">
                                {Array.from({ length: totalCircles }, (_, index) => (
                                    <div
                                        key={index}
                                        className={`aspect-square rounded-full border-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105
                                            ${index < filledCircles
                                            ? 'border-transparent text-white shadow-lg'
                                            : 'hover:bg-opacity-20'
                                            }`}
                                        style={index < filledCircles ? {
                                            backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                                        } : {
                                            backgroundColor: `${detallesColor}15`,
                                            borderColor: `${detallesColor}30`,
                                            color: detallesColor
                                        }}
                                        >
                                        {index < filledCircles && renderStampIcon()}
                                    </div>
                                ))}
                            </div>

                            <div 
                                className="rounded-2xl p-4 text-sm border"
                                style={{ 
                                    backgroundColor: `${detallesColor}15`,
                                    color: detallesColor,
                                    borderColor: `${detallesColor}30`
                                }}
                                >
                                <p>✨ ¡Obtén más sellos comprando en {business?.NegocioDesc}!</p>
                            </div>
                        </div>

                        {/* Rewards Section - MUESTRA SOLO 2 CAMPAÑAS ACTIVAS */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Gift className="w-6 h-6" style={{ color: detallesColor }}/>
                                    Recompensas Disponibles
                                </h3>
                            </div>

                            {displayedCampaigns.length > 0 ? (
                                displayedCampaigns.map((campaign) => {
                                    const requiredStamps = parseInt(campaign.CampaCantPSCanje) || 10;
                                    const hasEnoughStamps = userStamps >= requiredStamps;

                                    return (
                                        <div 
                                            key={campaign.CampaId} 
                                            className="rounded-2xl p-6 border-2"
                                            style={{
                                                backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`,
                                                borderColor: `${detallesColor}30`
                                            }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-xl" style={{ backgroundColor: color1 }}>
                                                    <Gift className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-gray-800">{campaign.CampaNombre}</h4>
                                                    <p className="text-xs font-medium" style={{ color: detallesColor }}>
                                                        Válida hasta: {formatDate(campaign.CampaVigeFin)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {campaign.CampaDesc}
                                                </p>
                                            </div>

                                            <div className="bg-white/60 rounded-xl p-4 mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Sellos necesarios:</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStampIcon('w-4 h-4')}
                                                        <span className="font-bold" style={{ color: color2 }}>{requiredStamps}</span>
                                                    </div>
                                                </div>

                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.min((userStamps / requiredStamps) * 100, 100)}%`,
                                                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                                    Tu progreso: {userStamps}/{requiredStamps} sellos
                                                </p>
                                            </div>

                                            <div 
                                                className="rounded-xl p-4 border mb-4"
                                                style={{
                                                    backgroundColor: `${detallesColor}15`,
                                                    borderColor: `${detallesColor}30`
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Award className="w-4 h-4" style={{ color: detallesColor }} />
                                                    <span className="text-sm font-medium" style={{ color: detallesColor }}>Tu recompensa:</span>
                                                </div>
                                                <p className="font-bold" style={{ color: detallesColor }}>{campaign.CampaRecompensa}</p>
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => hasEnoughStamps && handleRedeem(campaign)}
                                                    disabled={!hasEnoughStamps || isRedeeming}
                                                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 relative overflow-hidden
                                                        ${hasEnoughStamps && !isRedeeming
                                                            ? 'text-white shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95'
                                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed font-medium'
                                                        }`}
                                                    style={hasEnoughStamps && !isRedeeming ? {
                                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                    } : {}}
                                                >
                                                    {isRedeeming ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Procesando...
                                                        </div>
                                                    ) : hasEnoughStamps ? (
                                                        'Canjear Ahora'
                                                    ) : (
                                                        `Necesitas ${requiredStamps - userStamps} sellos más`
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No hay promociones de sellos activas en este momento</p>
                                    <p className="text-sm text-gray-400 mt-2">Vuelve pronto para nuevas promociones</p>
                                </div>
                            )}

                            {/* Botón para ver todas las recompensas (si hay más de 2) */}
                            {hasMoreCampaigns && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={handleViewAllRewards}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
                                        style={{
                                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                            color: 'white'
                                        }}
                                    >
                                        <Gift className="w-4 h-4" />
                                        Ver todas las recompensas
                                        <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
                                            +{stampsCampaigns.length - 2} más
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Historial */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <Clock className="w-6 h-6" style={{ color: detallesColor }}/>
                                Actividad Reciente
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {stampsHistory.length > 0 ? (
                                    stampsHistory.slice(0, 5).map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex justify-between items-center py-3 px-4 rounded-xl border transition-colors duration-200
                                                ${item.type === 'gain'
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{item.date}</span>
                                                    <span className={`text-sm font-bold ${
                                                        item.type === 'gain' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {item.action}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{item.details}</p>
                                                <p className="text-xs text-gray-400">{item.cantidad} {item.type === 'gain' ? 'sellos' : 'unidades'}</p>
                                                {item.importe && (
                                                    <p className="text-xs text-gray-400">${item.importe}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No hay actividad registrada</p>
                                    </div>
                                )}
                            </div>

                            {stampsHistory.length > 0 && (
                                <button 
                                    onClick={() => navigate('/points-loyalty/full-history')}
                                    className="font-medium text-sm px-4 py-2 rounded-xl transition-colors duration-200 hover:bg-opacity-20"
                                    style={{
                                    color: detallesColor,
                                    backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = `${detallesColor}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    }}
                                    >
                                    Ver historial completo →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ClientFooter />
        </>
    );
};

export default Stamps;
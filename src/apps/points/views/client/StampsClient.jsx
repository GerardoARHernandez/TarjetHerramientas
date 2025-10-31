// src/apps/points-loyalty/views/client/Stamps.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Gift, Award, Coins } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect } from 'react';

const Stamps = () => {
    const { user } = useAuth();
    const { business, activeCampaigns, isLoading: businessLoading } = useBusiness();
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();

    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 || '#ffb900';
    const color2 = business?.NegocioColor2 || '#f0b100';

    // Usar datos reales de la API - para sellos, también usamos puntosDisponibles
    const userStamps = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    
    // Transformar el historial para sellos
    const stampsHistory = accountData?.Movimientos ? accountData.Movimientos.map(mov => ({
        id: mov.TransaccionId,
        date: new Date(mov.TransaccionFecha).toLocaleDateString(),
        action: mov.TransaccionTipo === 'A' ? '+ 1 Sello' : '- Recompensa',
        type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
        details: `Ref: ${mov.TransaccionNoReferen}`,
        cantidad: mov.TransaccionCant,
        importe: mov.TransaccionImporte
    })).reverse() : [];

    const stampsCampaigns = activeCampaigns.filter(campaign =>
        campaign.NegocioTipoPS === 'S'
    );

    // Si el negocio no usa sellos, redirigir a puntos
    useEffect(() => {
        if (businessType === 'P') {
            navigate('/points-loyalty/points');
        }
    }, [businessType, navigate]);

    const isLoading = businessLoading || accountLoading;

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <ClientHeader
                title="Sellos & Recompensas"
                userName={userName}
                businessName={business?.NegocioDesc}
                businessLogo={business?.NegocioImagenUrl}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Navigation */}
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate('/points-loyalty/points')}
                                    className="flex-1 text-gray-600 py-3 px-4 rounded-xl font-semibold bg-white hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Coins className="w-4 h-4" />
                                    Puntos
                                </button>
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

                        {/* Mostrar campañas activas de sellos */}
                        {stampsCampaigns.map((campaign) => {
                            const requiredStamps = parseInt(campaign.CampaCantPSCanje) || 10;
                            const progressPercentage = Math.min((userStamps / requiredStamps) * 100, 100);

                            return (
                                <div key={campaign.CampaId} className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                                    <div className="text-center mb-8">
                                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
                                            <Award className="w-6 h-6 text-orange-500" />
                                            Mi Progreso de Sellos
                                        </h3>
                                        <div className="bg-orange-100 rounded-2xl p-4 mb-4">
                                            <div className="text-4xl font-bold text-orange-600 mb-2">
                                                {userStamps}/{requiredStamps}
                                            </div>
                                            <div className="text-gray-600">Sellos completados</div>
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

                                    {/* Stamps Grid */}
                                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Mis Sellos</h4>
                                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-6">
                                        {Array.from({ length: requiredStamps }, (_, index) => (
                                            <div
                                                key={index}
                                                className={`aspect-square rounded-full border-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105
                                                    ${index < userStamps
                                                        ? 'border-transparent text-white shadow-lg'
                                                        : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                                                    }`}
                                                style={index < userStamps ? {
                                                    backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                                                } : {}}
                                            >
                                                {index < userStamps && <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 border border-amber-200">
                                        <p>✨ ¡Obtén más sellos comprando en {business?.NegocioDesc}!</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Rewards Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Gift className="w-6 h-6 text-orange-500" />
                                Recompensas Disponibles
                            </h3>

                            {stampsCampaigns.map((campaign) => {
                                const requiredStamps = parseInt(campaign.CampaCantPSCanje) || 10;
                                const hasEnoughStamps = userStamps >= requiredStamps;

                                return (
                                    <div key={campaign.CampaId} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-xl" style={{ backgroundColor: color1 }}>
                                                <Gift className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-gray-800">{campaign.CampaNombre}</h4>
                                                <p className="text-xs text-orange-600 font-medium">
                                                    Válida hasta: {new Date(campaign.CampaVigeFin).toLocaleDateString()}
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
                                                    <Star className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold text-amber-600">{requiredStamps}</span>
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
                                            <p className="text-xs text-gray-500 mt-1">
                                                Progreso actual: {userStamps}/{requiredStamps} sellos
                                            </p>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Award className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-700">Tu recompensa:</span>
                                            </div>
                                            <p className="font-bold text-green-800">{campaign.CampaRecompensa}</p>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <button
                                                disabled={!hasEnoughStamps}
                                                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200
                                                    ${hasEnoughStamps
                                                        ? 'text-white shadow-lg transform hover:-translate-y-0.5'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                style={hasEnoughStamps ? {
                                                    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                } : {}}
                                            >
                                                {hasEnoughStamps
                                                    ? 'Canjear Ahora'
                                                    : `Necesitas ${requiredStamps - userStamps} sellos más`
                                                }
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {stampsCampaigns.length === 0 && (
                                <div className="text-center py-12">
                                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No hay promociones de sellos activas en este momento</p>
                                    <p className="text-sm text-gray-400 mt-2">Vuelve pronto para nuevas promociones</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Historial */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-orange-500" />
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
                                <div className="mt-6 text-center">
                                    <button 
                                        onClick={() => navigate('/points-loyalty/full-history')}
                                        className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors duration-200"
                                    >
                                        Ver historial completo →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stamps;
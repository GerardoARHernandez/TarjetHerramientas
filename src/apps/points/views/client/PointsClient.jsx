// src/apps/points-loyalty/views/client/PointsClient.jsx
import { useNavigate } from 'react-router-dom';
import { Clock, Coins, TrendingUp, Gift } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect } from 'react';
import Footer from '../../components/Footer';

const PointsClient = () => {
    const { user } = useAuth();
    const { business, activeCampaigns, isLoading: businessLoading } = useBusiness();
    const { accountData, isLoading: accountLoading, error: accountError } = useClientAccount();
    const navigate = useNavigate();

    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 ? business.NegocioColor1 : '#ffb900';
    const color2 = business?.NegocioColor2 ? business.NegocioColor2 : '#fe9a00';

    // Usar datos reales de la API
    const userPoints = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    
    // Transformar el historial de movimientos
    const pointsHistory = accountData?.Movimientos ? accountData.Movimientos.map(mov => {
        const dateLocalString = `${mov.TransaccionFecha}T00:00:00`; 
    
        return {
            id: mov.TransaccionId,
            date: new Date(dateLocalString).toLocaleDateString(), 
            action: mov.TransaccionTipo === 'A' ? 'Acumulación de puntos' : 'Canje de puntos',
            points: mov.TransaccionTipo === 'A' ? `+${mov.TransaccionCant}` : `-${mov.TransaccionCant}`,
            type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
            details: `Referencia: ${mov.TransaccionNoReferen}`,
            importe: mov.TransaccionImporte
        };
    }).reverse() : [];

    const pointsCampaigns = activeCampaigns.filter(campaign =>
        campaign.NegocioTipoPS === 'P'
    );

    // Si el negocio no usa puntos, redirigir a sellos
    useEffect(() => {
        if (businessType === 'S') {
            navigate('/points-loyalty/stamps');
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
        <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <ClientHeader
                title="Puntos & Recompensas"
                userName={userName}
                businessName={business?.NegocioDesc}
                businessLogo={business?.NegocioImagenUrl}
                color1={color1}
                color2={color2}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Columna Principal - Puntos */}
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
                                    <Coins className="w-4 h-4" />
                                    Puntos
                                </button>
                            </div>
                        </div>

                        {/* Points Display */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-orange-400" />
                                    MIS PUNTOS OBTENIDOS
                                </h3>
                                <div
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`
                                    }}
                                    className="text-white rounded-3xl p-10 mb-6 shadow-xl"
                                >
                                    <div className="text-6xl font-bold mb-3">{userPoints}</div>
                                    <div className="text-xl opacity-90">Puntos disponibles</div>
                                </div>
                                {accountData && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-green-50 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600">{userPoints}</div>
                                            <div className="text-sm text-green-700">Puntos disponibles</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {accountData.puntosRedimidos || 0}
                                            </div>
                                            <div className="text-sm text-blue-700">Puntos redimidos</div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-orange-50 rounded-2xl p-4 inline-block mt-4">
                                    <p className="text-sm text-orange-600 font-medium">
                                        Sistema de puntos de {business?.NegocioDesc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Campañas Activas de Puntos */}
                        {pointsCampaigns.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                    <Coins className="w-6 h-6 text-orange-400" />
                                    Promociones Activas
                                </h3>

                                <div className="space-y-6">
                                    {pointsCampaigns.map((campaign) => (
                                        <div key={campaign.CampaId} className="border-2 border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-800">{campaign.CampaNombre}</h4>
                                                    <p className="text-sm text-orange-500 font-medium">
                                                        Válida hasta: {new Date(campaign.CampaVigeFin).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="text-orange-500 font-bold text-xl">
                                                    {campaign.CampaCantPSCanje} pts
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                {campaign.CampaDesc}
                                            </p>

                                            <div className="bg-white/60 rounded-xl p-4 mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Puntos necesarios:</span>
                                                    <div className="flex items-center gap-1">
                                                        <Coins className="w-4 h-4 text-amber-400" />
                                                        <span className="font-bold text-amber-500">{campaign.CampaCantPSCanje}</span>
                                                    </div>
                                                </div>

                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.min((userPoints / campaign.CampaCantPSCanje) * 100, 100)}%`,
                                                            backgroundColor: color1,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Progreso: {userPoints}/{campaign.CampaCantPSCanje} puntos
                                                </p>
                                            </div>

                                            <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Gift className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-700">Tu recompensa:</span>
                                                </div>
                                                <p className="font-bold text-green-800">{campaign.CampaRecompensa}</p>
                                            </div>

                                            <button
                                                disabled={userPoints < campaign.CampaCantPSCanje}
                                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200
                                                    ${userPoints >= campaign.CampaCantPSCanje
                                                        ? 'text-white shadow-lg transform hover:-translate-y-0.5'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                style={userPoints >= campaign.CampaCantPSCanje ? {
                                                    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                } : {}}
                                            >
                                                {userPoints >= campaign.CampaCantPSCanje
                                                    ? `Canjeable por ${campaign.CampaCantPSCanje} Puntos`
                                                    : `Necesitas ${campaign.CampaCantPSCanje - userPoints} puntos más`
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Exchange Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <Coins className="w-6 h-6 text-orange-400" />
                                Canjear mis Puntos
                            </h3>

                            <div className="space-y-6">
                                {pointsCampaigns.length === 0 && (
                                    <div className="text-center py-8">
                                        <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No hay promociones activas en este momento</p>
                                        <p className="text-sm text-gray-400 mt-2">Vuelve pronto para nuevas promociones</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 bg-amber-50 rounded-2xl p-4 text-sm text-amber-700 border border-amber-200">
                                <p className="mb-2">📋 <strong>Proceso de canje:</strong></p>
                                <p className="mb-2">• Se necesita ir al negocio para aprobación previa.</p>
                                <p>• Una vez ahí, serás atendido y validado que la promoción es valida.</p>
                                <p>• El cajero deberá darte la promoción en caso de ser canjeada.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Historial */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-orange-500" />
                                Historial de Puntos
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {pointsHistory.length > 0 ? (
                                    pointsHistory.slice(0, 4).map((item) => (
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
                                                        {item.points}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-1">{item.action}</p>
                                                <p className="text-xs text-gray-500">{item.details}</p>
                                                {item.importe && (
                                                    <p className="text-xs text-gray-400">${item.importe}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No hay movimientos registrados</p>
                                    </div>
                                )}
                            </div>

                            {pointsHistory.length > 0 && (
                                <div className="mt-6 text-center">
                                    <button 
                                        onClick={() => navigate('/points-loyalty/full-history')}
                                        className="text-orange-500 hover:text-orange-600 font-medium text-sm hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors duration-200"
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
        <Footer />
        </>
    );
};

export default PointsClient;
// src/apps/points-loyalty/views/client/PointsClient.jsx
import { useNavigate } from 'react-router-dom';
import { Clock, Coins, TrendingUp, Gift } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';

const PointsClient = () => {
    const { user } = useAuth();
    const { business, activeCampaigns, isLoading } = useBusiness();
    const navigate = useNavigate();

    const [userPoints, setUserPoints] = useState(0);
    const [pointsHistory, setPointsHistory] = useState([]);
    const [isClientDataLoading, setIsClientDataLoading] = useState(false);

    const userName = user?.name || 'Usuario';

    // Determinar si el negocio usa puntos o sellos
    const businessType = business?.NegocioTipoPS; // 'P' para puntos, 'S' para sellos

    // Colores para el fondo segun el negocio
    const color1 = business?.NegocioColor1 || '#ffb900'; // Naranja por defecto
    const color2 = business?.NegocioColor2 || '#fe9a00'; // Naranja oscuro por defecto

    // Filtrar campañas activas de puntos
    const pointsCampaigns = activeCampaigns.filter(campaign =>
        campaign.NegocioTipoPS === 'P'
    );

    // Cargar datos del cliente (puntos e historial)
    useEffect(() => {
        const loadClientData = async () => {
            if (!user) return;
            
            setIsClientDataLoading(true);
            
            const negocioId = user.rawData?.NegocioId;
            const userPhone = user.username;

            try {
                console.log('Buscando cliente en negocio:', negocioId, 'con teléfono:', userPhone);

                // Obtener clientes del negocio
                const clientesResponse = await fetch(`https://souvenir-site.com/WebPuntos/API1/GetClientesxNegocio?Negocioid=${negocioId}`);
                
                if (!clientesResponse.ok) {
                    throw new Error(`HTTP error! status: ${clientesResponse.status}`);
                }

                const clientes = await clientesResponse.json();
                
                // Buscar cliente por teléfono
                const clienteEncontrado = clientes.find(cliente => 
                    cliente.UsuarioTelefono === userPhone
                );

                if (clienteEncontrado) {
                    console.log('✅ Cliente identificado:', clienteEncontrado);
                    
                    // Aquí podrías hacer otra llamada a una API específica de puntos
                    // const puntosResponse = await fetch(`https://tu-api/puntos/${clienteEncontrado.UsuarioTelefono}`);
                    
                    // Por ahora usamos datos mock
                    await new Promise(resolve => setTimeout(resolve, 400));
                    
                    setUserPoints(calculateUserPoints(clienteEncontrado));
                    setPointsHistory(generateUserHistory(clienteEncontrado));
                    
                } else {
                    console.warn('Cliente no registrado en el sistema de puntos');
                    setUserPoints(0);
                    setPointsHistory([{
                        id: 1,
                        date: new Date().toLocaleDateString(),
                        action: 'Registro pendiente',
                        points: '+0',
                        type: 'gain',
                        details: 'Contacta al negocio para activar tu cuenta de puntos'
                    }]);
                }

            } catch (error) {
                console.error('Error cargando datos:', error);
                // Datos de respaldo
                setUserPoints(0);
                setPointsHistory([{
                    id: 1,
                    date: new Date().toLocaleDateString(),
                    action: 'Error de conexión',
                    points: '+0',
                    type: 'gain',
                    details: 'Intenta recargar la página'
                }]);
            } finally {
                setIsClientDataLoading(false);
            }
        };

        const calculateUserPoints = (cliente) => {
            // Lógica para calcular puntos (puedes adaptar según tu negocio)
            const phoneDigits = parseInt(cliente.UsuarioTelefono.slice(-4)) || 100;
            return (phoneDigits % 208) ; // 50-250 puntos
        };

        const generateUserHistory = (cliente) => {
            // Generar historial realistico basado en el cliente
            const nombre = `${cliente.UsuarioNombre} ${cliente.UsuarioApellido}`;
            const baseDate = new Date();
            
            return [
                {
                    id: 1,
                    date: new Date(baseDate - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    action: 'Compra registrada',
                    points: '+25',
                    type: 'gain',
                    details: `Compra en ${business?.NegocioDesc || 'tienda'}`,
                    cliente: nombre
                },
                {
                    id: 2,
                    date: new Date(baseDate - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    action: 'Acumulación puntos',
                    points: '+15',
                    type: 'gain',
                    details: 'Promoción especial',
                    cliente: nombre
                },
                {
                    id: 3,
                    date: new Date(baseDate - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    action: 'Visita al local',
                    points: '-10',
                    type: 'redeem',
                    details: 'Puntos por visita',
                    cliente: nombre
                }
            ];
        };

        loadClientData();
    }, [user, business?.NegocioDesc]);

    // Si el negocio no usa puntos, redirigir a sellos
    useEffect(() => {
        if (businessType === 'S') {
            navigate('/points-loyalty/stamps');
        }
    }, [businessType, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    {/* ESTILO DINÁMICO AJUSTADO: Loader */}
                    <div
                        className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto`}
                        style={{ borderColor: color1 }} // Usa el color 1 como borde dinámico
                    ></div>
                    <p className="mt-4 text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <ClientHeader
                title="Puntos & Recompensas"
                userName={userName}
                businessName={business?.NegocioDesc}
                businessLogo={business?.NegocioImagenUrl}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Columna Principal - Puntos */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Navigation */}
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
                            <div className="flex space-x-2">
                                {/* ESTILO DINÁMICO AJUSTADO: Botón de Puntos */}
                                <button
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`,
                                    }}
                                    className={`flex-1 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2`}
                                >
                                    <Coins className="w-4 h-4" />
                                    Puntos
                                </button>
                                {/* El botón de Sellos iría aquí si se implementara */}
                            </div>
                        </div>

                        {/* Points Display */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-orange-400" />
                                    MIS PUNTOS OBTENIDOS
                                </h3>
                                {/* ESTILO DINÁMICO AJUSTADO: Display de Puntos */}
                                <div
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`
                                    }}
                                    className="text-white rounded-3xl p-10 mb-6 shadow-xl"
                                >
                                    <div className="text-6xl font-bold mb-3">{userPoints}</div>
                                    <div className="text-xl opacity-90">Puntos disponibles</div>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-4 inline-block">
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
                                                    {/* ESTILO DINÁMICO AJUSTADO: Barra de Progreso */}
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.min((userPoints / campaign.CampaCantPSCanje) * 100, 100)}%`,
                                                            backgroundColor: color1, // Color sólido dinámico
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

                                            {/* ESTILO DINÁMICO AJUSTADO: Botón de Canje */}
                                            <button
                                                disabled={userPoints < campaign.CampaCantPSCanje}
                                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200
                                                    ${userPoints >= campaign.CampaCantPSCanje
                                                        ? 'text-white shadow-lg transform hover:-translate-y-0.5'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                style={userPoints >= campaign.CampaCantPSCanje ? {
                                                    // Degradado dinámico para el botón activo
                                                    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                } : {}}
                                            >
                                                {userPoints >= campaign.CampaCantPSCanje
                                                    ? `Canjear ${campaign.CampaCantPSCanje} Puntos`
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
                                <p className="mb-2">• Se envía el status de canje a la interfaz del negocio para aprobación</p>
                                <p>• Recibirás una notificación una vez confirmado el canje</p>
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
                            <div className="space-y-4">
                                {pointsHistory.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center py-3 px-4 rounded-xl border transition-colors duration-200
                                            ${item.type === 'gain'
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-red-50 border-red-200'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-sm text-gray-600">{item.date}</span>
                                            <p className="text-xs text-gray-500">{item.action}</p>
                                        </div>
                                        <span className={`text-sm font-bold ${
                                            item.type === 'gain' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {item.points}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 text-center">
                                <button className="text-orange-500 hover:text-orange-600 font-medium text-sm hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors duration-200">
                                    Ver historial completo →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointsClient;
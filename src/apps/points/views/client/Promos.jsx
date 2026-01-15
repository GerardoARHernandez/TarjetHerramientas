// src/apps/points-loyalty/views/client/Promos.jsx
import { useNavigate } from 'react-router-dom';
import { Gift, Award, Star, Coins, Calendar, Tag, ChevronLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';
import { useState } from 'react';

const Promos = () => {
    const { user } = useAuth();
    const { business, activeCampaigns } = useBusiness();
    const { accountData, isLoading } = useClientAccount();
    const navigate = useNavigate();
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS; // 'P' para puntos, 'S' para sellos
    const color1 = business?.NegocioColor1 || '#FF9800';
    const color2 = business?.NegocioColor2 || '#FFC107';
    const detallesColor = business?.NegocioColor2 || '#FFC107';

    // Determinar qué tipo de campañas mostrar basado en el tipo de negocio
    const filteredCampaigns = activeCampaigns.filter(campaign =>
        campaign.NegocioTipoPS === businessType
    );

    // Calcular puntos o sellos disponibles
    const calculateAvailable = () => {
        if (!accountData?.Movimientos) return 0;
        
        let total = 0;
        accountData.Movimientos.forEach(mov => {
            if (mov.TransaccionTipo === 'A') {
                total += mov.TransaccionCant;
            } else if (mov.TransaccionTipo === 'C') {
                total -= mov.TransaccionCant;
            }
        });
        
        return total;
    };

    const userAvailable = calculateAvailable();

    // Función para renderizar el ícono según el tipo
    const renderTypeIcon = (size = 'w-6 h-6') => {
        if (businessType === 'P') {
            return <Coins className={`${size} text-yellow-600`} />;
        } else {
            return <Star className={`${size} text-orange-500`} />;
        }
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Función para manejar el canje
    const handleRedeem = (campaign) => {
        // Aquí iría la lógica de canje
        alert(`Canjear ${campaign.CampaNombre}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                        style={{ borderColor: color1 }}
                    ></div>
                    <p className="mt-4 text-gray-600">Cargando promociones...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Fondo dinámico */}
            <div 
                className="min-h-screen"
                style={{ 
                    background: `linear-gradient(to bottom right, ${color1}15, ${color2}15)`,
                }}
            >
                <ClientHeader
                    title="Todas las Recompensas"
                    userName={userName}
                    businessName={business?.NegocioDesc}
                    showBackButton={true}
                    onBack={() => navigate(-1)}
                    color1={color1}
                    color2={color2}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header de Promociones */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div 
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: color1 }}
                                    >
                                        <Gift className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            Todas las Recompensas
                                        </h1>
                                        <p className="text-gray-600">
                                            Descubre todas las promociones disponibles
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contador de puntos/sellos */}
                            <div 
                                className="bg-gradient-to-r rounded-3xl px-7 py-2 text-white shadow-lg min-w-[180px]"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${color1}, ${color2})`
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm opacity-90">Tus {businessType === 'P' ? 'Puntos' : 'Sellos'}</div>
                                        <div className="text-2xl font-bold mt-1">{userAvailable}</div>
                                    </div>
                                    {renderTypeIcon('w-8 h-8')}
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-blue-600">
                                {business?.NegocioDesc}
                                </div>
                                <div className="text-sm text-blue-700">
                                    Tu negocio favorito
                                </div>
                            </div>
                        </div>

                        
                    </div>

                    {/* Grid de Promociones */}
                    {filteredCampaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCampaigns.map((campaign) => {
                                const required = parseInt(campaign.CampaCantPSCanje) || 10;
                                const hasEnough = userAvailable >= required;
                                const progress = Math.min((userAvailable / required) * 100, 100);
                                
                                return (
                                    <div 
                                        key={campaign.CampaId}
                                        className={`bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer
                                            ${hasEnough ? 'border-green-200' : 'border-gray-100'}
                                        `}
                                        onClick={() => setSelectedCampaign(campaign)}
                                    >
                                        {/* Cabecera de la promoción */}
                                        <div 
                                            className="h-2"
                                            style={{ 
                                                background: `linear-gradient(to right, ${color1}, ${color2})`
                                            }}
                                        ></div>

                                        <div className="p-6">
                                            {/* Título y fecha */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                                                        {campaign.CampaNombre}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            Hasta {formatDate(campaign.CampaVigeFin)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descripción */}
                                            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                                {campaign.CampaDesc}
                                            </p>

                                            {/* Requerimientos */}
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {renderTypeIcon('w-5 h-5')}
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {businessType === 'P' ? 'Puntos necesarios:' : 'Sellos necesarios:'}
                                                        </span>
                                                    </div>
                                                    <span 
                                                        className="font-bold"
                                                        style={{ color: color2 }}
                                                    >
                                                        {required}
                                                    </span>
                                                </div>

                                                {/* Barra de progreso */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${progress}%`,
                                                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 text-right">
                                                    {userAvailable}/{required} {businessType === 'P' ? 'puntos' : 'sellos'}
                                                </p>
                                            </div>

                                            {/* Recompensa */}
                                            <div 
                                                className="rounded-xl p-4 mb-6 border"
                                                style={{
                                                    backgroundColor: `${color1}10`,
                                                    borderColor: `${color1}20`
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award className="w-4 h-4" style={{ color: color1 }} />
                                                    <span className="text-sm font-medium" style={{ color: color1 }}>
                                                        Tu recompensa:
                                                    </span>
                                                </div>
                                                <p className="font-bold" style={{ color: color1 }}>
                                                    {campaign.CampaRecompensa}
                                                </p>
                                            </div>

                                            {/* Botón de canje */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRedeem(campaign);
                                                }}
                                                disabled={!hasEnough}
                                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 relative overflow-hidden
                                                    ${hasEnough
                                                        ? 'text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                style={hasEnough ? {
                                                    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                } : {}}
                                            >
                                                {hasEnough ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Gift className="w-4 h-4" />
                                                        Canjear Ahora
                                                    </div>
                                                ) : (
                                                    `Necesitas ${required - userAvailable} más`
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                                    style={{ backgroundColor: `${color1}20` }}
                                >
                                    <Gift className="w-10 h-10" style={{ color: color1 }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    No hay promociones activas
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {businessType === 'P' 
                                        ? 'Actualmente no hay promociones de puntos disponibles.'
                                        : 'Actualmente no hay promociones de sellos disponibles.'
                                    }
                                </p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                        color: 'white'
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Regresar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Modal de detalle de campaña */}
                    {selectedCampaign && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                {/* Cabecera modal */}
                                <div 
                                    className="p-4"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${color1}, ${color2})`
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white">
                                            {selectedCampaign.CampaNombre}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedCampaign(null)}
                                            className="text-white hover:bg-white/20 p-2 rounded-full"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Detalles */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
                                            <p className="text-gray-600">{selectedCampaign.CampaDesc}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Vigencia</h4>
                                            <p className="text-gray-600">
                                                Hasta {formatDate(selectedCampaign.CampaVigeFin)}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Recompensa</h4>
                                            <p 
                                                className="font-bold text-lg"
                                                style={{ color: color1 }}
                                            >
                                                {selectedCampaign.CampaRecompensa}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Requisitos</h4>
                                            <div className="flex items-center gap-2">
                                                {renderTypeIcon('w-5 h-5')}
                                                <span className="text-gray-600">
                                                    {businessType === 'P' ? 'Puntos requeridos:' : 'Sellos requeridos:'}
                                                    <span className="font-bold ml-2">
                                                        {parseInt(selectedCampaign.CampaCantPSCanje) || 10}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tu progreso */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Tu progreso</span>
                                                <span className="font-bold" style={{ color: color2 }}>
                                                    {userAvailable}/{parseInt(selectedCampaign.CampaCantPSCanje) || 10}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min((userAvailable / (parseInt(selectedCampaign.CampaCantPSCanje) || 10)) * 100, 100)}%`,
                                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => setSelectedCampaign(null)}
                                            className="flex-1 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleRedeem(selectedCampaign);
                                                setSelectedCampaign(null);
                                            }}
                                            disabled={userAvailable < (parseInt(selectedCampaign.CampaCantPSCanje) || 10)}
                                            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200
                                                ${userAvailable >= (parseInt(selectedCampaign.CampaCantPSCanje) || 10)
                                                    ? 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                    : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            style={userAvailable >= (parseInt(selectedCampaign.CampaCantPSCanje) || 10) ? {
                                                backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                            } : {}}
                                        >
                                            Canjear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botón flotante para regresar */}
                <div className="fixed bottom-6 left-6 z-40">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
                        style={{
                            backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                            color: 'white'
                        }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Regresar
                    </button>
                </div>
            </div>
            <ClientFooter />
        </>
    );
};

export default Promos;
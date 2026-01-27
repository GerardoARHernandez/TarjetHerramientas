import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useBusinessRules } from '../../../../hooks/useBusinessRules';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';
import ClientFooter from '../../components/ClientFooter';
import RedeemPurchaseModal from '../../components/RedeemPurchaseModal';

// Componentes de sellos
import StampsDisplay from '../../components/Stamps/StampsDisplay';
import StampsCampaigns from '../../components/Stamps/StampsCampaigns';
import StampsHistory from '../../components/Stamps/StampsHistory';
import RedeemSection from '../../components/Stamps/RedeemSection';
import { ArrowRight } from 'lucide-react';

const StampsClient = () => {
    const { user } = useAuth();
    const { business, campaigns, isLoading: businessLoading } = useBusiness();
    const { rules } = useBusinessRules(business?.NegocioId);
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();
    
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    // Eliminamos el estado del modal

    const isLoading = businessLoading || accountLoading;
    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 ? business.NegocioColor1 : '#ffb900';
    const color2 = business?.NegocioColor2 ? business.NegocioColor2 : '#f0b100';
    const detallesColor = business?.NegocioColor2 || '#FF9800';

    // Calcular sellos basado en el historial para mayor precisión
    const [calculatedStamps, setCalculatedStamps] = useState(0);
    const apiStamps = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    const userStamps = calculatedStamps > 0 ? calculatedStamps : apiStamps;

    // Filtrar campañas activas de sellos
    const activeCampaigns = campaigns?.filter(campaign => campaign.CampaActiva === 'S') || [];
    const stampsCampaigns = activeCampaigns.filter(campaign => campaign.NegocioTipoPS === 'S');

    // Calcular sellos desde el historial
    useEffect(() => {
        if (accountData?.Movimientos) {
            let totalStamps = 0;
            
            accountData.Movimientos.forEach(mov => {
                if (mov.TransaccionTipo === 'A') {
                    totalStamps += mov.TransaccionCant;
                } else if (mov.TransaccionTipo === 'C') {
                    totalStamps -= mov.TransaccionCant;
                }
            });
            
            setCalculatedStamps(totalStamps);
        }
    }, [accountData]);

    // Redirigir si el negocio no usa sellos
    useEffect(() => {
        if (businessType === 'P') {
            navigate('/points-loyalty/points');
        }
    }, [businessType, navigate]);

    // Eliminamos la función handleSuccessfulRedeem
    // Eliminamos handleCopyCode y closeRedeemModal

    if (isLoading || !accountData) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`
                }}
            >
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
            <div 
                className="min-h-screen"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, ${detallesColor}15, ${detallesColor}08)`
                }}
            >
                <ClientHeader
                    title="Sellos & Recompensas"
                    userName={userName}
                    businessName={business?.NegocioDesc}
                    businessLogo={business?.NegocioImagenUrl}
                    color1={color1}
                    color2={color2}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Prompt de notificaciones */}
                    {!isIOS && showNotificationPrompt && (
                        <div className="mb-6 animate-fade-in">
                            <div className="bg-white rounded-2xl p-6 border shadow-sm">
                                <h3 className="font-bold text-lg mb-2">¿Activar notificaciones?</h3>
                                <p className="text-gray-600 mb-4">Recibe alertas cuando obtengas sellos o puedas canjear recompensas</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNotificationPrompt(false)}
                                        className="px-4 py-2 rounded-lg font-medium text-white"
                                        style={{ backgroundColor: color1 }}
                                    >
                                        Activar
                                    </button>
                                    <button
                                        onClick={() => setShowNotificationPrompt(false)}
                                        className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700"
                                    >
                                        Ahora no
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de Registrar Ticket (solo para negocios PL) */}
                    {business?.NegocioModo == "PL" && (
                        <div className="mb-4">
                            <div className="rounded-2xl shadow-sm border w-fit"
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: `${detallesColor}30`
                                }}
                            >
                                <button
                                    onClick={() => setIsPurchaseModalOpen(true)}
                                    className="flex items-center gap-2 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-white/5 transition-all duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg flex-1 sm:flex-none justify-center cursor-pointer"                
                                    style={{
                                        borderColor: `${detallesColor}30`,
                                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                                    }}
                                >
                                    <span>Registrar Ticket</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Display de sellos */}
                            <StampsDisplay
                                userStamps={userStamps}
                                accountData={accountData}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                            />

                            {/* Campañas activas de sellos */}
                            <StampsCampaigns
                                campaigns={stampsCampaigns}
                                userStamps={userStamps}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                                accountData={accountData} 
                            />

                            {/* Sección de canje */}
                            <RedeemSection
                                campaigns={stampsCampaigns}
                                businessName={business?.NegocioDesc}
                                detallesColor={detallesColor}
                            />
                        </div>

                        {/* Sidebar - Historial */}
                        <div className="lg:col-span-1">
                            <StampsHistory
                                accountData={accountData}
                                detallesColor={detallesColor}
                                onViewFullHistory={() => navigate('/points-loyalty/full-history')}
                                rules={rules}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ClientFooter />

            {/* Modal de Registrar Ticket */}
            <RedeemPurchaseModal 
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                businessName={business?.NegocioDesc}
            />
        </>
    );
};

export default StampsClient;
//src/apps/points/views/client/PointsClient.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useBusinessRules } from '../../../../hooks/useBusinessRules';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';
import ClientFooter from '../../components/ClientFooter';
import RedeemPurchaseModal from '../../components/RedeemPurchaseModal';
import NotificationPermission from '../../components/NotificationPermission';

// Componentes de puntos
import PointsDisplay from '../../components/Points/PointsDisplay'; //Muestra los puntos del usuario
import PointsCampaigns from '../../components/Points/PointsCampaigns'; // Lista de campañas
import PointsHistory from '../../components/Points/PointsHistory'; // Historial de puntos
import RedeemSection from '../../components/Points/RedeemSection'; // Sección de canje
import MobileDeviceAlert from '../../components/Points/MobileDeviceAlert'; //Alerta para dispositivos móviles
import NotificationTestButton from '../../components/Points/NotificationTestButton'; //Botón de prueba de notificaciones
import PointsNotificationManager from '../../components/Points/PointsNotificationManager'; //Gestor de notificaciones
import RedeemCodeModal from '../../components/Points/RedeemCodeModal'; //Modal de código de canje
import { ArrowRight } from 'lucide-react';

const PointsClient = () => {
    const { user } = useAuth();
    const { business, campaigns, isLoading: businessLoading } = useBusiness();
    const { rules } = useBusinessRules(business?.NegocioId);
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();
    
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [redeemData, setRedeemData] = useState({
        code: '',
        campaign: null,
        copied: false
    });

    const isLoading = businessLoading || accountLoading;
    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 ? business.NegocioColor1 : '#ffb900';
    const color2 = business?.NegocioColor2 ? business.NegocioColor2 : '#fe9a00';
    const detallesColor = business?.NegocioColor2 || '#FF9800';

    const userPoints = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    const activeCampaigns = campaigns?.filter(campaign => campaign.CampaActiva === 'S') || [];
    const pointsCampaigns = activeCampaigns.filter(campaign => campaign.NegocioTipoPS === 'P');

    // Redirigir si el negocio no usa puntos
    useEffect(() => {
        if (businessType === 'S') {
            navigate('/points-loyalty/stamps');
        }
    }, [businessType, navigate]);

    // Manejo de canje exitoso
    const handleSuccessfulRedeem = (campaign, code) => {
        setRedeemData({
            code,
            campaign,
            copied: false
        });
        setShowRedeemModal(true);
    };

    // Manejar permiso de notificaciones
    const handlePermissionChange = (granted) => {
        setShowNotificationPrompt(false);
    };

    // Manejar copiar código
    const handleCopyCode = () => {
        navigator.clipboard.writeText(redeemData.code)
            .then(() => {
                setRedeemData(prev => ({ ...prev, copied: true }));
                setTimeout(() => {
                    setRedeemData(prev => ({ ...prev, copied: false }));
                }, 2000);
            });
    };

    // Cerrar modal de canje
    const closeRedeemModal = () => {
        setShowRedeemModal(false);
        setRedeemData({ code: '', campaign: null, copied: false });
    };

    if (isLoading) {
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
                    title="Puntos & Recompensas"
                    userName={userName}
                    businessName={business?.NegocioDesc}
                    businessLogo={business?.NegocioImagenUrl}
                    color1={color1}
                    color2={color2}
                />

                {/* Gestor de notificaciones */}
                <PointsNotificationManager
                    isLoading={isLoading}
                    userPoints={userPoints}
                    userName={userName}
                    business={business}
                    onPermissionPrompt={() => setShowNotificationPrompt(true)}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Alerta para móviles */}
                    <MobileDeviceAlert />

                    {/* Prompt de notificaciones */}
                    {showNotificationPrompt && (
                        <div className="mb-6 animate-fade-in">
                            <NotificationPermission 
                                onPermissionChange={handlePermissionChange}
                            />
                        </div>
                    )}

                    {/* Botón de prueba de notificaciones */}
                    {business?.NegocioId == 3 && (
                        <div className="mb-6">
                            <NotificationTestButton />
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
                            {/* Display de puntos */}
                            <PointsDisplay
                                userPoints={userPoints}
                                accountData={accountData}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                            />

                            {/* Campañas activas */}
                            <PointsCampaigns
                                campaigns={pointsCampaigns}
                                userPoints={userPoints}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                                onRedeem={handleSuccessfulRedeem}
                            />

                            {/* Sección de canje */}
                            <RedeemSection
                                campaigns={pointsCampaigns}
                                businessName={business?.NegocioDesc}
                                detallesColor={detallesColor}
                            />
                        </div>

                        {/* Sidebar - Historial */}
                        <div className="lg:col-span-1">
                            <PointsHistory
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

            {/* Modal de Código de Canje */}
            <RedeemCodeModal
                isOpen={showRedeemModal && business?.NegocioId == 3}
                onClose={closeRedeemModal}
                redeemData={redeemData}
                business={business}
                color1={color1}
                color2={color2}
                detallesColor={detallesColor}
                onCopyCode={handleCopyCode}
            />
        </>
    );
};

export default PointsClient;
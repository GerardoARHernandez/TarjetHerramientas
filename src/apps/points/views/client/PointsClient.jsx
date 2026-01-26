import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useBusinessRules } from '../../../../hooks/useBusinessRules';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';
import ClientFooter from '../../components/ClientFooter';
import RedeemPurchaseModal from '../../components/RedeemPurchaseModal';

// Componentes de puntos (siempre cargados)
import PointsDisplay from '../../components/Points/PointsDisplay';
import PointsCampaigns from '../../components/Points/PointsCampaigns';
import PointsHistory from '../../components/Points/PointsHistory';
import RedeemSection from '../../components/Points/RedeemSection';
import { ArrowRight } from 'lucide-react';

// Importar condicionalmente SOLO si no es iOS
let NotificationPermission, NotificationTestButton, PointsNotificationManager;

// Función para detectar iOS
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false; // Para SSR
  
  const userAgent = window.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS/.test(userAgent);
  
  return isIOS && isSafari; // Solo Safari iOS
};

const isIOS = isIOSDevice();

// Importar dinámicamente solo si no es iOS
if (!isIOS) {
  import('../../components/NotificationPermission').then(module => {
    NotificationPermission = module.default;
  }).catch(() => {
    console.log('NotificationPermission no disponible');
  });
  
  import('../../components/Points/NotificationTestButton').then(module => {
    NotificationTestButton = module.default;
  }).catch(() => {
    console.log('NotificationTestButton no disponible');
  });
  
  import('../../components/Points/PointsNotificationManager').then(module => {
    PointsNotificationManager = module.default;
  }).catch(() => {
    console.log('PointsNotificationManager no disponible');
  });
}

const PointsClient = () => {
    const { user } = useAuth();
    const { business, campaigns, isLoading: businessLoading } = useBusiness();
    const { rules } = useBusinessRules(business?.NegocioId);
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();
    
    // Solo crear estado para notificaciones si no es iOS
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(!isIOS ? false : undefined);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

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
        
        // Si es iOS, registrar en console para debug
        if (isIOS) {
          console.log('📱 iOS Safari detectado - Componentes de notificación deshabilitados');
        }
    }, [businessType, navigate]);

    // Manejar permiso de notificaciones solo si no es iOS
    const handlePermissionChange = (granted) => {
        if (!isIOS && setShowNotificationPrompt) {
            setShowNotificationPrompt(false);
        }
    };

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
                    title="Puntos & Recompensas"
                    userName={userName}
                    businessName={business?.NegocioDesc}
                    businessLogo={business?.NegocioImagenUrl}
                    color1={color1}
                    color2={color2}
                />

                {/* Gestor de notificaciones - SOLO si no es iOS y el componente está disponible */}
                {!isIOS && PointsNotificationManager && (
                  <PointsNotificationManager
                      isLoading={isLoading}
                      userPoints={userPoints}
                      userName={userName}
                      business={business}
                      onPermissionPrompt={() => !isIOS && setShowNotificationPrompt && setShowNotificationPrompt(true)}
                  />
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Prompt de notificaciones - SOLO si no es iOS */}
                    {!isIOS && showNotificationPrompt && NotificationPermission && (
                        <div className="mb-6 animate-fade-in">
                            <NotificationPermission 
                                onPermissionChange={handlePermissionChange}
                            />
                        </div>
                    )}

                    {/* Botón de prueba de notificaciones - SOLO si no es iOS */}
                    {!isIOS && business?.NegocioId == 3 && NotificationTestButton && (
                        <div className="mb-6">
                            <NotificationTestButton />
                        </div>
                    )}

                    {/* Información para usuarios iOS */}
                    {isIOS && (
                      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              📱 Modo iOS Safari
                            </p>
                            <p className="text-sm text-blue-600">
                              Las notificaciones están deshabilitadas en Safari para iOS. 
                              Para mejor experiencia, usa Chrome o instala la app como PWA.
                            </p>
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
                                accountData={accountData} 
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
        </>
    );
};

export default PointsClient;
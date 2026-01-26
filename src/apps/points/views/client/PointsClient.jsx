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

// Función para detectar iOS
const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent;
  return /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;
};

const PointsClient = () => {
    const { user } = useAuth();
    const { business, campaigns, isLoading: businessLoading } = useBusiness();
    const { rules } = useBusinessRules(business?.NegocioId);
    const { accountData, isLoading: accountLoading } = useClientAccount();
    const navigate = useNavigate();
    
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        setIsIOS(isIOSDevice());
        
        if (business?.NegocioTipoPS === 'S') {
            navigate('/points-loyalty/stamps');
        }
        
        // Si es iOS, mostrar mensaje en consola
        if (isIOSDevice()) {
            console.log('📱 iOS detectado - Notificaciones deshabilitadas');
        }
    }, [business?.NegocioTipoPS, navigate]);

    const isLoading = businessLoading || accountLoading;
    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 ? business.NegocioColor1 : '#ffb900';
    const color2 = business?.NegocioColor2 ? business.NegocioColor2 : '#fe9a00';
    const detallesColor = business?.NegocioColor2 || '#FF9800';

    const userPoints = accountData?.puntosDisponibles ? parseInt(accountData.puntosDisponibles) : 0;
    const activeCampaigns = campaigns?.filter(campaign => campaign.CampaActiva === 'S') || [];
    const pointsCampaigns = activeCampaigns.filter(campaign => campaign.NegocioTipoPS === 'P');

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

                {/* Mensaje informativo para iOS */}
                {isIOS && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 mx-4 sm:mx-8 lg:mx-12">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {/* <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Nota para usuarios iOS:</span> Las notificaciones push están deshabilitadas en Safari para iOS. Para mejor experiencia, usa Chrome en iOS.
                        </p>
                      </div> */}
                    </div>
                  </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
                            <PointsDisplay
                                userPoints={userPoints}
                                accountData={accountData}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                            />

                            <PointsCampaigns
                                campaigns={pointsCampaigns}
                                userPoints={userPoints}
                                business={business}
                                color1={color1}
                                color2={color2}
                                detallesColor={detallesColor}
                                accountData={accountData} 
                            />

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

            <RedeemPurchaseModal 
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                businessName={business?.NegocioDesc}
            />
        </>
    );
};

export default PointsClient;
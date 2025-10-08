// src/apps/points-loyalty/views/client/Stamps.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Gift, Coins, Award } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import ClientHeader from '../../components/ClientHeader';
import { useEffect, useState } from 'react';

const Stamps = () => {
  const { user } = useAuth();
  const { business, activeCampaigns, isLoading } = useBusiness();
  const navigate = useNavigate();
  
  const [userStamps, setUserStamps] = useState(0);
  const [stampsHistory, setStampsHistory] = useState([]);

  const userName = user?.name || 'Usuario';
  
  // Determinar si el negocio usa puntos o sellos
  const businessType = business?.NegocioTipoPS; // 'P' para puntos, 'S' para sellos
  
  // Filtrar campañas activas de sellos
  const stampsCampaigns = activeCampaigns.filter(campaign => 
    campaign.NegocioTipoPS === 'S'
  );

  // Cargar datos del cliente (sellos e historial)
  useEffect(() => {
    const loadClientData = async () => {
      if (user?.rawData?.ClienteId) {
        try {
          // Aquí deberías implementar la llamada a tu API para obtener
          // los sellos e historial del cliente específico
          // Por ahora usamos datos de ejemplo
          setUserStamps(6);
          setStampsHistory([
            { date: '14/02/2025', action: '+ 1 Sello', type: 'gain' },
            { date: '14/02/2025', action: '+ 1 Sello', type: 'gain' },
            { date: '14/03/2025', action: '+ 1 Sello', type: 'gain' },
            { date: '14/03/2025', action: '+ 1 Sello', type: 'gain' },
            { date: '14/03/2025', action: '- 1 Hamburguesa', type: 'redeem' }
          ]);
        } catch (error) {
          console.error('Error loading client data:', error);
        }
      }
    };

    loadClientData();
  }, [user]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Navigation */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Sellos
                </button>                
              </div>
            </div>

            {/* Mostrar campañas activas de sellos */}
            {stampsCampaigns.map((campaign, index) => {
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
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
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
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-500 text-white shadow-lg' 
                            : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                          }`}
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
                      <div className="bg-orange-500 p-2 rounded-xl">
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
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((userStamps / requiredStamps) * 100, 100)}%` }}
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
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
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
              <div className="space-y-4">
                {stampsHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center py-3 px-4 rounded-xl border transition-colors duration-200
                      ${item.type === 'gain' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                      }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-700">{item.date}</span>
                      <p className="text-xs text-gray-500">
                        {item.type === 'gain' ? 'Sello obtenido' : 'Recompensa'}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${
                      item.type === 'gain' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors duration-200">
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

export default Stamps;
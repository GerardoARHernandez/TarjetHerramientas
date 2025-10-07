// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/CampaignStats.jsx
import { Star, Eye, RefreshCw, Target } from 'lucide-react';

const CampaignStats = ({ campaigns, business }) => {
  // Función para determinar si una campaña está activa
  const isCampaignActive = (campaign) => {
    if (campaign.CampaActiva === 'N') return false;
    if (campaign.CampaActiva === 'S') return true;
    
    const today = new Date();
    const startDate = new Date(campaign.CampaVigeInico);
    const endDate = new Date(campaign.CampaVigeFin);
    return today >= startDate && today <= endDate;
  };

  const activeCampaigns = campaigns.filter(campaign => isCampaignActive(campaign));
  const inactiveCampaigns = campaigns.filter(campaign => !isCampaignActive(campaign));
  const manuallyActivated = campaigns.filter(campaign => campaign.CampaActiva === 'S').length;
  const manuallyDeactivated = campaigns.filter(campaign => campaign.CampaActiva === 'N').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de Campañas</p>
            <p className="text-2xl font-bold text-blue-600">{campaigns.length}</p>
          </div>
          <Target className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Campañas Activas</p>
            <p className="text-2xl font-bold text-green-600">{activeCampaigns.length}</p>
          </div>
          <Eye className="w-8 h-8 text-green-400" />
        </div>
      </div>
      

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tipo de Programa</p>
            <p className="text-lg font-bold text-orange-600">
              {business?.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
            </p>
          </div>
          <RefreshCw className="w-8 h-8 text-orange-400" />
        </div>
      </div>
    </div>
  );
};

export default CampaignStats;
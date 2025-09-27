// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/CampaignList.jsx
import { Gift, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        return new Date(dateString).toLocaleDateString('es-MX');
    };

const CampaignList = ({ campaigns, isLoading, error, business, onRefresh }) => {
  
  const isCampaignActive = (campaign) => {
    const today = new Date();
    const startDate = new Date(campaign.CampaVigeInico);
    const endDate = new Date(campaign.CampaVigeFin);
    return today >= startDate && today <= endDate;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
        <div className="flex justify-center py-8">
          <LoadingSpinner message="Cargando campañas..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Campañas Existentes</h2>
        <span className="text-sm text-gray-500">
          {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''}
        </span>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay campañas creadas</p>
          <p className="text-gray-400">Crea tu primera campaña usando el formulario superior</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <CampaignCard 
              key={index} 
              campaign={campaign} 
              business={business} 
              isActive={isCampaignActive(campaign)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CampaignCard = ({ campaign, business, isActive }) => (
  <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{campaign.CampaNombre || 'Sin nombre'}</h3>
        <p className="text-gray-600 mt-1">{campaign.CampaDesc || 'Sin descripción'}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Activa' : 'Inactiva'}
      </span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Recompensa</p>
        <p className="font-medium">{campaign.CampaRecompensa || 'No especificada'}</p>
      </div>
      <div>
        <p className="text-gray-500">{business?.NegocioTipoPS === 'P' ? 'Puntos requeridos' : 'Sellos requeridos'}</p>
        <p className="font-medium">{campaign.CampaCantPSCanje || '0'}</p>
      </div>
      <div>
        <p className="text-gray-500">Vigencia</p>
        <p className="font-medium">
          {formatDate(campaign.CampaVigeInico)} - {formatDate(campaign.CampaVigeFin)}
        </p>
      </div>
    </div>
    
    <div className="flex justify-end gap-2 mt-4">
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
        <Eye className="w-4 h-4" />
      </button>
      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
        <Edit className="w-4 h-4" />
      </button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default CampaignList;
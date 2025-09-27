// src/apps/points-loyalty/views/admin/RegisterPromotion/RegisterPromotion.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Gift } from 'lucide-react';
import CampaignStats from '../../components/admin/CampaignStats';
import CampaignList from '../../components/admin/CampaignList';
import CreateCampaignForm from '../../components/admin/CreateCampaignForm';
import BusinessInfoSidebar from '../../components/admin/BusinessInfoSidebar';

const RegisterPromotion = () => {
  const { business } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [campaignsError, setCampaignsError] = useState('');

  // Cargar campañas del negocio
  const fetchCampaigns = async () => {
    if (!business?.NegocioId) return;
    
    setIsLoadingCampaigns(true);
    setCampaignsError('');
    
    try {
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Campanias/negocio/${business.NegocioId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al cargar las campañas');
      }

      if (data.listNegocio && !data.error) {
        setCampaigns(Array.isArray(data.listNegocio) ? data.listNegocio : [data.listNegocio]);
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setCampaignsError(err.message || 'Error al cargar las campañas');
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // Cargar campañas al montar el componente
  useEffect(() => {
    fetchCampaigns();
  }, [business?.NegocioId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
              <p className="text-gray-600 mt-1">
                {business?.NegocioDesc ? `Negocio: ${business.NegocioDesc}` : 'Crea y gestiona campañas de recompensas'}
              </p>
            </div>
          </div>
          
          {/* Estadísticas */}
          <CampaignStats 
            campaigns={campaigns} 
            business={business} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna principal - Formulario y Lista */}
          <div className="lg:col-span-2">
            <CreateCampaignForm 
              business={business}
              onCampaignCreated={fetchCampaigns}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
            
            <CampaignList 
              campaigns={campaigns}
              isLoading={isLoadingCampaigns}
              error={campaignsError}
              business={business}
              onRefresh={fetchCampaigns}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BusinessInfoSidebar 
              business={business}
              showPreview={showPreview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPromotion;
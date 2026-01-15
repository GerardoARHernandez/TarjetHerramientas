import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BusinessContext = createContext();

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness debe ser usado dentro de un BusinessProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated, userType } = useAuth();

  // Obtener datos del negocio
  const fetchBusinessData = async (businessId) => {
    try {
      setIsLoading(true);
      setError('');
      
      const timestamp = new Date().getTime();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Negocio/${businessId}?t=${timestamp}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al obtener datos del negocio');
      }

      if (data.listNegocio && !data.error) {
        const businessData = data.listNegocio;
        setBusiness(businessData);
        localStorage.setItem('businessData', JSON.stringify(businessData));
        return businessData;
      } else {
        throw new Error(data.Mensaje || 'Error en los datos del negocio');
      }
    } catch (err) {
      console.error('Error fetching business data:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener campañas del negocio
  const fetchCampaigns = async (businessId) => {
    try {
      setIsLoading(true);
      setError('');
      
      const timestamp = new Date().getTime();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Campanias/negocioid/${businessId}?t=${timestamp}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al obtener campañas');
      }

      if (data.ListCampanias && !data.error) {
        // Filtrar solo campañas activas
        const activeCampaigns = data.ListCampanias.filter(campaign => 
          campaign.CampaActiva === 'S'
        );
        
        setCampaigns(data.ListCampanias);
        setActiveCampaigns(activeCampaigns);
        localStorage.setItem('campaignsData', JSON.stringify(data.ListCampanias));
        localStorage.setItem('activeCampaignsData', JSON.stringify(activeCampaigns));
        
        return {
          all: data.ListCampanias,
          active: activeCampaigns
        };
      } else {
        throw new Error(data.Mensaje || 'Error en los datos de campañas');
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos cuando el usuario se autentique
  useEffect(() => {
    const loadBusinessData = async () => {
      if (isAuthenticated) {
        let businessId = null;
        
        // OBTENER EL NEGOCIOID SEGÚN EL TIPO DE USUARIO
        if (userType === 'admin') {
          // Para admin: usar el NegocioId de rawData
          businessId = user?.rawData?.NegocioId;
        } else if (userType === 'client') {
          // Para cliente: usar el negocioId almacenado en el usuario
          businessId = user?.negocioId || user?.rawData?.NegocioId;
        }
        
        if (businessId) {
          const businessData = await fetchBusinessData(businessId);
          if (businessData) {
            await fetchCampaigns(businessId);
          }
        }
      }
    };

    // Si hay datos en localStorage, cargarlos primero
    const storedBusiness = localStorage.getItem('businessData');
    const storedCampaigns = localStorage.getItem('campaignsData');
    const storedActiveCampaigns = localStorage.getItem('activeCampaignsData');

    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
    }
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }
    if (storedActiveCampaigns) {
      setActiveCampaigns(JSON.parse(storedActiveCampaigns));
    }

    // Luego cargar datos frescos
    loadBusinessData();
  }, [isAuthenticated, user, userType]);

  const refreshData = async () => {
    if (user?.rawData?.NegocioId) {
      await fetchBusinessData(user.rawData.NegocioId);
      await fetchCampaigns(user.rawData.NegocioId);
    }
  };

  const value = {
    business,
    campaigns,
    activeCampaigns,
    isLoading,
    error,
    refreshData,
    clearError: () => setError('')
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
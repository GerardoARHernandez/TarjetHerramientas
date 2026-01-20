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
  const [campaigns, setCampaigns] = useState([]); // TODAS las campañas, sin filtrar
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Función simplificada para obtener businessId
  const getBusinessId = () => {
    if (!user) return null;
    return user?.rawData?.NegocioId || user?.negocioId;
  };

  // Obtener datos del negocio
  const fetchBusinessData = async (businessId) => {
    try {
      setIsLoading(true);
      setError('');
      
      const timestamp = Date.now();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Negocio/${businessId}?t=${timestamp}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al obtener datos del negocio');
      }

      if (data.listNegocio && !data.error) {
        const businessData = data.listNegocio;
        setBusiness(businessData);
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

  // Obtener TODAS las campañas del negocio (sin filtrar)
  const fetchCampaigns = async (businessId) => {
    try {
      setIsLoading(true);
      setError('');
      
      const timestamp = Date.now();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Campanias/negocioid/${businessId}?t=${timestamp}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al obtener campañas');
      }

      if (data.ListCampanias && !data.error) {
        // NO FILTRAR AQUÍ - devolver todas las campañas
        setCampaigns(data.ListCampanias);
        return data.ListCampanias;
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
    const loadData = async () => {
      if (isAuthenticated) {
        const businessId = getBusinessId();
        
        if (businessId) {
          await fetchBusinessData(businessId);
          await fetchCampaigns(businessId);
        }
      }
    };

    loadData();
  }, [isAuthenticated]); // Solo depende de isAuthenticated

  // Función para recargar datos manualmente
  const refreshData = async () => {
    const businessId = getBusinessId();
    if (businessId) {
      await fetchBusinessData(businessId);
      await fetchCampaigns(businessId);
    }
  };

  const value = {
    business,
    campaigns, // TODAS las campañas, sin filtrar
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
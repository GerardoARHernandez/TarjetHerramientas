// src/context/BusinessContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const BusinessContext = createContext();

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusiness = async (negocioId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/negocios/${negocioId}`);
      const data = await response.json();
      
      if (data.success) {
        setBusiness(data.data);
        // Guardar en localStorage para persistencia
        localStorage.setItem('business', JSON.stringify(data.data));
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching business:', err);
      setError('Error al cargar la información del negocio');
    } finally {
      setLoading(false);
    }
  };

  // Cargar negocio desde localStorage al iniciar
  useEffect(() => {
    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
      setLoading(false);
    }
  }, []);

  return (
    <BusinessContext.Provider value={{ business, loading, error, fetchBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};
// src/contexts/PointsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints debe ser usado dentro de un PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stampTransactions, setStampTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState('');
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [isLoadingClientDetails, setIsLoadingClientDetails] = useState(false);
  
  const [businessStats, setBusinessStats] = useState({
    totalClients: 0,
    totalTransactions: 0,
    totalStampTransactions: 0,
    businessName: '',
    businessStatus: '',
    businessType: ''
  });

  const { business, userType } = useAuth();

  // Función para obtener clientes
  const fetchClients = async () => {
    if (!business?.NegocioId) {
      console.warn('No hay NegocioId disponible');
      return;
    }
    
    setIsLoadingClients(true);
    setClientsError('');
    
    try {
      
      const response = await fetch(
        `https://souvenir-site.com/WebPuntos/API1/GetClientesxNegocio?Negocioid=${business.NegocioId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || `Error ${response.status}: ${response.statusText}`);
      }

      // Verificar la estructura de respuesta
      if (Array.isArray(data)) {
        // La API devuelve directamente un array
        setClients(data);
        setBusinessStats(prev => ({
          ...prev,
          totalClients: data.length || 0
        }));
      } else if (data.error === false && Array.isArray(data)) {
        // Caso: { error: false, ...array }
        setClients(data);
        setBusinessStats(prev => ({
          ...prev,
          totalClients: data.length || 0
        }));
      } else if (data.SDTCliente || data.listCliente) {
        // Caso: { SDTCliente: [...] } o { listCliente: [...] }
        const clientsList = data.SDTCliente || data.listCliente || [];
        setClients(clientsList);
        setBusinessStats(prev => ({
          ...prev,
          totalClients: clientsList.length || 0
        }));
      } else if (data.Mensaje) {
        // Hay un mensaje de error
        throw new Error(data.Mensaje);
      } else {
        // Estructura no reconocida
        console.warn('Estructura de respuesta no reconocida:', data);
        setClients([]);
      }
      
    } catch (err) {
      console.error('Error completo al obtener clientes:', err);
      setClientsError(err.message || 'Error desconocido al cargar clientes');
      setClients([]);
    } finally {
      setIsLoadingClients(false);
    }
  };

  // Función para obtener detalles del cliente
  const fetchClientDetails = async (clientId) => {
    setIsLoadingClientDetails(true);
    
    try {
      
      const response = await fetch(
        `https://souvenir-site.com/WebPuntos/API1/Cliente/EstadoCuenta/${clientId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.error === false && data.SDTEstadoCuenta) {
        setSelectedClientDetails(data.SDTEstadoCuenta || null);
        return data.SDTEstadoCuenta;
      } else if (data.SDTEstadoCuenta) {
        // Sin propiedad error
        setSelectedClientDetails(data.SDTEstadoCuenta || null);
        return data.SDTEstadoCuenta;
      } else if (data.Mensaje) {
        throw new Error(data.Mensaje);
      } else {
        throw new Error('Estructura de respuesta no reconocida');
      }
    } catch (err) {
      console.error('Error fetching client details:', err);
      setSelectedClientDetails(null);
      setClientsError(err.message || 'Error al obtener detalles del cliente');
      throw err;
    } finally {
      setIsLoadingClientDetails(false);
    }
  };

  // Cargar clientes cuando se monta el componente y hay un negocio
  useEffect(() => {
    if (business?.NegocioId && userType === 'admin') {
      fetchClients();
    } else {
      console.log('No se cargan clientes:', { 
        hasBusiness: !!business, 
        hasNegocioId: !!business?.NegocioId,
        userType 
      });
    }
  }, [business, userType]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setBusinessStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1
    }));
  };

  const addStamp = (stampTransaction) => {
    setStampTransactions(prev => [stampTransaction, ...prev]);
    setBusinessStats(prev => ({
      ...prev,
      totalStampTransactions: prev.totalStampTransactions + 1
    }));
  };

  const addClient = (client) => {
    setClients(prev => [client, ...prev]);
    setBusinessStats(prev => ({
      ...prev,
      totalClients: prev.totalClients + 1
    }));
  };

  const clearSelectedClient = () => {
    setSelectedClientDetails(null);
  };

  const value = {
    transactions,
    stampTransactions,
    clients,
    isLoadingClients,
    clientsError,
    selectedClientDetails,
    isLoadingClientDetails,
    businessStats,
    business,
    addTransaction,
    addStamp,
    addClient,
    fetchClients,
    fetchClientDetails,
    clearSelectedClient,
    updateBusinessStats: setBusinessStats
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
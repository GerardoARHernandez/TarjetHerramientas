// src/contexts/PointsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Asegúrate de importar useAuth

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
  const [clients, setClients] = useState([]);
  const [businessStats, setBusinessStats] = useState({
    totalClients: 0,
    totalTransactions: 0,
    businessName: '',
    businessStatus: ''
  });

  const { business, userType } = useAuth(); // Obtener business del AuthContext

  // Actualizar estadísticas cuando cambien los datos del negocio
  useEffect(() => {
    if (business && userType === 'admin') {
      setBusinessStats(prev => ({
        ...prev,
        businessName: business.NegocioDesc || business.NegocioNombre || 'Negocio',
        businessStatus: business.NegocioActivo === 1 ? 'Activo' : 'Inactivo'
      }));
    }
  }, [business, userType]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setBusinessStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1
    }));
  };

  const addClient = (client) => {
    setClients(prev => [client, ...prev]);
    setBusinessStats(prev => ({
      ...prev,
      totalClients: prev.totalClients + 1
    }));
  };

  const value = {
    transactions,
    clients,
    businessStats, // Añadir estadísticas del negocio
    business, // Pasar la información del negocio
    addTransaction,
    addClient,
    updateBusinessStats: setBusinessStats
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
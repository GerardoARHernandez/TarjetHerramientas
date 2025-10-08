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
  const [businessStats, setBusinessStats] = useState({
    totalClients: 0,
    totalTransactions: 0,
    totalStampTransactions: 0,
    businessName: '',
    businessStatus: '',
    businessType: ''
  });

  const { business, userType } = useAuth();

  // Actualizar estadísticas cuando cambien los datos del negocio
  useEffect(() => {
    if (business && userType === 'admin') {
      setBusinessStats(prev => ({
        ...prev,
        businessName: business.NegocioDesc || business.NegocioNombre || 'Negocio',
        businessStatus: business.NegocioActivo === 1 ? 'Activo' : 'Inactivo',
        businessType: business.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'
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

  const value = {
    transactions,
    stampTransactions,
    clients,
    businessStats,
    business,
    addTransaction,
    addStamp,
    addClient,
    updateBusinessStats: setBusinessStats
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
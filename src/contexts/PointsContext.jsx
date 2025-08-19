// src/contexts/PointsContext.jsx
import { createContext, useContext, useState } from 'react';

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

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const addClient = (client) => {
    setClients(prev => [client, ...prev]);
  };

  const value = {
    transactions,
    clients,
    addTransaction,
    addClient
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
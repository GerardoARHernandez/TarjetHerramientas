// src/hooks/useClientAccount.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useClientAccount = () => {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAccountData = async (clienteId) => {
    try {
      setIsLoading(true);
      setError('');

      const timestamp = new Date().getTime();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Cliente/EstadoCuenta/${clienteId}?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.Mensaje || 'Error al obtener datos de la cuenta');
      }

      if (data.SDTEstadoCuenta) {
        setAccountData(data.SDTEstadoCuenta);
        return data.SDTEstadoCuenta;
      } else {
        throw new Error('Estructura de datos inválida');
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.clienteId) {
      fetchAccountData(user.clienteId);
    }
  }, [user?.clienteId]);

  const refreshAccountData = () => {
    if (user?.clienteId) {
      return fetchAccountData(user.clienteId);
    }
    return Promise.resolve(null);
  };

  return {
    accountData,
    isLoading,
    error,
    refreshAccountData,
    clearError: () => setError('')
  };
};
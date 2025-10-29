// src/hooks/useBusinessRules.js
import { useState, useEffect } from 'react';

export const useBusinessRules = (businessId) => {
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinessRules = async () => {
    if (!businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `https://souvenir-site.com/WebPuntos/API1/GetReglasNegocio?Negocioid=${businessId}&t=${timestamp}`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result && result.NegocioId) {
        setRules(result);
      } else {
        setRules(null);
      }
    } catch (err) {
      console.error('Error al cargar reglas de negocio:', err);
      setError(err.message);
      setRules(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessRules();
  }, [businessId]);

  return {
    rules,
    loading,
    error,
    refetch: fetchBusinessRules
  };
};
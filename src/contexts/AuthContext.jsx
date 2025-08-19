// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Credenciales válidas (luego se pueden mover a variables de entorno o API)
  const validCredentials = {
    username: 'admin',
    password: '123'
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError('');

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (credentials.username === validCredentials.username && 
          credentials.password === validCredentials.password) {
        setIsAuthenticated(true);
        setUser({ 
          username: credentials.username, 
          name: 'Administrador',
          role: 'admin'
        });
        setError('');
        return { success: true };
      } else {
        setError('Credenciales incorrectas');
        return { success: false, error: 'Credenciales incorrectas' };
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setError('');
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    clearError: () => setError('')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
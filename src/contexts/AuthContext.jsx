// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

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

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      if (storedAuth === 'true' && userName && userEmail) {
        setIsAuthenticated(true);
        setUser({ 
          username: userEmail, 
          name: userName,
          role: 'client'
        });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError('');

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (credentials.username.toLowerCase() === 'admin') {
        // Login para administradores
        if (credentials.password === '123') {
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
      } else {
        // Login para clientes
        if (credentials.password === '123') {
          setIsAuthenticated(true);
          const clientUser = {
            username: credentials.username,
            name: 'Amelia García Suarez',
            role: 'client'
          };
          setUser(clientUser);
          
          // Guardar en localStorage
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', clientUser.name);
          localStorage.setItem('userEmail', clientUser.username);
          
          setError('');
          return { success: true };
        } else {
          setError('Contraseña incorrecta. Use 123 para demo');
          return { success: false, error: 'Contraseña incorrecta' };
        }
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
    
    // Limpiar localStorage para clientes
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
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
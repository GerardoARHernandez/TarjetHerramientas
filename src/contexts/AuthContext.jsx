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
      const userData = localStorage.getItem('userData');
      
      if (storedAuth === 'true' && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError('');

    try {
      // Llamada a la API real
      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Usuario: credentials.username,
          Password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error en la conexión');
      }

      if (data.Acceso) {
        // Login exitoso
        const userData = {
          username: credentials.username,
          name: data.nombre,
          role: data.UsuRol.toLowerCase(),
          rawData: data // Guardar todos los datos de la respuesta por si se necesitan
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        
        // Guardar en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return { success: true };
      } else {
        // Credenciales incorrectas
        setError(data.Mensaje || 'Credenciales incorrectas');
        return { 
          success: false, 
          error: data.Mensaje || 'Credenciales incorrectas' 
        };
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión. Intenta nuevamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    
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
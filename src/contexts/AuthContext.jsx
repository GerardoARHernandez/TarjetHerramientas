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
  const [userType, setUserType] = useState(''); // 'admin' o 'client'
  const [business, setBusiness] = useState(null); // Información del negocio

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('userData');
      const storedUserType = localStorage.getItem('userType');
      const storedBusiness = localStorage.getItem('businessData');
      
      if (storedAuth === 'true' && userData && storedUserType) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
          setUserType(storedUserType);
          
          // Si hay datos del negocio almacenados, cargarlos
          if (storedBusiness) {
            setBusiness(JSON.parse(storedBusiness));
          } else if (storedUserType === 'admin' && parsedUser.rawData?.NegocioId) {
            // Si es admin y no hay datos del negocio pero sí un NegocioId, cargarlos
            await fetchBusinessData(parsedUser.rawData.NegocioId);
          }
        } catch (error) {
          console.error('Error parsing stored data:', error);
          logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  // Función para obtener datos del negocio
  const fetchBusinessData = async (businessId) => {
    try {
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Negocio/${businessId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al obtener datos del negocio');
      }

      if (data.listNegocio && !data.error) {
        setBusiness(data.listNegocio);
        localStorage.setItem('businessData', JSON.stringify(data.listNegocio));
        return data.listNegocio;
      } else {
        throw new Error(data.Mensaje || 'Error en los datos del negocio');
      }
    } catch (err) {
      console.error('Error fetching business data:', err);
      return null;
    }
  };

  const loginAdmin = async (credentials) => {
    setIsLoading(true);
    setError('');

    try {
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
        const userData = {
          username: credentials.username,
          name: data.nombre,
          role: data.UsuRol.toLowerCase(),
          rawData: data
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        setUserType('admin');
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userType', 'admin');
        
        // Obtener datos del negocio si está disponible el NegocioId
        if (data.NegocioId) {
          const businessData = await fetchBusinessData(data.NegocioId);
          if (!businessData) {
            console.warn('No se pudieron obtener los datos del negocio');
          }
        }
        
        return { success: true };
      } else {
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

  const loginClient = async (credentials) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {};
      
      // Solo incluir los campos que están presentes
      if (credentials.phone) payload.UsuarioTelefono = credentials.phone;
      if (credentials.email) payload.UsuarioCorreo = credentials.email;

      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/LoginCliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error en la conexión');
      }

      if (data.Acceso) {
        const userData = {
          username: credentials.phone || credentials.email,
          name: data.nombre || 'Cliente',
          role: 'client',
          rawData: data,
          // Agregar el ID del cliente para usar en las consultas
          clienteId: data.usuarioId
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        setUserType('client');
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userType', 'client');
        
        return { success: true };
      } else {
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
    setUserType('');
    setBusiness(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('businessData');
    
    setError('');
  };

  const value = {
    isAuthenticated,
    user,
    userType,
    business, // Añadir business al contexto
    isLoading,
    error,
    loginAdmin,
    loginClient,
    logout,
    clearError: () => setError(''),
    refreshBusinessData: () => {
      if (user?.rawData?.NegocioId) {
        return fetchBusinessData(user.rawData.NegocioId);
      }
      return Promise.resolve(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
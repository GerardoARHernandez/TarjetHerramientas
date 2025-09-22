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

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('userData');
      const userData = localStorage.getItem('userData');
      const storedUserType = localStorage.getItem('userType');
      
      if (storedAuth === 'true' && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      if (storedAuth === 'true' && userData && storedUserType) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
          setUserType(storedUserType);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  const loginAdmin = async (credentials) => {
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
          rawData: data
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
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    
    setError('');
  };

  const value = {
    isAuthenticated,
    user,
    userType,
    isLoading,
    error,
    loginAdmin,
    loginClient,
    logout,
    clearError: () => setError('')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
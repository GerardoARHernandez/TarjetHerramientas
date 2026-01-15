import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import ClientLogin from '../components/ClientLogin';

const Login = () => {
  const [loginType, setLoginType] = useState('client'); // 'client' o 'admin'
  const [message, setMessage] = useState('');
  const { negocioId } = useParams(); // Obtener negocioId de la URL
  const [negocioInfo, setNegocioInfo] = useState(null); // Estado para almacenar la info del negocio
  const [loadingNegocio, setLoadingNegocio] = useState(true); // Estado de carga del negocio

  const navigate = useNavigate();
  const { loginAdmin, loginClient, isAuthenticated, user, userType, isLoading, error } = useAuth();

  // Obtener información del negocio desde la API
  useEffect(() => {
    const fetchNegocioInfo = async () => {
      // Si no hay negocioId en la URL, usar imagen por defecto
      if (!negocioId || isNaN(parseInt(negocioId))) {
        setLoadingNegocio(false);
        return;
      }

      try {
        setLoadingNegocio(true);
        const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Negocio/${negocioId}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener información del negocio');
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.Mensaje || 'Error en la información del negocio');
        }

        setNegocioInfo(result.listNegocio);
      } catch (error) {
        console.error('Error al cargar información del negocio:', error);
        // No mostrar error al usuario, solo usar imagen por defecto
      } finally {
        setLoadingNegocio(false);
      }
    };

    fetchNegocioInfo();
  }, [negocioId]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'admin') {
        navigate('/points');
      } else {
        navigate('/points-loyalty/points');
      }
    }
  }, [isAuthenticated, userType, navigate]);

  // Mostrar errores del contexto
  useEffect(() => {
    if (error) {
      setMessage(error);
      setTimeout(() => setMessage(''), 3000);
    }
  }, [error]);

  const handleAdminLogin = async (credentials) => {
    const result = await loginAdmin(credentials);
    
    if (!result.success) {
      setMessage(result.error || 'Error al iniciar sesión');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleClientLogin = async (credentials) => {
    const result = await loginClient(credentials, negocioId);
    
    if (!result.success) {
      setMessage(result.error || 'Error al iniciar sesión');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Función para obtener la imagen de fondo
  const getImagenFondo = () => {
    if (!negocioInfo || !negocioInfo.NegocioImagenUrl) {
      return '/images/header-client.jpeg';
    }
    
    // Si la URL está vacía o solo contiene espacios
    if (negocioInfo.NegocioImagenUrl.trim() === '') {
      return '/images/header-client.jpeg';
    }
    
    return negocioInfo.NegocioImagenUrl;
  };

  const imagenFondo = getImagenFondo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Loyalty Card Header */}
        <div className="p-2 mb-6">
          <img 
            src={imagenFondo} 
            alt="Header de Cliente" 
            className='rounded-[20px] shadow-2xl w-full'
          />
        </div>

        {/* Renderizar el componente de login correspondiente */}
        {loginType === 'admin' ? (
          <AdminLogin 
            onLogin={handleAdminLogin}
            isLoading={isLoading}
            onSwitchToClient={() => setLoginType('client')}
            negocioInfo={negocioInfo} // Pasar info del negocio
          />
        ) : (
          <ClientLogin 
            onLogin={handleClientLogin}
            isLoading={isLoading}
            onSwitchToAdmin={() => setLoginType('admin')}
            negocioInfo={negocioInfo} // Pasar info del negocio
            negocioId={negocioId} // Pasar negocioId al componente
          />
        )}

        {message && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="whitespace-pre-line">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
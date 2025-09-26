// Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import ClientLogin from '../components/ClientLogin';

const Login = () => {
  const [loginType, setLoginType] = useState('client'); // 'client' o 'admin'
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { loginAdmin, loginClient, isAuthenticated, user, userType, isLoading, error } = useAuth();

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
    const result = await loginClient(credentials);
    
    if (!result.success) {
      setMessage(result.error || 'Error al iniciar sesión');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Loyalty Card Header */}
        <div className="p-2 mb-6">
          <img 
            src="/images/header-client.jpeg" 
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
          />
        ) : (
          <ClientLogin 
            onLogin={handleClientLogin}
            isLoading={isLoading}
            onSwitchToAdmin={() => setLoginType('admin')}
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
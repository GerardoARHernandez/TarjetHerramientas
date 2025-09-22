// Login.jsx
import { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AdminLogin from '../components/AdminLogin';
import ClientLogin from '../components/ClientLogin';

const Login = () => {
  const [loginType, setLoginType] = useState('client'); // 'client' o 'admin'
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    
    if (result.success) {
      // La redirección se manejará en el useEffect anterior
    } else {
      setMessage(result.error || 'Error al iniciar sesión');
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

  // Determinar el tipo de input basado en el contenido
  const getInputType = () => {
    if (username.toLowerCase() === 'admin') return 'admin';
    if (/^\d+$/.test(username)) return 'phone';
    return 'email';
  };

  const inputType = getInputType();

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

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">INICIAR SESIÓN</h1>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputType === 'admin' ? 'Usuario' : 
                 inputType === 'phone' ? 'Teléfono' : 'Email o teléfono'}:
              </label>
              <div className="relative">
                {inputType === 'admin' ? (
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                ) : inputType === 'phone' ? (
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                ) : (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={inputType === 'admin' ? 'Usuario administrador' : 
                              'Ingresa tu email o teléfono'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña:
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"} // Cambiar tipo según estado
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!username || !password || isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
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
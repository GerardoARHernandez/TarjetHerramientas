import { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/points');
      } else {
        navigate('/points-loyalty/points');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessage('Por favor completa todos los campos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    const result = await login({ username, password });
    
    if (result.success) {
      // La redirección se manejará en el useEffect anterior
    } else {
      setMessage(result.error || 'Error al iniciar sesión');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setIsLoading(false);
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
            src="/images/header-client.jpeg" alt="Header de Cliente" 
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                />
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

          {message && (
            <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p className="whitespace-pre-line">{message}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">¿Aún no tiene cuenta?</p>
            <button
              onClick={() => navigate('/points-loyalty/registrar')}
              className="mt-2 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              REGÍSTRESE PARA RECIBIR NUESTRAS RECOMPENSAS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
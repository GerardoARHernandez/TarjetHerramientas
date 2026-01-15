// components/AdminLogin.jsx
import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLogin = ({ onLogin, isLoading, onSwitchToClient, negocioInfo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  // Obtener negocioId para el enlace de registro
  const getNegocioId = () => {
    // Intentar obtener el negocioId de diferentes formas:
    // 1. De la info del negocio
    if (negocioInfo && negocioInfo.NegocioId) {
      return negocioInfo.NegocioId;
    }
    
    // 2. De la URL actual
    const pathParts = window.location.pathname.split('/');
    const negocioIndex = pathParts.indexOf('negocio');
    if (negocioIndex !== -1 && pathParts[negocioIndex + 1]) {
      return pathParts[negocioIndex + 1];
    }
    
    return null;
  };

  const negocioId = getNegocioId();

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ADMINISTRADOR</h1>
        <p className="text-gray-600">Ingresa tus credenciales de administrador</p>
        
        {/* Mostrar nombre del negocio si está disponible */}
        {negocioInfo && negocioInfo.NegocioDesc && (
          <p className="text-sm text-gray-500 mt-1">
            Negocio: <span className="font-semibold">{negocioInfo.NegocioDesc}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario:
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Usuario administrador"
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!username || !password || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors hover:cursor-pointer ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión como Admin'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        {/* Botón para cambiar a login de cliente */}
        <button
          onClick={onSwitchToClient}
          className="text-blue-600 hover:text-blue-800 hover:cursor-pointer text-sm font-medium block w-full"
        >
          ¿Eres cliente? Inicia sesión aquí
        </button>

        {/* Enlace para registro de cliente si hay negocioId */}
        {negocioId && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta de cliente?</p>
            <Link
              to={`/points-loyalty/registrar/${negocioId}`}
              className="inline-block text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
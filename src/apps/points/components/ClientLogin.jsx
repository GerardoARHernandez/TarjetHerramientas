// components/ClientLogin.jsx
import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClientLogin = ({ onLogin, isLoading, onSwitchToAdmin, negocioInfo }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email && !phone) {
      return;
    }

    // Siempre enviar ambos campos, incluso si están vacíos
    onLogin({ 
      email: email || '', 
      phone: phone || '' 
    });
  };

  const isFormValid = email || phone; // Al menos uno debe estar lleno

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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">CLIENTE</h1>
        <p className="text-gray-600">Ingresa tu email y teléfono</p>
        
        {/* Mostrar nombre del negocio si está disponible */}
        {negocioInfo && negocioInfo.NegocioDesc && (
          <p className="text-sm text-gray-500 mt-1">
            Negocio: <span className="font-semibold">{negocioInfo.NegocioDesc}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email:
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        {/* Campo de Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono:
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5555555555"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-lg text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 cursor-pointer'
          }`}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {/* Botón para cambiar a login de admin */}
        <div className="text-left">
          <button
            onClick={onSwitchToAdmin}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer flex items-center"
          >
            <MdOutlineAdminPanelSettings className='text-lg mr-1' />
          </button>
        </div>

        {/* Enlace para registro de cliente si hay negocioId */}
        {negocioId && (
          <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
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

export default ClientLogin;
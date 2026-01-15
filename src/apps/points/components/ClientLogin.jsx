import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ClientLogin = ({ onLogin, isLoading, onSwitchToAdmin, negocioInfo, negocioId }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email && !phone) {
      return;
    }

    if (!negocioId) {
      alert('Error: No se ha especificado el negocio. Por favor, accede a través de un enlace válido.');
      return;
    }

    // Siempre enviar ambos campos, incluso si están vacíos
    onLogin({ 
      email: email || '', 
      phone: phone || '' 
    });
  };

  const isFormValid = (email || phone) && negocioId; // Al menos uno debe estar lleno y tener negocioId

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
        
        {/* Mostrar advertencia si no hay negocioId */}
        {!negocioId && (
          <div className="mt-2 p-2 bg-yellow-100 rounded border border-yellow-300">
            <p className="text-sm text-yellow-800">
              ⚠️ Acceso inválido. Por favor, usa el enlace proporcionado por el negocio.
            </p>
          </div>
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
              disabled={!negocioId}
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
              disabled={!negocioId}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
            isLoading || !negocioId
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : isFormValid
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Iniciando sesión...' : !negocioId ? 'Enlace inválido' : 'Iniciar Sesión'}
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
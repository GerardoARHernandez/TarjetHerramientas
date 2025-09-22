// components/ClientLogin.jsx
import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

const ClientLogin = ({ onLogin, isLoading, onSwitchToAdmin }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">CLIENTE</h1>
        <p className="text-gray-600">Ingresa tu email y teléfono</p>
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

        {/* Información adicional */}
        {/* <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Nota:</strong> Puedes ingresar solo tu email, solo tu teléfono, o ambos. 
            La API validará con la información proporcionada.
          </p>
        </div> */}
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 cursor-pointer'
          }`}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión como Cliente'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToAdmin}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ¿Eres administrador? Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};

export default ClientLogin;
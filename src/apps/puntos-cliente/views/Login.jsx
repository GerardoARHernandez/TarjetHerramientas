import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';

// Componente de Login
const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (phone) {
      setStep(2);
    }
  };

  const handleLogin = () => {
    if (code === '123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', 'Amelia García Suarez');
      navigate('/client/stamps');
    } else {
      alert('Código incorrecto. Use 123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">INICIAR SESIÓN</h1>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingrese su teléfono"
                />
              </div>
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!phone}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código:
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-mono"
                placeholder="Ingrese código (123)"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={!code}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Iniciar Sesión
            </button>
            
            <button
              onClick={() => setStep(1)}
              className="w-full text-red-600 py-2 text-sm hover:text-red-700"
            >
              ← Volver
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">¿Aún no tiene cuenta?</p>
          <button
            onClick={() => navigate('/client/register')}
            className="mt-2 text-red-600 hover:text-red-700 font-semibold"
          >
            REGÍSTRESE PARA RECIBIR NUESTRAS RECOMPENSAS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
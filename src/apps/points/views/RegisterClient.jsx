// src/apps/points/views/RegisterClient
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone } from 'lucide-react';
import { usePoints } from '../../../contexts/PointsContext';

const RegisterClient = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addClient, clients } = usePoints();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      setMessage('Por favor completa todos los campos');

      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('El número de teléfono debe tener exactamente 10 dígitos');

      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    // Verificar si el teléfono ya está registrado
    const phoneExists = clients.some(client => client.phone === formData.phone);
    if (phoneExists) {
      setMessage('Este número de teléfono ya está registrado. Por favor inicie sesión.');
      setTimeout(() => {
        setMessage('');
        navigate('/points-loyalty/login');

      }, 3000);
      return;
    }
    

    setIsSubmitting(true);

    // Simular registro
    setTimeout(() => {
      const newClient = {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
        registrationDate: new Date().toLocaleDateString('es-MX'),
        points: 0
      };

      addClient(newClient);
      setIsSubmitting(false);
      
      setMessage(`¡Registro exitoso! Bienvenido ${formData.name}\n\nAhora puede iniciar sesión con su teléfono y contraseña 123`);

      setTimeout(() => {
        setMessage('');
      }, 3000);
      
      // Redirigir al login
      navigate('/points-loyalty/login');
    }, 1000);
  };

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

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">REGISTRARSE</h1>
            <p className="text-gray-600">Únete a nuestro programa de fidelidad</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingrese su nombre completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="10 dígitos sin espacios"
                  maxLength="10"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Ejemplo: 5512345678</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="whitespace-pre-line">{message}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">¿Ya tienes cuenta?</p>
            <button
              onClick={() => navigate('/points-loyalty/login')}
              className="mt-2 text-red-600 hover:text-red-700 font-semibold hover:cursor-pointer"
            >
              INICIAR SESIÓN
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold mb-2">Información importante:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use su número de teléfono para iniciar sesión</li>
              <li>• Contraseña de demo: <span className="font-mono">123</span></li>
              <li>• Después del registro podrá iniciar sesión inmediatamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
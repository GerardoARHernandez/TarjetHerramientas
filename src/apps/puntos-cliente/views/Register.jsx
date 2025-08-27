import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Gift, Phone, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    phone: '',
    fullName: '',
    acceptNotifications: false
  });
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone && formData.fullName) {
      alert('Registro exitoso! Ahora puede iniciar sesión');
      navigate('/client/login');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="text-center">
            <Gift className="mx-auto w-16 h-16 text-red-600 mb-4" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              REGÍSTRESE PARA RECIBIR
            </h1>
            <h2 className="text-lg font-semibold text-red-600">
              NUESTRAS RECOMPENSAS
            </h2>
            <div className="mt-4 bg-red-50 rounded-lg p-3">
              <p className="text-red-800 font-medium">TARJETA DE SELLOS</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <button
            onClick={() => navigate('/client/login')}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono:
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingrese su teléfono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre y Apellidos
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Importante para reclamar sus beneficios
              </p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptNotifications"
                checked={formData.acceptNotifications}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label className="ml-3 text-sm text-gray-700">
                Acepto recibir recordatorio de mis puntos y ofertas de este negocio.
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
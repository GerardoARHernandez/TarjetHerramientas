// src/apps/points/views/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Phone, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert('El número de teléfono debe tener exactamente 10 dígitos');
      return;
    }

    // Simular registro exitoso
    alert(`¡Registro exitoso! Bienvenido ${formData.name}`);
    
    // Redirigir al login
    navigate('/points/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Loyalty Card Header */}
        <div className="p-2 mb-6">
          <img 
            src="/images/header-client.jpeg" alt="Header de Cliente" 
            className='rounded-[20px] shadow-2xl'
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
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">¿Ya tienes cuenta?</p>
            <button
              onClick={() => navigate('/points/login')}
              className="mt-2 text-red-600 hover:text-red-700 font-semibold"
            >
              INICIAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
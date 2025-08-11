import { useState } from 'react';

export const RegisterClient = ({ onAddClient }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    // Simular procesamiento
    setTimeout(() => {
      const newClient = {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
        registrationDate: new Date().toLocaleDateString('es-MX')
      };

      onAddClient(newClient);
      setFormData({ name: '', phone: '' });
      setIsSubmitting(false);
      alert(`Cliente registrado exitosamente:\n\nNombre: ${newClient.name}\nTeléfono: ${newClient.phone}`);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Registrar Nuevo Cliente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Nombre del cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="10 dígitos sin espacios"
              maxLength="10"
            />
            <p className="text-sm text-gray-500 mt-1">Ejemplo: 5512345678</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
};
import { useState } from 'react';

export const Register = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({ 
    phone: '', 
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones mejoradas
    if (!formData.phone || !formData.amount) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert('El número de teléfono debe tener exactamente 10 dígitos');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('La cantidad debe ser un número mayor a 0');
      return;
    }

    setIsSubmitting(true);

    // Calcular puntos (10% del monto, redondeado hacia abajo)
    const points = amount * 0.1;
    
    const transaction = {
      id: Date.now(), // ID único para cada transacción
      phone: formData.phone,
      clientName: formData.clientName,
      amount: amount,
      points: points,
      date: new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onAddTransaction(transaction);
    setFormData({ phone: '', amount: '', clientName: '' });
    setIsSubmitting(false);
    
    alert(`¡Compra registrada exitosamente!
    Teléfono: ${formData.phone}
    Monto: $${amount.toFixed(2)}
    Puntos obtenidos: ${points}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Registrar Nueva Compra
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono del Cliente
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de la Compra ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0.00"
            />
          </div>

          {formData.amount && !isNaN(formData.amount) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">
                Puntos a otorgar: {parseFloat(formData.amount) * 0.1} puntos
                <span className="block text-sm text-blue-600 mt-1">
                  (10% del monto de la compra)
                </span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
          </button>
        </form>
      </div>
    </div>
  );
};
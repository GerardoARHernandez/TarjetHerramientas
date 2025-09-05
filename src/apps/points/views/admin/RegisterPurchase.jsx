// src/apps/admin-puntos/views/RegisterPurchase.jsx
import { useState, useEffect } from 'react';
import { usePoints } from '../../../../contexts/PointsContext';

export const RegisterPurchase = () => {
  const [formData, setFormData] = useState({ 
    clientId: '',
    amount: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  
  const { clients, addTransaction } = usePoints();

  // Filtrar clientes cuando cambia el teléfono
  useEffect(() => {
    if (formData.phone.length >= 3) {
      const filtered = clients.filter(client => 
        client.phone.includes(formData.phone)
      );
      setFilteredClients(filtered);
      
      // Si solo hay un cliente coincidente, seleccionarlo automáticamente
      if (filtered.length === 1) {
        setFormData(prev => ({
          ...prev,
          clientId: filtered[0].id.toString()
        }));
      }
    } else {
      setFilteredClients(clients);
    }
  }, [formData.phone, clients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.clientId) {
      alert('Por favor selecciona un cliente');
      return;
    }

    if (!formData.amount) {
      alert('Por favor ingresa el monto de la compra');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      alert('El monto debe ser un número válido');
      return;
    }

    if (amount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    const selectedClient = clients.find(c => c.id.toString() === formData.clientId);
    if (!selectedClient) {
      alert('Cliente no encontrado. Por favor verifica la selección');
      return;
    }

    setIsSubmitting(true);

    // Calcular puntos (10% del monto, redondeado hacia abajo)
    const points = Math.floor(amount * 0.1);
    
    // Crear objeto de transacción
    const transaction = {
      id: Date.now(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      phone: selectedClient.phone,
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

    // Simular tiempo de procesamiento
    setTimeout(() => {
      addTransaction(transaction);
      setFormData({ clientId: '', amount: '', phone: '' });
      setIsSubmitting(false);
      
      // Mostrar confirmación detallada
      alert(`✅ Compra registrada exitosamente
      
Cliente: ${selectedClient.name}
Teléfono: ${selectedClient.phone}
Monto: $${amount.toFixed(2)}
Puntos otorgados: ${points}`);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Registrar Compra</h2>
          <p className="text-gray-600 mt-2">Registra compras para acumular puntos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Buscador de cliente por teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Cliente por Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({
                ...formData, 
                phone: e.target.value.replace(/\D/g, ''),
                clientId: '' // Resetear selección al cambiar teléfono
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ingresa los primeros dígitos"
              maxLength="10"
            />
            <p className="text-sm text-gray-500 mt-1">Ingresa al menos 3 dígitos para buscar</p>
          </div>

          {/* Selector de cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Cliente
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              disabled={filteredClients.length === 0}
            >
              <option value="">{filteredClients.length === 0 ? 'No hay clientes disponibles' : 'Selecciona un cliente'}</option>
              {filteredClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone} 
                </option>
              ))}
            </select>
          </div>

          {/* Monto de la compra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de la Compra (MXN)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Resumen de puntos */}
          {formData.amount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Puntos a otorgar:</span>
                <span className="text-xl font-bold text-blue-900">
                  {Math.floor(formData.amount * 0.1)} pts
                </span>
              </div>
              <div className="mt-2 text-sm text-blue-600">
                <p>Cálculo: 10% del monto (${formData.amount}) = {formData.amount * 0.1} pts</p>
                <p className="mt-1">* Se redondea hacia abajo al número entero más cercano</p>
              </div>
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.clientId || !formData.amount}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              isSubmitting || !formData.clientId || !formData.amount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-md'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Registrar Compra'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
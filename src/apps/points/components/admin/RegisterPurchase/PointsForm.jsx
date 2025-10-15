// src/apps/points/components/admin/RegisterPurchase/PointsForm.jsx
import { Coins } from 'lucide-react';
import { useState } from 'react';

const PointsForm = ({ 
  formData, 
  onFormDataChange, 
  selectedClient,
  isSubmitting, 
  onSubmit 
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'Por favor ingresa el monto de la compra';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        newErrors.amount = 'El monto debe ser un número válido';
      } else if (amount <= 0) {
        newErrors.amount = 'El monto debe ser mayor a 0';
      }
    }

    if (!selectedClient) {
      newErrors.client = 'Por favor selecciona un cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);
    await onSubmit(amount, selectedClient);
  };

  const points = formData.amount > 0 ? Math.floor(formData.amount * 0.1) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de monto */}
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
            onChange={(e) => onFormDataChange({ ...formData, amount: e.target.value })}
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Resumen de puntos */}
      {selectedClient && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Coins className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Resumen de Puntos</h4>
              <p className="text-sm text-gray-600">
                Cliente: {selectedClient.name}
              </p>
            </div>
          </div>
          
          {formData.amount > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-800">Puntos a otorgar:</span>
                <span className="text-lg font-bold text-blue-900">
                  {points} pts
                </span>
              </div>
              <div className="text-sm text-blue-600">
                <p>Cálculo: 10% del monto (${formData.amount}) = {formData.amount * 0.1} pts</p>
                <p className="mt-1">* Se redondea hacia abajo al número entero más cercano</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón de submit */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedClient || !formData.amount}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          isSubmitting || !selectedClient || !formData.amount
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md'
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
          'Registrar Compra y Puntos'
        )}
      </button>
    </form>
  );
};

export default PointsForm;
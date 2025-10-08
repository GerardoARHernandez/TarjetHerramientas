// src/apps/points/components/admin/RegisterPurchase/StampsForm.jsx
import { Stamp } from 'lucide-react';
import { useState } from 'react';

const StampsForm = ({ 
  formData, 
  onFormDataChange, 
  selectedClient, // ← Recibir selectedClient (objeto completo)
  isSubmitting, 
  onSubmit 
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.stamps || formData.stamps <= 0) {
      newErrors.stamps = 'Por favor ingresa un número válido de sellos';
    } else if (formData.stamps > 10) {
      newErrors.stamps = 'Máximo 10 sellos por transacción';
    }

    if (!selectedClient) {
      newErrors.client = 'Por favor selecciona un cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData.stamps); // ← Solo pasar stamps, selectedClient ya está disponible
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de sellos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Sellos a Asignar
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">
            <Stamp className="w-4 h-4" />
          </span>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.stamps}
            onChange={(e) => onFormDataChange({ ...formData, stamps: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.stamps ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="1"
          />
        </div>
        {errors.stamps ? (
          <p className="text-red-600 text-sm mt-1">{errors.stamps}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">Generalmente se asigna 1 sello por compra</p>
        )}
      </div>

      {/* Resumen de sellos */}
      {selectedClient && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Stamp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Resumen de Sellos</h4>
              <p className="text-sm text-gray-600">
                Cliente: {selectedClient.name}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-orange-800">Sellos a asignar:</span>
              <span className="text-lg font-bold text-orange-900">
                {formData.stamps} sello{formData.stamps != 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-sm text-orange-600">
              <p>El cliente recibirá {formData.stamps} sello(s) en su tarjeta</p>
            </div>
          </div>
        </div>
      )}

      {/* Botón de submit */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedClient || !formData.stamps}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          isSubmitting || !selectedClient || !formData.stamps
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md'
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
          'Asignar Sellos'
        )}
      </button>
    </form>
  );
};

export default StampsForm;
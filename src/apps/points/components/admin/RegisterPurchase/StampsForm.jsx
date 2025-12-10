// src/apps/points/components/admin/RegisterPurchase/StampsForm.jsx
import { Stamp } from 'lucide-react';
import { useState, useEffect } from 'react';

const StampsForm = ({ 
  formData, 
  onFormDataChange, 
  selectedClient,
  isSubmitting, 
  onSubmit,
  businessRules,
  onValidationError,
  onClearForm 
}) => {
  const [errors, setErrors] = useState({});
  const [calculatedStamps, setCalculatedStamps] = useState(1);
  const [useAmount, setUseAmount] = useState(false);

  // Calcular sellos cuando cambie el monto o las reglas
  useEffect(() => {
    if (useAmount && formData.amount && !isNaN(parseFloat(formData.amount))) {
      const amount = parseFloat(formData.amount);
      const stamps = calculateStamps(amount);
      setCalculatedStamps(stamps);
      
      // Validar monto mínimo
      validateMinimumAmount(amount);
    } else {
      setCalculatedStamps(parseInt(formData.stamps) || 1);
      onValidationError('');
    }
  }, [formData.amount, formData.stamps, useAmount, businessRules]);

  // Limpiar formulario cuando se deselecciona el cliente
  useEffect(() => {
    if (!selectedClient) {
      if (useAmount && formData.amount) {
        onFormDataChange({ ...formData, amount: '' });
      } else if (formData.stamps !== 1) {
        onFormDataChange({ ...formData, stamps: 1 });
      }
    }
  }, [selectedClient]);

  const calculateStamps = (amount) => {
    if (!businessRules || !businessRules.ReglasMontoMinimo) {
      return 1;
    }
    
    const minAmount = parseFloat(businessRules.ReglasMontoMinimo);
    const purchaseAmount = parseFloat(amount);
    
    if (!businessRules.ReglasAcumulable) {
      return 1;
    }
    
    return Math.floor(purchaseAmount / minAmount);
  };

  const validateMinimumAmount = (amount) => {
    if (!businessRules || !businessRules.ReglasMontoMinimo) {
      onValidationError('');
      return true;
    }
    
    const minAmount = parseFloat(businessRules.ReglasMontoMinimo);
    const purchaseAmount = parseFloat(amount);
    
    if (purchaseAmount < minAmount) {
      onValidationError(`El monto mínimo de compra es $${minAmount.toFixed(2)}`);
      return false;
    }
    
    onValidationError('');
    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    if (useAmount) {
      if (!formData.amount) {
        newErrors.amount = 'Por favor ingresa el monto de la compra';
      } else {
        const amount = parseFloat(formData.amount);
        if (isNaN(amount)) {
          newErrors.amount = 'El monto debe ser un número válido';
        } else if (amount <= 0) {
          newErrors.amount = 'El monto debe ser mayor a 0';
        } else if (!validateMinimumAmount(amount)) {
          newErrors.amount = `Monto insuficiente`;
        }
      }
    } else {
      if (!formData.stamps || formData.stamps <= 0) {
        newErrors.stamps = 'Por favor ingresa un número válido de sellos';
      } else if (formData.stamps > 10) {
        newErrors.stamps = 'Máximo 10 sellos por transacción';
      }
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

    if (useAmount) {
      const amount = parseFloat(formData.amount);
      onSubmit(calculatedStamps, amount);
    } else {
      onSubmit(formData.stamps, 0);
    }
  };

  // Función para limpiar el formulario manualmente
  const handleClearForm = () => {
    if (useAmount) {
      onFormDataChange({ ...formData, amount: '' });
    } else {
      onFormDataChange({ ...formData, stamps: 1 });
    }
    setErrors({});
    onValidationError('');
  };

  const stampsToShow = useAmount ? calculatedStamps : formData.stamps;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de modo */}
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={!useAmount}
            onChange={() => setUseAmount(false)}
            className="mr-2 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">Asignar sellos manualmente</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={useAmount}
            onChange={() => setUseAmount(true)}
            className="mr-2 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">Calcular sellos por monto</span>
        </label>
      </div>

      {/* Campo dinámico según el modo */}
      {useAmount ? (
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
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
          )}
          {businessRules?.ReglasMontoMinimo && (
            <p className="text-xs text-gray-500 mt-1">
              Monto mínimo: ${parseFloat(businessRules.ReglasMontoMinimo).toFixed(2)} | 
              Acumulable: {businessRules.ReglasAcumulable ? 'Sí' : 'No'}
              {businessRules.ReglasAcumulable && ` (cada $${parseFloat(businessRules.ReglasMontoMinimo).toFixed(2)} = 1 sello)`}
            </p>
          )}
        </div>
      ) : (
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
      )}

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
                {stampsToShow} sello{stampsToShow != 1 ? 's' : ''}
              </span>
            </div>
            {useAmount && businessRules?.ReglasAcumulable && (
              <div className="text-sm text-orange-600">
                <p>
                  Cálculo: ${formData.amount} ÷ ${parseFloat(businessRules.ReglasMontoMinimo).toFixed(2)} = {calculatedStamps} sellos
                </p>
              </div>
            )}
            <div className="text-sm text-orange-600">
              <p>El cliente recibirá {stampsToShow} sello(s) en su tarjeta</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting || !selectedClient || (!useAmount && !formData.stamps) || (useAmount && !formData.amount)}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all cursor-pointer ${
            isSubmitting || !selectedClient || (!useAmount && !formData.stamps) || (useAmount && !formData.amount)
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
            useAmount ? 'Registrar Compra y Sellos' : 'Asignar Sellos'
          )}
        </button>

        {/* Botón para limpiar formulario */}
        {(formData.amount || formData.stamps !== 1 || selectedClient) && (
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isSubmitting}
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
};

export default StampsForm;
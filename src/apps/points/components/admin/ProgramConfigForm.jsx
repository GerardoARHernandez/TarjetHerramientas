// src/apps/points/components/admin/ProgramConfigForm.jsx
const ProgramConfigForm = ({ config, onConfigChange, business }) => {
  // Determinar si el programa es de puntos basado en el negocio
  const isPuntosProgram = business?.NegocioTipoPS === 'P';
  
  // Si es programa de puntos, el acumulable siempre es true y no se puede cambiar
  const isAcumulableForced = config.tipoPrograma === 'P';

  const handleInputChange = (field, value) => {
    // Si cambian a programa de puntos, forzar acumulable a true
    if (field === 'tipoPrograma' && value === 'P') {
      onConfigChange('acumulable', true);
    }
    onConfigChange(field, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 col-span-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración del Programa</h2>
      
      {/* Monto Mínimo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto Mínimo
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            type="number"
            value={config.montoMinimo}
            onChange={(e) => handleInputChange('montoMinimo', e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Tipo de Programa */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Programa
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="P"
              checked={config.tipoPrograma === 'P'}
              onChange={(e) => handleInputChange('tipoPrograma', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Puntos</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="S"
              checked={config.tipoPrograma === 'S'}
              onChange={(e) => handleInputChange('tipoPrograma', e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Sellos</span>
          </label>
        </div>
        {isPuntosProgram && (
          <p className="text-xs text-blue-600 mt-1">
            * Este negocio está configurado como programa de {business.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
          </p>
        )}
      </div>

      {/* Campo dinámico según tipo de programa */}
      {config.tipoPrograma === 'P' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Porcentaje de Puntos
          </label>
          <div className="relative">
            <input
              type="number"
              value={config.porcentajePuntos}
              onChange={(e) => handleInputChange('porcentajePuntos', e.target.value)}
              className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
            />
            <span className="absolute right-3 top-3 text-gray-500">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Porcentaje del monto que se convertirá en puntos (ej: 5% = 5 puntos por cada $100)
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de Sellos
          </label>
          <input
            type="number"
            value={config.cantidadSellos}
            onChange={(e) => handleInputChange('cantidadSellos', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número de sellos requeridos para canjear una recompensa
          </p>
        </div>
      )}

      {/* Acumulable */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.acumulable}
            onChange={(e) => !isAcumulableForced && handleInputChange('acumulable', e.target.checked)}
            disabled={isAcumulableForced}
            className={`mr-2 text-blue-600 focus:ring-blue-500 rounded ${
              isAcumulableForced ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <span className={`text-sm font-medium ${
            isAcumulableForced ? 'text-blue-600' : 'text-gray-700'
          }`}>
            Programa Acumulable
            {isAcumulableForced && ' (Siempre activo para Puntos)'}
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          {config.acumulable 
            ? (config.tipoPrograma === 'P' 
                ? 'Los puntos se acumulan según el porcentaje configurado' 
                : 'Los sellos se acumulan según el monto mínimo (ej: cada $100 = 1 sello)'
              )
            : 'Solo se otorga 1 sello independientemente del monto gastado'
          }
        </p>
      </div>

      {/* Observaciones */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones
        </label>
        <textarea
          value={config.observaciones}
          onChange={(e) => handleInputChange('observaciones', e.target.value)}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Notas adicionales sobre la configuración..."
        />
      </div>

      {/* Botón de Guardar */}
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
        Guardar Configuración
      </button>
    </div>
  );
};

export default ProgramConfigForm;
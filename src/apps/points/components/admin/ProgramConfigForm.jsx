// src/apps/points/components/admin/ProgramConfigForm.jsx
import { useState, useEffect } from 'react';

const ProgramConfigForm = ({ config, onConfigChange, business }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Determinar si el programa es de puntos basado en el negocio
  const isPuntosProgram = business?.NegocioTipoPS === 'P';
  const isSellosProgram = business?.NegocioTipoPS === 'S';
  
  // Si es programa de puntos, el acumulable siempre es true y no se puede cambiar
  const isAcumulableForced = config.tipoPrograma === 'P';

  const handleInputChange = (field, value) => {
    // Si cambian a programa de puntos, forzar acumulable a true
    if (field === 'tipoPrograma' && value === 'P') {
      onConfigChange('acumulable', true);
    }
    onConfigChange(field, value);
    
    // Limpiar mensajes cuando el usuario modifica algo
    if (message) setMessage(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Preparar los datos según el tipo de programa
      const requestData = {
        ListReglasNegocio: {
          NegocioId: business?.NegocioId,
          ReglasMontoMinimo: parseFloat(config.montoMinimo) || 0,
          ReglasSellos: config.tipoPrograma === 'S' ? parseInt(config.cantidadSellos) || 1 : 1,
          ReglasPorcentaje: config.tipoPrograma === 'P' ? parseFloat(config.porcentajePuntos) || 0 : 10,
          ReglasAcumulable: config.tipoPrograma === 'P' ? true : Boolean(config.acumulable),
          ReglasObservaciones: config.observaciones || "A partir de los 100, obtienes el 10% en puntos"
        }
      };

      console.log('Enviando datos a la API:', requestData);

      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/RegistrarReglasNegocio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      console.log('Respuesta de la API:', result);

      if (result.error === false) {
        setMessage({
          type: 'success',
          text: result.Mensaje || 'Configuración guardada correctamente'
        });
      } else {
        setMessage({
          type: 'error',
          text: result.Mensaje || 'Error al guardar la configuración'
        });
      }

    } catch (error) {
      console.error('Error al enviar la configuración:', error);
      setMessage({
        type: 'error',
        text: 'Error de conexión al guardar la configuración'
      });
    } finally {
      setLoading(false);
    }
  };

  // Forzar tipo de programa basado en el negocio si está definido
  useEffect(() => {
    if (isPuntosProgram && config.tipoPrograma !== 'P') {
      handleInputChange('tipoPrograma', 'P');
      handleInputChange('acumulable', true);
    } else if (isSellosProgram && config.tipoPrograma !== 'S') {
      handleInputChange('tipoPrograma', 'S');
    }
  }, [isPuntosProgram, isSellosProgram]);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 col-span-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración del Programa</h2>
      
      {/* Mostrar mensajes */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

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

      {/* Tipo de Programa - SOLO MOSTRAR SI NO ESTÁ DEFINIDO EL TIPO DE NEGOCIO */}
      {!isPuntosProgram && !isSellosProgram ? (
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
        </div>
      ) : (
        /* Mostrar el tipo de programa fijo cuando está definido en el negocio */
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Programa
          </label>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">
                  {isPuntosProgram ? 'P' : 'S'}
                </span>
              </div>
              <div>
                <p className="font-medium text-blue-800">
                  Programa de {isPuntosProgram ? 'Puntos' : 'Sellos'}
                </p>
                <p className="text-xs text-blue-600">
                  Configurado para este negocio
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              step="0.50"
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
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
          loading 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Guardando...' : 'Guardar Configuración'}
      </button>
    </div>
  );
};

export default ProgramConfigForm;
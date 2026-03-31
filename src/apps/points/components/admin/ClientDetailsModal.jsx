// src/apps/points/components/admin/ClientDetailsModalV2.jsx
import { useEffect, useState } from 'react';
import { WhatsAppButton } from '../../../../utils/whatsappUtils'; // Importar el componente reusable

const ClientDetailsModal = ({ client, onClose, business }) => {
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client?.UsuarioId) {
      fetchAccountData(client.UsuarioId);
    }
  }, [client?.UsuarioId]);

  const fetchAccountData = async (clienteId) => {
    try {
      setIsLoading(true);
      setError('');

      const timestamp = new Date().getTime();
      const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Cliente/EstadoCuenta/${clienteId}?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.Mensaje || 'Error al obtener datos de la cuenta');
      }

      if (data.SDTEstadoCuenta) {
        setAccountData(data.SDTEstadoCuenta);
        return data.SDTEstadoCuenta;
      } else {
        throw new Error('Estructura de datos inválida');
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función mejorada para validar y formatear fechas
  const formatDate = (dateString) => {
    // Validar si la fecha está vacía o es inválida
    if (!dateString || 
        dateString === "  /  /" || 
        dateString === "//" || 
        dateString === "" ||
        dateString.trim() === "") {
      return "No registrada";
    }

    try {
      // Intentar parsear la fecha
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        // Si no se puede parsear directamente, intentar con formato DD/MM/YYYY
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Meses en JS son 0-11
          const year = parseInt(parts[2], 10);
          const alternativeDate = new Date(year, month, day);
          
          if (!isNaN(alternativeDate.getTime())) {
            return alternativeDate.toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        return "Fecha inválida";
      }
      
      // Formatear fecha válida
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Fecha inválida";
    }
  };

  // Función para validar si una fecha es válida
  const isValidDate = (dateString) => {
    if (!dateString || 
        dateString === "  /  /" || 
        dateString === "//" || 
        dateString === "" ||
        dateString.trim() === "") {
      return false;
    }
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return true;
      }
      
      // Intentar con formato DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const alternativeDate = new Date(year, month, day);
        return !isNaN(alternativeDate.getTime());
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const getTransactionType = (type) => {
    return type === 'A' ? 'Acumulación' : type === 'C' ? 'Canje' : 'Desconocido';
  };

  const getTransactionColor = (type) => {
    return type === 'A' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-purple-100 text-purple-800';
  };

  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/5 shadow-lg rounded-xl bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900">
            Detalles del Cliente
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Información básica del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Nombre completo</p>
            <p className="text-lg font-bold">
              {client.UsuarioNombre} {client.UsuarioApellido}
            </p>
          </div>
          {client.UsuarioCorreo && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Correo electrónico</p>
              <p className="text-lg font-bold">{client.UsuarioCorreo}</p>
            </div>
          )}
          {client.UsuarioTelefono && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Teléfono</p>
              <p className="text-lg font-bold">{client.UsuarioTelefono}</p>
            </div>
          )}
          {/* Sección de cumpleaños mejorada */}
          <div className={`${isValidDate(client.UsuarioFecha) ? 'bg-blue-50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <p className={`text-sm ${isValidDate(client.UsuarioFecha) ? 'text-blue-600' : 'text-gray-500'}`}>
              Cumpleaños
            </p>
            <p className={`text-lg font-bold ${!isValidDate(client.UsuarioFecha) && 'text-gray-500'}`}>
              {formatDate(client.UsuarioFecha)}
            </p>
            {!isValidDate(client.UsuarioFecha) && (
              <p className="text-xs text-gray-400 mt-1">
                No registrado
              </p>
            )}
          </div>

          <div>
            <WhatsAppButton
              phone={client.UsuarioTelefono}
              clientName={`${client.UsuarioNombre} ${client.UsuarioApellido}`}
              balance={accountData?.puntosDisponibles || '0'}
              businessName={business?.NegocioDesc}
              businessType={business?.NegocioTipoPS}
              className="mt-4"
            />
          </div>
        </div>

        {/* Estado de cuenta */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando detalles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold mb-2">Error al cargar detalles</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchAccountData(client.UsuarioId)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : accountData ? (
          <div className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Puntos disponibles</p>
                <p className="text-2xl font-bold text-green-700">
                  {accountData.puntosDisponibles || '0'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Puntos redimidos</p>
                <p className="text-2xl font-bold text-purple-700">
                  {accountData.puntosRedimidos || '0'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total puntos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {(parseInt(accountData.puntosDisponibles) || 0) + 
                   (parseInt(accountData.puntosRedimidos) || 0)}
                </p>
              </div>
            </div>

            {/* Historial de movimientos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Historial de Movimientos
                </h4>
                <span className="text-sm text-gray-500">
                  {accountData.Movimientos?.length || 0} movimientos
                </span>
              </div>
              
              {accountData.Movimientos?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Importe
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Referencia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accountData.Movimientos.map((movimiento) => (
                        <tr key={movimiento.TransaccionId}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(movimiento.TransaccionFecha)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionColor(movimiento.TransaccionTipo)}`}>
                              {getTransactionType(movimiento.TransaccionTipo)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {movimiento.TransaccionCant}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {movimiento.TransaccionImporte !== "0.00" 
                              ? `$${parseFloat(movimiento.TransaccionImporte).toFixed(2)}` 
                              : 'Gratis'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono text-xs">
                              {movimiento.TransaccionNoReferen}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No hay movimientos registrados</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No se encontraron detalles del cliente</p>
          </div>
        )}

        {/* Footer con botones */}
        <div className="mt-8 pt-6 border-t flex justify-between items-center">          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
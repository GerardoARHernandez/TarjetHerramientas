// src/apps/points/components/admin/ClientDetailsModalV2.jsx
import { useEffect, useState } from 'react';

const ClientDetailsModal = ({ client, onClose }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Nombre completo</p>
            <p className="text-lg font-bold">
              {client.UsuarioNombre} {client.UsuarioApellido}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Correo electrónico</p>
            <p className="text-lg font-bold">{client.UsuarioCorreo}</p>
          </div>
          {client.UsuarioTelefono && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Teléfono</p>
              <p className="text-lg font-bold">{client.UsuarioTelefono}</p>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">ID Cliente</p>
            <p className="text-lg font-bold">{client.UsuarioId}</p>
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

        {/* Footer */}
        <div className="mt-8 pt-6 border-t flex justify-end gap-3">
          <button
            onClick={() => {
              console.log('Client data:', client);
              console.log('Account data:', accountData);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            Depurar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
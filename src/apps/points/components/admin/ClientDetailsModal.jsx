// src/apps/points/components/admin/ClientDetailsModal.jsx
import { useEffect } from 'react';
import { usePoints } from '../../../../contexts/PointsContext';

const ClientDetailsModal = ({ client, onClose }) => {
  const { selectedClientDetails, isLoadingClientDetails, fetchClientDetails } = usePoints();

  useEffect(() => {
    if (client?.UsuarioId) {
      fetchClientDetails(client.UsuarioId);
    }
  }, [client?.UsuarioId, fetchClientDetails]);

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
        </div>

        {/* Estado de cuenta */}
        {isLoadingClientDetails ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedClientDetails ? (
          <div className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Puntos disponibles</p>
                <p className="text-2xl font-bold text-green-700">
                  {selectedClientDetails.puntosDisponibles}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Puntos redimidos</p>
                <p className="text-2xl font-bold text-purple-700">
                  {selectedClientDetails.puntosRedimidos}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total puntos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {parseInt(selectedClientDetails.puntosDisponibles) + 
                   parseInt(selectedClientDetails.puntosRedimidos)}
                </p>
              </div>
            </div>

            {/* Historial de movimientos */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Historial de Movimientos
              </h4>
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
                    {selectedClientDetails.Movimientos?.map((movimiento) => (
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
                          {movimiento.TransaccionNoReferen}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No se encontraron detalles del cliente</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
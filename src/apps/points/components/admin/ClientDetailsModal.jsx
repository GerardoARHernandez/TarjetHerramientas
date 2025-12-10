// src/apps/points/components/admin/ClientDetailsModalV2.jsx
import { useEffect, useState } from 'react';

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

  // Función para enviar WhatsApp
  const sendWhatsApp = () => {
    if (!client?.UsuarioTelefono) {
      alert('El cliente no tiene número de teléfono registrado');
      return;
    }

    // Número de teléfono (eliminar caracteres no numéricos)
    const phoneNumber = client.UsuarioTelefono.replace(/\D/g, '');
    
    // Mensaje por defecto
    const tipoPrograma = business?.NegocioTipoPS === 'P' ? 'puntos' : 'sellos';

    const defaultMessage = `Hola ${client.UsuarioNombre}, este es un mensaje de ${business.NegocioDesc}. Solo par recordarte que tu saldo actual es: ${accountData?.puntosDisponibles || '0'} ${tipoPrograma}.`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
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

          <div>
            {client.UsuarioTelefono && (
              <button
                onClick={sendWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                </svg>
                Enviar WhatsApp
              </button>
            )}
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
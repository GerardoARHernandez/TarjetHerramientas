// src/apps/admin-puntos/views/Points.jsx
import { usePoints } from '../../../contexts/PointsContext';

export const Points = () => {
  const { transactions, clients } = usePoints();

  // Combinar datos de clientes con sus transacciones
  const clientsWithTransactions = clients.map(client => {
    const clientTransactions = transactions.filter(t => t.clientId === client.id);
    const totalAmount = clientTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPoints = clientTransactions.reduce((sum, t) => sum + t.points, 0);
    
    return {
      ...client,
      transactions: clientTransactions,
      totalAmount,
      totalPoints,
      lastPurchase: clientTransactions[0]?.date || 'Sin compras'
    };
  });

  // Ordenar clientes por puntos (mayor a menor)
  const sortedClients = [...clientsWithTransactions].sort((a, b) => b.totalPoints - a.totalPoints);

  // Estadísticas generales
  const totalClients = clients.length;
  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Resumen general */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Clientes Registrados</h3>
          <p className="text-4xl font-bold">{totalClients}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Total en Ventas</h3>
          <p className="text-4xl font-bold">
            ${totalSales.toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Puntos Otorgados</h3>
          <p className="text-4xl font-bold">
            {totalPoints.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Listado de clientes con sus puntos */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Clientes y Puntos Acumulados</h3>
          <span className="text-sm text-gray-500">
            {sortedClients.length} {sortedClients.length === 1 ? 'cliente' : 'clientes'}
          </span>
        </div>
        
        {sortedClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-xl">No hay clientes registrados</p>
            <p className="mt-2">Registra clientes para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Compra
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {client.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${client.totalAmount.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        client.totalPoints > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.totalPoints.toLocaleString()} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.lastPurchase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Historial detallado de transacciones */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Transacciones</h3>
          <span className="text-sm text-gray-500">
            {transactions.length} {transactions.length === 1 ? 'transacción' : 'transacciones'}
          </span>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-xl">No hay transacciones registradas</p>
            <p className="mt-2">Registra compras para ver el historial</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {transaction.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {transaction.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${transaction.amount.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {transaction.points} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
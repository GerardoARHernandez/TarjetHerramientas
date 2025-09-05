// src/apps/points/views/AdminPoints.jsx
import { usePoints } from '../../../../contexts/PointsContext';

const AdminPoints = () => {
  const { transactions, clients } = usePoints();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen de estadísticas */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Clientes Registrados</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Transacciones</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
          </div>
        </div>

        {/* Últimas transacciones */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Últimas Transacciones</h2>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="border-b pb-3 last:border-b-0">
                <p className="font-semibold">{transaction.clientName}</p>
                <p className="text-sm text-gray-600">${transaction.amount} - {transaction.date}</p>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-gray-500">No hay transacciones registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPoints;
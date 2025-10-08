// src/apps/points/components/admin/RegisterPurchase/BusinessStats.jsx
import { Users, TrendingUp, Coins, Stamp } from 'lucide-react';

const BusinessStats = ({ clients = [], businessType, business }) => {
  // Asegurarnos de que clients siempre sea un array
  const safeClients = Array.isArray(clients) ? clients : [];
  
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Clientes Registrados</p>
            <p className="text-xl font-bold text-gray-900">{safeClients.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Sistema Activo</p>
            <p className="text-xl font-bold text-gray-900">
              {businessType === 'P' ? 'Puntos' : 'Sellos'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            businessType === 'P' ? 'bg-orange-100' : 'bg-purple-100'
          }`}>
            {businessType === 'P' ? 
              <Coins className="w-5 h-5 text-orange-600" /> : 
              <Stamp className="w-5 h-5 text-purple-600" />
            }
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Negocio</p>
            <p className="text-xl font-bold text-gray-900">
              {business?.NegocioDesc || 'No especificado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessStats;
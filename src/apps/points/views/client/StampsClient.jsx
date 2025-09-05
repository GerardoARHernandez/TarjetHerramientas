
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import ClientHeader from '../../components/ClientHeader';

const Stamps = () => {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const navigate = useNavigate();

  // Datos simulados
  const stamps = Array(6).fill(true).concat(Array(4).fill(false));
  const rewards = [
    { id: 1, name: '1 Hamburguesa Sencilla', stamps: 6, available: true, expiry: '24/12/2025' },
    { id: 2, name: 'Papas Fritas', stamps: 2, available: false, expiry: '24/12/2025' }
  ];

  const history = [
    { date: '14/02/2025', action: '+ 1 Sello' },
    { date: '14/02/2025', action: '+ 1 Sello' },
    { date: '14/03/2025', action: '+ 1 Sello' },
    { date: '14/03/2025', action: '+ 1 Sello' },
    { date: '14/03/2025', action: '- 1 Hamburguesa' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader title="Recompensas" userName={userName} />
      
      <div className="p-4 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold">
            Sellos
          </button>
          <button
            onClick={() => navigate('/client/points')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
          >
            Puntos
          </button>
        </div>

        {/* Stamps Grid */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Canjear mis Sellos</h3>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {stamps.map((filled, index) => (
              <div
                key={index}
                className={`aspect-square rounded-full border-2 flex items-center justify-center
                  ${filled 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'border-gray-300 bg-gray-50'
                  }`}
              >
                {filled && <Star className="w-6 h-6 fill-current" />}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            Solo se enciende cuando alcanza los sellos mínimos para un canje
          </p>
        </div>

        {/* Rewards */}
        <div className="space-y-3">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{reward.stamps} Sellos para {reward.name}</h4>
                <button
                  disabled={!reward.available}
                  className={`px-4 py-2 rounded-lg font-medium text-sm
                    ${reward.available 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Canjear
                </button>
              </div>
              <p className="text-xs text-gray-500">Vigencia: {reward.expiry}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            HISTORIAL DE SELLOS Y RECOMPENSAS
          </h3>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.date}</span>
                <span className={`text-sm font-medium ${
                  item.action.includes('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stamps;
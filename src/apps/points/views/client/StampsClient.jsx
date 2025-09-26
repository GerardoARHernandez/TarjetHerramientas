import { useNavigate } from 'react-router-dom';
import { Star, Clock, Gift, Coins, Award } from 'lucide-react';

const Stamps = () => {
  // const userName = localStorage.getItem('userName') || 'Usuario';
  const navigate = useNavigate();

  // Datos simulados
  const stamps = Array(8).fill(true).concat(Array(2).fill(false));
  const completedStamps = stamps.filter(Boolean).length;
  const totalStamps = stamps.length;
  
  const rewards = [
    { id: 1, name: '1 Hamburguesa Sencilla', stamps: 10, available: false, expiry: '24/12/2025' },
    { id: 2, name: 'Papas Fritas', stamps: 5, available: true, expiry: '24/12/2025' }
  ];

  const history = [
    { date: '14/02/2025', action: '+ 1 Sello', type: 'gain' },
    { date: '14/02/2025', action: '+ 1 Sello', type: 'gain' },
    { date: '14/03/2025', action: '+ 1 Sello', type: 'gain' },
    { date: '14/03/2025', action: '+ 1 Sello', type: 'gain' },
    { date: '14/03/2025', action: '- 1 Hamburguesa', type: 'redeem' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Navigation */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Sellos
                </button>
                <button
                  onClick={() => navigate('/client/points')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  Puntos
                </button>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-orange-500" />
                  Mi Progreso de Sellos
                </h3>
                <div className="bg-orange-100 rounded-2xl p-4 mb-4">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {completedStamps}/{totalStamps}
                  </div>
                  <div className="text-gray-600">Sellos completados</div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedStamps / totalStamps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Stamps Grid */}
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Mis Sellos</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-6">
                {stamps.map((filled, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-full border-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105
                      ${filled 
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-500 text-white shadow-lg' 
                        : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                      }`}
                  >
                    {filled && <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />}
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 border border-amber-200">
                <p>¡Obtén más sellos comprando en nuestro establecimiento!</p>
              </div>
            </div>

            {/* Rewards */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Gift className="w-6 h-6 text-orange-500" />
                Recompensas Disponibles
              </h3>
              
              {rewards.map(reward => (
                <div key={reward.id} className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-orange-100 rounded-full p-2">
                          <Star className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">{reward.name}</h4>
                          <p className="text-orange-600 font-semibold">{reward.stamps} sellos requeridos</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Vigencia: {reward.expiry}</p>
                    </div>
                    
                    <button
                      disabled={!reward.available}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200
                        ${reward.available 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      {reward.available ? 'Canjear' : 'No Disponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Historial */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-shadow-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center py-3 px-4 rounded-xl border transition-colors duration-200
                      ${item.type === 'gain' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                      }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-700">{item.date}</span>
                      <p className="text-xs text-gray-500">
                        {item.type === 'gain' ? 'Sello obtenido' : 'Recompensa'}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${
                      item.type === 'gain' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors duration-200">
                  Ver historial completo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stamps;
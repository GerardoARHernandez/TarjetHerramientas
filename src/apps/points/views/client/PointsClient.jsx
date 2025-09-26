import { useNavigate } from 'react-router-dom';
import { Clock, Coins, TrendingUp, Gift } from 'lucide-react';

const PointsClient = () => {
  // const userName = localStorage.getItem('userName') || 'Usuario';
  const navigate = useNavigate();

  const currentPoints = 120;
  const exchangeRate = 100; // 100 puntos = 10 pesos

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal - Puntos */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Navigation */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-orange-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/points-loyalty/stamps')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Sellos
                </button>
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2">
                  <Coins className="w-4 h-4" />
                  Puntos
                </button>
              </div>
            </div>

            {/* Points Display */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  MIS PUNTOS OBTENIDOS
                </h3>
                <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white rounded-3xl p-10 mb-6 shadow-xl">
                  <div className="text-6xl font-bold mb-3">{currentPoints}</div>
                  <div className="text-xl opacity-90">Puntos disponibles</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 inline-block">
                  <p className="text-sm text-orange-700 font-medium">
                    {exchangeRate} Puntos = ${exchangeRate * 0.1} pesos
                  </p>
                </div>
              </div>
            </div>

            {/* Exchange Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Coins className="w-6 h-6 text-orange-500" />
                Canjear mis Puntos
              </h3>
              
              <div className="space-y-6">
                <div className="border-2 border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800">Canje de {exchangeRate} puntos</span>
                    <span className="text-orange-600 font-bold text-xl">${exchangeRate}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Solo se activa cuando alcances los puntos mínimos para un canje
                  </p>
                  <button
                    disabled={currentPoints < exchangeRate}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200
                      ${currentPoints >= exchangeRate 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {currentPoints >= exchangeRate ? 'Canjear Puntos' : 'Puntos Insuficientes'}
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 border border-amber-200">
                <p className="mb-2">📋 <strong>Proceso de canje:</strong></p>
                <p className="mb-2">• Se envía el status de canje a la interfaz del negocio para aprobación</p>
                <p>• Recibirás una notificación una vez confirmado el canje</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Historial */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                Historial de Puntos
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <span className="text-sm text-gray-600">15/08/2025</span>
                    <p className="text-xs text-gray-500">Compra realizada</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">+20 Puntos</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <span className="text-sm text-gray-600">14/08/2025</span>
                    <p className="text-xs text-gray-500">Compra realizada</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">+15 Puntos</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-xl border border-red-200">
                  <div>
                    <span className="text-sm text-gray-600">10/08/2025</span>
                    <p className="text-xs text-gray-500">Canje realizado</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">-10 Puntos</span>
                </div>
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

export default PointsClient;
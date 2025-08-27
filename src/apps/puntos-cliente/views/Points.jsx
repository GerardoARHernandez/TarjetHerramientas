
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Header from '../components/Header';

const Points = () => {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const navigate = useNavigate();

  const currentPoints = 120;
  const exchangeRate = 100; // 100 puntos = 100 pesos

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Recompensas" userName={userName} />
      
      <div className="p-4 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/client/stamps')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
          >
            Sellos
          </button>
          <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold">
            Puntos
          </button>
        </div>

        {/* Points Display */}
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <h3 className="text-lg font-bold mb-4">MIS PUNTOS OBTENIDOS</h3>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-8 mb-4">
            <div className="text-6xl font-bold mb-2">{currentPoints}</div>
            <div className="text-lg opacity-90">Puntos disponibles</div>
          </div>
          <p className="text-sm text-gray-600">
            {exchangeRate} Puntos = {exchangeRate} pesos
          </p>
        </div>

        {/* Exchange Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Canjear mis Puntos</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Canje de {exchangeRate} puntos</span>
                <span className="text-red-600 font-bold">${exchangeRate}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Solo se enciende cuando alcanza los puntos mínimos para un canje
              </p>
              <button
                disabled={currentPoints < exchangeRate}
                className={`w-full py-3 rounded-lg font-semibold
                  ${currentPoints >= exchangeRate 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {currentPoints >= exchangeRate ? 'Canjear Puntos' : 'Puntos Insuficientes'}
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>Se envía el Status de Canje a la interfaz del Negocio para que sea aceptado por el mismo, una vez aceptado se logra el Match Cliente-Negocio</p>
            <p className="mt-2">Se envía notificación al cliente de que ha canjeado sus puntos</p>
          </div>
        </div>

        {/* Points History */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            HISTORIAL DE PUNTOS
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">15/03/2025</span>
              <span className="text-sm font-medium text-green-600">+20 Puntos</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">14/03/2025</span>
              <span className="text-sm font-medium text-green-600">+15 Puntos</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">10/03/2025</span>
              <span className="text-sm font-medium text-red-600">-100 Puntos (Canje)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;
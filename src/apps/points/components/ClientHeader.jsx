// src/apps/points/components/ClientHeader.jsx
import { useNavigate } from 'react-router-dom';
import { Gift, Store } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ClientHeader = ({ title, userName, businessName, color1, color2 }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  console.log('ClientHeader colors:', { color1, color2 }); // Debug

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    logout();
    navigate('/points-loyalty/login');
  };

  return (
    <div 
    className="text-white"
    style={{
      backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`,
    }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header con logout y nombre del negocio */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{title}</h1>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium">Mi Tarjeta de Fidelidad</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
          >
            Salir
          </button>
        </div>
       
        {/* Contenedor principal responsive */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Imagen de la tarjeta - Izquierda en desktop */}
          <div className="w-full lg:w-1/2 max-w-md lg:max-w-none transform transition-transform duration-300 hover:scale-105">
            <div className="rounded-2xl overflow-hidden border-4 border-white/40 shadow-2xl">
              <img 
                src="/images/header-client.jpeg" 
                alt="Tarjeta de fidelidad"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Tarjeta de información del usuario - Derecha en desktop */}
          <div className="w-full lg:w-1/2 max-w-md lg:max-w-none lg:mt-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                {/* Información del usuario */}
                <div className="space-y-3 w-full">
                  <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                    {userName}
                  </h2>
                  
                  {businessName && (
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <Store className="w-4 h-4" />
                      <span className="font-medium text-sm">{businessName}</span>
                    </div>
                  )}
                </div>
              </div>              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
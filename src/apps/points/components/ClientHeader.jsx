// src/apps/points/components/ClientHeader.jsx
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ClientHeader = ({ title, userName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Limpiar localStorage para cliente
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
   
    // Si estaba autenticado en el contexto también, cerrar sesión
    logout();
   
    navigate('/points-loyalty/login');
  };

  return (
    <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header con logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
          >
            Salir
          </button>
        </div>
       
        {/* User Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm opacity-90 font-medium tracking-wide uppercase">Mi Tarjeta de Sellos</p>
              <p className="font-bold text-xl sm:text-2xl">{userName}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Gift className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
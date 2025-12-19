// src/apps/points/components/ClientFooter.jsx
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ClientFooter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    logout();
    navigate('/points-loyalty/login');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white shadow-xl mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Texto principal */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tarjet Recompensas
              </h3>
              <p className="text-gray-300">
                Transformando la experiencia de fidelización
              </p>
            </div>

            {/* Información de derechos y botón de cerrar sesión */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="font-semibold">
                  © {currentYear} Todos los derechos reservados
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  • Sistema de fidelización
                </p>
              </div>
              
              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-5 py-2.5 rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
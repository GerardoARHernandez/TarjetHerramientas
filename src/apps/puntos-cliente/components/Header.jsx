
import { useNavigate } from 'react-router-dom';
import { Gift} from 'lucide-react';

const Header = ({ title, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-800 px-3 py-1 rounded hover:bg-red-900"
        >
          Salir
        </button>
      </div>
      
      {/* User Card */}
      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">MIS TARJETA DE SELLOS</p>
            <p className="font-bold text-lg">{userName}</p>
          </div>
          <Gift className="w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default Header;
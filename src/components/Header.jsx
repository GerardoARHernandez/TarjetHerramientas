import { NavLink } from "react-router-dom";

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Puntos</h1>
          </div>
          
          <nav className="flex space-x-8 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              Historial
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              Registrar Compra
            </NavLink>

            <a
              href='https://www.tarjet.site/directorio-tarjet'
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              Directorio Tarjet
            </a>
          </nav>
          
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
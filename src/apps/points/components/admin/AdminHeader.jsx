// src/apps/admin-puntos/components/admin/AdminHeader.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <header className="bg-gray-100 shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo y botón móvil */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-green-950">Tarjet Recompensas</h1>
            </div>
            
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Navegación para desktop */}
          <nav className="hidden md:flex space-x-2 lg:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              Historial
            </NavLink>

            <NavLink
              to="/points-loyalty/registrar-compra"
              className={({ isActive }) =>
                `px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              Registrar Compra
            </NavLink>

            <NavLink
              to="/points-loyalty/crear-promocion"
              className={({ isActive }) =>
                `px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              Crear Promoción
            </NavLink>

            <a
              href='https://www.tarjet.site/directorio-tarjet'
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              Directorio
            </a>
          </nav>

          {/* Botón de logout para desktop */}
          <button
            onClick={logout}
            className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="mb-3 px-4 py-2 text-sm text-gray-600 border-b">
              Hola, {user?.name}
            </div>
            
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
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
                to="/points-loyalty/registrar-compra"
                onClick={() => setIsMenuOpen(false)}
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

              <NavLink
                to="/points-loyalty/crear-promocion"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`
                }
              >
                Crear Promoción
              </NavLink>

              <a
                href='https://www.tarjet.site/directorio-tarjet'
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                Directorio Tarjet
              </a>
            </nav>

            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
                window.location.href = "/points-loyalty/login";
              }}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:cursor-pointer"
            >
              Cerrar Sesión
            </button>
            
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
// src/apps/admin-puntos/components/admin/AdminHeader.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { 
  Home, 
  ShoppingCart, 
  Gift, 
  Ticket, 
  UserPlus, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const navigationItems = [
    {
      path: "/",
      label: "Inicio",
      icon: Home
    },
    {
      path: "/points-loyalty/registrar-compra",
      label: "Registrar Compra",
      icon: ShoppingCart
    },
    {
      path: "/points-loyalty/crear-promocion",
      label: "Crear Promoción",
      icon: Gift
    },
    {
      path: "/points-loyalty/canjear",
      label: "Canjear Promoción",
      icon: Ticket
    },
    {
      path: "/points-loyalty/registro-cliente",
      label: "Registrar Cliente",
      icon: UserPlus
    }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y marca */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-xl shadow-lg">
                <Link to="/points-loyalty/registrar-compra"><Gift className="h-6 w-6" /></Link>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Tarjet Recompensas
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Panel de Administración
              </p>
            </div>
          </div>

          {/* Navegación para desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Botones de acción desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Hola, {user?.name}</p>
              <p className="text-xs text-gray-500">Bienvenido</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md hover:cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>

          {/* Botón hamburguesa para móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pt-4 pb-6">
            {/* Información del usuario */}
            <div className="px-4 py-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900">Hola, {user?.name}</p>
              <p className="text-xs text-gray-500">Panel de Administración</p>
            </div>
            
            {/* Navegación móvil */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Botón de logout móvil */}
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="mt-4 w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium hover:cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}

        {/* Navegación intermedia para tablets */}
        <nav className="hidden md:flex lg:hidden items-center justify-center space-x-1 pt-2 pb-4">
          {navigationItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="text-center leading-tight">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700 rounded-md' : '';
  };

  return (
    <>
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link 
              to="/digital-menus" 
              className="text-xl font-bold flex items-center"
            >
              <FiHome className="mr-2" />
              Mi Restaurante
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/digital-menus/admin" 
                className={`flex items-center px-4 py-2 hover:bg-blue-700 rounded-md transition-colors ${isActive('/digital-menus/admin')}`}
              >
                <FiSettings className="mr-2" />
                Administrar
              </Link>
              <Link 
                to="/digital-menus/menu" 
                className={`flex items-center px-4 py-2 hover:bg-blue-700 rounded-md transition-colors ${isActive('/digital-menus/menu')}`}
              >
                <FiMenu className="mr-2" />
                Ver Menú
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/digital-menus/admin" 
                  className={`flex items-center px-4 py-2 hover:bg-blue-700 rounded-md transition-colors ${isActive('/digital-menus/admin')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiSettings className="mr-2" />
                  Administrar
                </Link>
                <Link 
                  to="/digital-menus/menu" 
                  className={`flex items-center px-4 py-2 hover:bg-blue-700 rounded-md transition-colors ${isActive('/digital-menus/menu')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiMenu className="mr-2" />
                  Ver Menú
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
// src/components/ClientHeader.jsx
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import ProfileSettings from "./ProfileSettings";
import { useTheme } from "../context/ThemeContext";

const ClientHeader = ({ esTitular = true, color1 = "#4f46e5", color2 = "#7c3aed", userData }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [userInitials, setUserInitials] = useState("U");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Actualizar iniciales cuando cambia userData
  useEffect(() => {
    if (userData) {
      const initials = `${userData.usuarioNombre?.[0] || ''}${userData.usuarioApellido?.[0] || ''}`.toUpperCase();
      setUserInitials(initials || "U");
    }
  }, [userData]);

  const handleLogout = () => {
    // Limpiar todo el localStorage y sessionStorage
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("business");
    sessionStorage.removeItem("user");
    
    // Redirigir al login
    navigate("/digitalwallet/login");
  };

  const handleMisDatos = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(true);
  };

  const getHeaderStyles = () => {
    if (isDark) {
      return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      };
    }
    return {
      background: `linear-gradient(135deg, ${color1}, ${color2})`,
    };
  };

  return (
    <>
      <header 
        className="text-white shadow-md transition-all duration-300"
        style={getHeaderStyles()}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/digitalwallet/client" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="font-bold text-sm" style={{ color: isDark ? '#9ca3af' : color1 }}>
                M
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Monedero</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/digitalwallet/client" className="hover:text-white/80 transition-colors text-white">Inicio</Link>
            {esTitular && (
              <Link to="/digitalwallet/client/historial" className="hover:text-white/80 transition-colors text-white">Historial</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Menú de usuario */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white/30 hover:opacity-80 transition-opacity hover:cursor-pointer bg-white/10 hover:bg-white/20"
                style={{ backgroundColor: isDark ? '#374151' : `${color1}80` }}
                aria-label="Menú de usuario"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Menú desplegable */}
              {isMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {userData?.usuarioNombre} {userData?.usuarioApellido}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {userData?.usuarioTelefono}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleMisDatos}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mis Datos
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                      isDark 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-red-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Modal de configuración de perfil */}
      {isProfileOpen && (
        <ProfileSettings
          userData={userData}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default ClientHeader;
// src/components/ClientHeader.jsx - Versión completa con datos del usuario
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const ClientHeader = ({ esTitular = true, color1 = "#4f46e5", color2 = "#7c3aed" }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const initials = `${user.usuarioNombre?.[0] || ''}${user.usuarioApellido?.[0] || ''}`.toUpperCase();
      setUserInitials(initials || "U");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/digitalwallet/login");
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
          <Link to="/digitalwallet/client/terminos" className="hover:text-white/80 transition-colors text-white">Términos</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white/30"
            style={{ backgroundColor: isDark ? '#374151' : `${color1}80` }}
          >
            {userInitials}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
// src/components/ClientHeader.jsx 
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const ClientHeader = ({ esTitular = true, color1 = "#4f46e5", color2 = "#7c3aed" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header 
      className="text-white shadow-md transition-colors duration-300"
      style={{ 
        background: `linear-gradient(135deg, ${color1}, ${color2})` 
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/client" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span 
              className="font-bold text-sm"
              style={{ color: color1 }}
            >
              M
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Monedero</span>
        </Link>

        {/* Nav - Ocultar historial si no es titular */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/client" className="hover:text-white/80 transition-colors text-white">Inicio</Link>
          {esTitular && (
            <Link to="/client/historial" className="hover:text-white/80 transition-colors text-white">Historial</Link>
          )}
        </nav>

        {/* User y ThemeToggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white/30"
            style={{ backgroundColor: `${color1}80` }}
          >
            GA
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
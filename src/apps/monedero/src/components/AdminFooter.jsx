// src/components/AdminFooter.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AdminFooter = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-indigo-800 border-indigo-600'} border-t py-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 text-center text-sm">
        <p className={`${isDark ? 'text-gray-400' : 'text-indigo-200'}`}>
          © {new Date().getFullYear()} Monedero - TekRobot. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
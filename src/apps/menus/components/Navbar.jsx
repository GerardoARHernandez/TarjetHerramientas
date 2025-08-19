// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/digital-menus" className="text-xl font-bold">Mi Restaurante</Link>
        <div className="space-x-4">
          <Link to="/digital-menus/admin" className="hover:underline">Administrar</Link>
          <Link to="/digital-menus/menu" className="hover:underline">Ver Menú</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
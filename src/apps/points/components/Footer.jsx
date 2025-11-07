// src/apps/admin-puntos/components/Footer.jsx
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-500 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          
        {/* Línea divisoria */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-950 text-sm font-semibold">
              © {currentYear} Tarjet Recompensas. Todos los derechos reservados.
            </p>            
        </div>
      </div>
    </footer>
  );
};

export default Footer;
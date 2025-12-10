// src/apps/admin-puntos/components/Footer.jsx
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white shadow-xl mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido con efecto de gradiente */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Texto principal */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tarjet Recompensas
                </h3>
                <p className="text-gray-300">
                  Transformando la experiencia de fidelización
                </p>
              </div>

              {/* Información de derechos */}
                <p className="font-semibold text-center">
                  © {currentYear} Todos los derechos reservados
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  • Sistema de fidelización
                </p>
            </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
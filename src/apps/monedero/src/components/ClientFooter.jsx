// src/components/ClientFooter.jsx 
const ClientFooter = () => {
  return (
    <footer className="bg-indigo-900 dark:bg-indigo-950 text-indigo-300 dark:text-indigo-400 text-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Monedero - TekRobot. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
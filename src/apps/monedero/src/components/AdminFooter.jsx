// src/components/AdminFooter.jsx 
const AdminFooter = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 dark:text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Monedero - TekRobot. Todos los derechos reservados.</p>
        <p className="text-xs text-gray-500 dark:text-gray-600">v1.0.0· - TekRobot </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
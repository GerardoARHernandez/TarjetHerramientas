// src/components/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme, autoMode } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  // Mostrar tooltip temporalmente al pasar el mouse
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Botón de tema único */}
      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={autoMode ? "Cambiar tema manualmente (modo automático se desactivará temporalmente)" : "Cambiar tema"}
      >
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Tooltip flotante que muestra el estado actual */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap z-50 shadow-lg">
          {autoMode ? (
            <>
              <span className="inline-block mr-1">🕐</span>
              Modo auto: {new Date().getHours() < 8 || new Date().getHours() >= 18 ? '🌙 Modo oscuro' : '☀️ Modo claro'}
              <br />
              <span className="text-gray-300 text-[10px]">Click para cambiar temporalmente</span>
            </>
          ) : (
            <>
              <span className="inline-block mr-1">✋</span>
              Modo manual: {isDark ? '🌙 Modo oscuro' : '☀️ Modo claro'}
              <br />
              <span className="text-gray-300 text-[10px]">Se sincronizará automáticamente al cambiar de hora</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Estado inicial basado en la clase actual del html
  const [isDark, setIsDark] = useState(() => {
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('theme');
    
    console.log('ThemeProvider inicializando - hasDarkClass:', hasDarkClass, 'savedTheme:', savedTheme);
    
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return hasDarkClass || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Función para actualizar el html y localStorage
  const updateTheme = useCallback((dark) => {
    const root = document.documentElement;
    
    if (dark) {
      root.classList.add('dark');
      console.log('✅ Clase dark AGREGADA al html');
    } else {
      root.classList.remove('dark');
      console.log('✅ Clase dark REMOVIDA del html');
    }
    
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    console.log('html tiene dark?', root.classList.contains('dark'));
  }, []);

  // Sincronizar cuando isDark cambia
  useEffect(() => {
    updateTheme(isDark);
  }, [isDark, updateTheme]);

  // Verificar y sincronizar en intervalos (por si algo externo cambia la clase)
  useEffect(() => {
    const checkAndSync = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      if (hasDarkClass !== isDark) {
        console.log('⚠️ Detectada inconsistencia - sincronizando:', hasDarkClass, 'vs', isDark);
        // Sincronizar el estado con la clase actual
        setIsDark(hasDarkClass);
      }
    };
    
    // Verificar cada segundo para detectar cambios externos
    const interval = setInterval(checkAndSync, 1000);
    
    // También verificar cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAndSync();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    console.log('toggleTheme llamado, cambiando de:', isDark, 'a:', !isDark);
    setIsDark(prev => !prev);
  }, [isDark]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo cambiar si no hay una preferencia guardada manualmente
      if (!localStorage.getItem('theme')) {
        console.log('Preferencia del sistema cambiada a:', e.matches ? 'dark' : 'light');
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
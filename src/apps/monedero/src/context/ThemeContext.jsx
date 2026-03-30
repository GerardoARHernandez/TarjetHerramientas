// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const manualTimeoutRef = useRef(null);

  // Función para determinar si debe ser dark según la hora
  const shouldBeDark = (hour) => {
    return hour < 8 || hour >= 18;
  };

  // Reiniciar el modo automático después de un tiempo si está en manual
  const resetToAutoMode = () => {
    if (!autoMode) {
      // Limpiar timeout anterior
      if (manualTimeoutRef.current) {
        clearTimeout(manualTimeoutRef.current);
      }
      
      // Establecer nuevo timeout para volver a modo automático después de 5 minutos
      manualTimeoutRef.current = setTimeout(() => {
        setAutoMode(true);
        setIsDark(shouldBeDark(new Date().getHours()));
        manualTimeoutRef.current = null;
      }, 5 * 60 * 1000); // 5 minutos
    }
  };

  // Actualizar la hora cada minuto para cambios automáticos
  useEffect(() => {
    const updateHour = () => {
      const newHour = new Date().getHours();
      setCurrentHour(newHour);
      
      if (autoMode) {
        const newIsDark = shouldBeDark(newHour);
        // Solo actualizar si cambió el estado para evitar re-renders innecesarios
        if (newIsDark !== isDark) {
          setIsDark(newIsDark);
        }
      }
    };
    
    // Actualizar inmediatamente
    updateHour();
    
    // Actualizar cada minuto para detectar cambios de hora
    const interval = setInterval(updateHour, 60000);
    
    return () => {
      clearInterval(interval);
      if (manualTimeoutRef.current) {
        clearTimeout(manualTimeoutRef.current);
      }
    };
  }, [autoMode, isDark]);

  // Cargar preferencias guardadas al inicio
  useEffect(() => {
    const savedAutoMode = localStorage.getItem('themeAutoMode');
    const savedTheme = localStorage.getItem('theme');
    
    // Si hay preferencia guardada de modo automático, usarla
    if (savedAutoMode !== null) {
      setAutoMode(savedAutoMode === 'true');
    }
    
    // Si estamos en modo manual y hay un tema guardado
    if (savedAutoMode === 'false' && savedTheme) {
      setIsDark(savedTheme === 'dark');
    } 
    // Si estamos en modo automático o no hay preferencias guardadas
    else {
      const hour = new Date().getHours();
      setIsDark(shouldBeDark(hour));
    }
  }, []);

  // Guardar preferencias cuando cambian
  useEffect(() => {
    localStorage.setItem('themeAutoMode', autoMode);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Aplicar clase al html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, autoMode]);

  // Función para cambiar el tema manualmente
  const toggleTheme = () => {
    // Si estaba en automático, cambiar a modo manual temporal
    if (autoMode) {
      setAutoMode(false);
    }
    setIsDark(prev => !prev);
    // Programar vuelta al modo automático después de 5 minutos
    resetToAutoMode();
  };

  // Función para activar/desactivar el modo automático (mantenida para compatibilidad)
  const setAutoTheme = (enabled) => {
    setAutoMode(enabled);
    if (enabled) {
      // Al activar automático, aplicar el tema según la hora actual
      if (manualTimeoutRef.current) {
        clearTimeout(manualTimeoutRef.current);
        manualTimeoutRef.current = null;
      }
      setIsDark(shouldBeDark(currentHour));
    }
  };

  // Función para obtener el estado actual del modo
  const getThemeMode = () => {
    return autoMode ? 'auto' : 'manual';
  };

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      autoMode, 
      setAutoTheme,
      getThemeMode,
      currentHour
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
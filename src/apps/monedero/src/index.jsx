// src/apps/monedero/src/index.jsx
import DigitalWalletRoutes from "./routes";
import { ThemeProvider } from './context/ThemeContext';
import { BusinessProvider } from './context/BusinessContext';

// Exporta un componente que envuelve las rutas con los providers
export const DigitalWalletApp = () => {
  
  return (
    <BusinessProvider>
      <ThemeProvider>
        <DigitalWalletRoutes />
      </ThemeProvider>
    </BusinessProvider>
  );
};
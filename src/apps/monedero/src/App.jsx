// src/apps/monedero/src/App.jsx

import DigitalWalletRoutes from "./routes";
import { ThemeProvider } from './context/ThemeContext';
import { BusinessProvider } from './context/BusinessContext';

function App() {
  return (
      <BusinessProvider>
        <ThemeProvider>
          <DigitalWalletRoutes />        
        </ThemeProvider>
      </BusinessProvider>
  );
}

export default App;
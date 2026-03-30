// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { PointsProvider } from './contexts/PointsContext';
import { DigitalWalletApp } from './apps/monedero/src/index';
import PointsRoutes from './apps/points/routes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/points-loyalty" replace />} />
        
        <Route 
          path="/points-loyalty/*" 
          element={
            <AuthProvider>
              <BusinessProvider>
                <PointsProvider>
                  <PointsRoutes />
                </PointsProvider>
              </BusinessProvider>
            </AuthProvider>
          } 
        />
      
        {/* DigitalWalletApp ya tiene su propio ThemeProvider */}
        <Route 
          path='/digitalwallet/*' 
          element={<DigitalWalletApp />} 
        />

        <Route 
          path="*" 
          element={<Navigate to="/points-loyalty" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
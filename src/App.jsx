// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { PointsProvider } from './contexts/PointsContext';

import DigitalMenusRoutes from './apps/menus/routes';
import PointsRoutes from './apps/points/routes';

const App = () => {
  return (
    <AuthProvider>
      <BusinessProvider>
        <PointsProvider>
          <Router>
            <div className="min-h-screen bg-blue-100">
              <Routes>
                <Route index element={<Navigate to="/points-loyalty" replace />} />
                
                {/* Página 1: Administración de Puntos */}
                <Route 
                  path='/points-loyalty/*' 
                  element={<PointsRoutes />} 
                />

                {/* Página 2: Menús Digitales (para implementar después) */}
                <Route 
                  path='/digital-menus/*' 
                  element={<DigitalMenusRoutes />} 
                />

                {/* Ruta por defecto para URLs no encontradas */}
                <Route 
                  path="*" 
                  element={<Navigate to="/points-loyalty" replace />} 
                />
              </Routes>
            </div>
          </Router>
        </PointsProvider>
      </BusinessProvider>
    </AuthProvider>
  );
};

export default App;
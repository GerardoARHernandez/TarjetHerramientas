// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PointsProvider } from './contexts/PointsContext';
import AdminPointsRoutes from './apps/admin-puntos/routes';

import DigitalMenusRoutes from './apps/menus/routes';
import ClientPointsRoutes from './apps/puntos-cliente/routes';

const App = () => {
  return (
    <AuthProvider>
      <PointsProvider>
        <Router>
          <div className="min-h-screen bg-blue-100">
            <Routes>
              <Route index element={<Navigate to="/client" replace />} />
              
              {/* Página 1: Admin de Puntos */}
              <Route 
                path='/points-admin/*' 
                element={<AdminPointsRoutes />} 
              />

              {/* Página 2: Menús Digitales (para implementar después) */}
              <Route 
                path='/digital-menus/*' 
                element={<DigitalMenusRoutes />} 
              />

              <Route 
                path='/client/*' 
                element={<ClientPointsRoutes />} 
              />

              {/* Ruta por defecto para URLs no encontradas */}
              <Route 
                path="*" 
                element={<Navigate to="/client" replace />} 
              />
            </Routes>
          </div>
        </Router>
      </PointsProvider>
    </AuthProvider>
  );
};

export default App;
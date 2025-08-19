// src/apps/admin-puntos/routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { Login } from './views/Login';
import { Points } from './views/Points';
import { RegisterPurchase } from './views/RegisterPurchase';
import { RegisterClient } from './views/RegisterClient';
import Header from './components/Header';

const AdminPointsRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { transactions, clients } = usePoints();

  return (
    <div className="min-h-screen bg-blue-100">
      {isAuthenticated && <Header />}
      
      <Routes>
        <Route 
          index 
          element={
            isAuthenticated ? (
              <Points />
            ) : (
              <Navigate to="/points-admin/login" replace /> 
            )
          } 
        />
        
        <Route 
          path="login" 
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/points-admin" replace />
            )
          } 
        />
        
        <Route 
          path="registrar-cliente" 
          element={
            isAuthenticated ? (
              <RegisterClient />
            ) : (
              <Navigate to="/points-admin/login" replace />
            )
          } 
        />
        
        <Route 
          path="registrar-compra" 
          element={
            isAuthenticated ? (
              <RegisterPurchase />
            ) : (
              <Navigate to="/points-admin/login" replace />
            )
          } 
        />
        
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/points-admin" : "/points-admin/login"} replace /> 
          } 
        />
      </Routes>
    </div>
  );
};

export default AdminPointsRoutes;
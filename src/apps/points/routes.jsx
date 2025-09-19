// src/apps/points-loyalty/routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';

import Login from './views/Login';
import RegisterClient from './views/RegisterClient';
import AdminPoints from './views/admin/AdminPoints';
import {RegisterPurchase} from './views/admin/RegisterPurchase';
import Stamps from './views/client/StampsClient';
import PointsClient from './views/client/PointsClient';
import AdminHeader from './components/AdminHeader';
import ClientHeader from './components/ClientHeader';

const PointsRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const { clients } = usePoints();
  
  // Determinar si el usuario es admin basado en el rol
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Mostrar header según el tipo de usuario */}
      {isAuthenticated && isAdmin && <AdminHeader />}
      {isAuthenticated && user?.role === 'client' && (
        <ClientHeader title="MIS PUNTOS" userName={user.name} />
      )}
      
      <Routes>
        {/* Ruta principal - redirige según el tipo de usuario */}
        <Route 
          index 
          element={
            isAuthenticated ? (
              isAdmin ? <AdminPoints /> : <PointsClient />
            ) : (
              <Navigate to="/points-loyalty/login" replace /> 
            )
          } 
        />
        
        {/* Login unificado */}
        <Route 
          path="login" 
          element={
            !isAuthenticated ? (
              <Login />
            ) : isAdmin ? (
              <Navigate to="/points-loyalty" replace />
            ) : (
              <Navigate to="/points-loyalty/points" replace />
            )
          } 
        />
        
        {/* Resto de rutas... */}
        <Route 
          path="registrar/:negocioId" 
          element={
            !isAuthenticated ? (
              <RegisterClient />
            ) : (
              <Navigate to="/points-loyalty" replace />
            )
          } 
        />
        
        <Route 
          path="/registrar-compra" 
          element={
            isAuthenticated && isAdmin ? (
              <RegisterPurchase />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        <Route 
          path="stamps" 
          element={
            isAuthenticated && !isAdmin ? (
              <Stamps />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        <Route 
          path="points" 
          element={
            isAuthenticated && !isAdmin ? (
              <PointsClient />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        {/* Ruta comodín */}
        <Route 
          path="*" 
          element={
            <Navigate to={
              isAuthenticated && isAdmin ? "/points-loyalty" : 
              isAuthenticated ? "/points-loyalty/points" : 
              "/points-loyalty/login"
            } replace /> 
          } 
        />
      </Routes>
    </div>
  );
};

export default PointsRoutes;
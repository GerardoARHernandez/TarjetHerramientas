// src/apps/points-loyalty/routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';

import Login from './views/Login';

// Importaciones de vistas de admin
import RegisterClient from './views/RegisterClient'; // Registro desde admin
import AdminPoints from './views/admin/AdminPoints';
import {RegisterPurchase} from './views/admin/RegisterPurchase';

// Importaciones de vistas de cliente
import Stamps from './views/client/StampsClient';
import PointsClient from './views/client/PointsClient';

// Importaciones de componentes
import AdminHeader from './components/AdminHeader';
import ClientHeader from './components/ClientHeader';

const PointsRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const { clients } = usePoints();

  // Determinar si el usuario es admin basado en el rol
  const isAdmin = user?.role === 'admin';
  
  // Para clientes, verificar autenticación en localStorage
  const isClientAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Mostrar header según el tipo de usuario */}
      {isAuthenticated && isAdmin && <AdminHeader />}
      
      <Routes>
        {/* Ruta principal - redirige según el tipo de usuario */}
        <Route 
          index 
          element={
            isAuthenticated && isAdmin ? (
              <AdminPoints />
            ) : isClientAuthenticated || isAuthenticated ? (
              <PointsClient />
            ) : (
              <Navigate to="/points-loyalty/login" replace /> 
            )
          } 
        />
        
        {/* Login unificado */}
        <Route 
          path="login" 
          element={
            !isAuthenticated && !isClientAuthenticated ? (
              <Login />
            ) : isAuthenticated && isAdmin ? (
              <Navigate to="/points-loyalty" replace />
            ) : (
              <Navigate to="/points-loyalty/points" replace />
            )
          } 
        />
        
        {/* Registro de cliente (para clientes nuevos) */}
        <Route 
          path="registrar" 
          element={
            !isClientAuthenticated && !isAuthenticated ? (
              <RegisterClient />
            ) : (
              <Navigate to="/points-loyalty" replace />
            )
          } 
        />
        
        {/* Registro de compra (admin) */}
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
        
        {/* Página de sellos (cliente) */}
        <Route 
          path="stamps" 
          element={
            isClientAuthenticated || isAuthenticated ? (
              <Stamps />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        {/* Página de puntos (cliente) */}
        <Route 
          path="points" 
          element={
            isClientAuthenticated || isAuthenticated ? (
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
              isClientAuthenticated || isAuthenticated ? "/points-loyalty/points" : 
              "/points-loyalty/login"
            } replace /> 
          } 
        />
      </Routes>
    </div>
  );
};

export default PointsRoutes;
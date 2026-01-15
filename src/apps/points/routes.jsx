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
import AdminHeader from './components/admin/AdminHeader';
import RegisterPromotion from './views/admin/RegisterPromotion';
import FullHistory from './views/client/FullHistory';
import RedeemPromo from './views/admin/RedeemPromo';
import RegistrarClienteFromAdmin from './views/admin/RegistrarClienteFromAdmin';
import Ruleta from './views/client/Ruleta';

const PointsRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const { clients } = usePoints();
  
  // Determinar si el usuario es admin basado en el rol
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Solo mostrar AdminHeader para admins - los componentes cliente manejan su propio header */}
      {isAuthenticated && isAdmin && <AdminHeader />}
      
      <Routes>
        {/* Ruta principal - redirige según el tipo de usuario */}
        <Route 
          index 
          element={
            isAuthenticated ? (
              isAdmin ? <AdminPoints /> : <Navigate to="/points-loyalty/points" replace />
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

        <Route 
          path="login/:negocioId" 
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
        
        {/* Registro de cliente */}
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
        
        {/* Rutas de admin */}
        <Route 
          path="registrar-compra" 
          element={
            isAuthenticated && isAdmin ? (
              <RegisterPurchase />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        <Route 
          path="canjear" 
          element={
            isAuthenticated && isAdmin ? (
              <RedeemPromo />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        <Route 
          path="crear-promocion" 
          element={
            isAuthenticated && isAdmin ? (
              <RegisterPromotion />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />

        <Route 
          path="registro-cliente" 
          element={
            isAuthenticated && isAdmin ? (
              <RegistrarClienteFromAdmin />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />
        
        {/* Rutas de cliente */}
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

        {/* Ruta de historial completo */}
        <Route 
          path="full-history" 
          element={
            isAuthenticated && !isAdmin ? (
              <FullHistory />
            ) : (
              <Navigate to="/points-loyalty/login" replace />
            )
          } 
        />

        <Route 
          path='ruleta'
          element={<Ruleta />}
        />



      </Routes>
    </div>
  );
};

export default PointsRoutes;
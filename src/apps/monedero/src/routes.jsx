// src/apps/digitalwallet/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import ClientHome from "./views/ClientHome";
import AdminHome from "./views/admin/AdminHome";
import RegisterFromAdmin from "./views/admin/RegisterFromAdmin";
import Abonar from "./views/admin/Abonar";
import Canjear from "./views/admin/Canjear";
import Historial from "./views/Historial";
import TerminosCondiciones from "./views/TerminosCondiciones.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const DigitalWalletRoutes = () => {
  // Función para obtener el usuario actual
  const getCurrentUser = () => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const userStr = rememberMe ? localStorage.getItem("user") : sessionStorage.getItem("user");
    
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const user = getCurrentUser();

  return (
    <Routes>
      {/* Ruta base - redirige según sesión guardada */}
      <Route 
        index 
        element={
          user ? (
            user.usuarioRol === "ADMIN" ? 
              <Navigate to="/digitalwallet/admin" replace /> : 
              <Navigate to="/digitalwallet/client" replace />
          ) : (
            <Navigate to="/digitalwallet/login" replace />
          )
        } 
      />
      
      {/* Rutas públicas - Ahora soportan parámetro opcional */}
      <Route path="login" element={<Login />} />
      <Route path="login/:negocioId" element={<Login />} />
      
      {/* Rutas de cliente - protegidas */}
      <Route 
        path="client" 
        element={
          <ProtectedRoute requiredRole="CLIENT">
            <ClientHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="client/historial" 
        element={
          <ProtectedRoute requiredRole="CLIENT">
            <Historial />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="client/terminos" 
        element={
          <ProtectedRoute requiredRole="CLIENT">
            <TerminosCondiciones />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de admin - protegidas */}
      <Route 
        path="admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/registrar" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <RegisterFromAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/abonar" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Abonar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/canjear" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Canjear />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta comodín */}
      <Route path="*" element={<Navigate to="/digitalwallet/login" replace />} />
    </Routes>
  );
};

export default DigitalWalletRoutes;
// src/apps/digitalwallet/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  // Intentar obtener el usuario primero de localStorage, luego de sessionStorage
  let user = null;
  let userStr = null;
  
  // Verificar si hay sesión guardada con "Recordarme"
  const rememberMe = localStorage.getItem("rememberMe") === "true";
  
  if (rememberMe) {
    userStr = localStorage.getItem("user");
  } else {
    userStr = sessionStorage.getItem("user");
  }
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/digitalwallet/login" replace />;
  }
  
  // Normalizar roles para comparación
  const userRole = user.usuarioRol === "CLIE" ? "CLIENT" : user.usuarioRol;
  const required = requiredRole === "CLIENT" ? "CLIENT" : requiredRole;
  
  // Si se requiere un rol específico y el usuario no tiene ese rol
  if (required && userRole !== required) {
    // Redirigir según el rol real del usuario
    if (userRole === "ADMIN") {
      return <Navigate to="/digitalwallet/admin" replace />;
    } else if (userRole === "CLIENT") {
      return <Navigate to="/digitalwallet/client" replace />;
    } else {
      return <Navigate to="/digitalwallet/login" replace />;
    }
  }
  
  // Si todo está bien, mostrar el componente hijo
  return children;
};

export default ProtectedRoute;
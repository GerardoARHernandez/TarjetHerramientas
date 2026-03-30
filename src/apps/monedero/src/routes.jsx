// src/apps/digitalwallet/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import ClientHome from "./views/ClientHome";
import AdminHome from "./views/admin/AdminHome";
import RegisterFromAdmin from "./views/admin/RegisterFromAdmin";
import Abonar from "./views/admin/Abonar";
import Canjear from "./views/admin/Canjear";
import Historial from "./views/Historial";

const DigitalWalletRoutes = () => {
  return (
    <Routes>
      {/* Ruta base de digitalwallet - redirige a login */}
      <Route index element={<Navigate to="/digitalwallet/login" replace />} />
      
      {/* Todas las rutas ahora tienen el prefijo digitalwallet */}
      <Route path="login" element={<Login />} />
      <Route path="client" element={<ClientHome />} />
      <Route path="client/historial" element={<Historial />} />
      <Route path="admin" element={<AdminHome />} />
      <Route path="admin/registrar" element={<RegisterFromAdmin />} />
      <Route path="admin/canjear" element={<Canjear />} />
      <Route path="admin/abonar" element={<Abonar />} />
      
      {/* Ruta comodín - redirige a login */}
      <Route 
        path="*" 
        element={<Navigate to="/digitalwallet/login" replace />} 
      />
    </Routes>
  );
};

export default DigitalWalletRoutes;
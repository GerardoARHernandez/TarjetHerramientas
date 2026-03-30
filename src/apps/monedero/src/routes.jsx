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

const DigitalWalletRoutes = () => {
  return (
    <Routes>
      {/* Ruta base - redirige a login */}
      <Route index element={<Navigate to="/digitalwallet/login" replace />} />
      
      {/* Rutas públicas */}
      <Route path="login" element={<Login />} />
      
      {/* Rutas de cliente */}
      <Route path="client" element={<ClientHome />} />
      <Route path="client/historial" element={<Historial />} />
      <Route path="client/terminos" element={<TerminosCondiciones />} />
      
      {/* Rutas de admin */}
      <Route path="admin" element={<AdminHome />} />
      <Route path="admin/registrar" element={<RegisterFromAdmin />} />
      <Route path="admin/abonar" element={<Abonar />} />
      <Route path="admin/canjear" element={<Canjear />} />
      
      {/* Ruta comodín */}
      <Route path="*" element={<Navigate to="/digitalwallet/login" replace />} />
    </Routes>
  );
};

export default DigitalWalletRoutes;
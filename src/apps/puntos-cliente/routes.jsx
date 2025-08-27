import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import Stamps from './views/Stamps';
import Points from './views/Points';

const ClientPointsRoutes = () => {

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/stamps"
          element={isAuthenticated ? <Stamps /> : <Navigate to="/login" />}
        />
        <Route
          path="/points"
          element={isAuthenticated ? <Points /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default ClientPointsRoutes;
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './views/Login';
import { Points } from './views/Points';
import { RegisterPurchase } from './views/RegisterPurchase';
import { RegisterClient } from './views/RegisterClient';
import Header from './components/Header';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleAddClient = (client) => {
    setClients(prev => [client, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Header onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            index
            element={
              isAuthenticated ? (
                <Points transactions={transactions} clients={clients} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/registrar-cliente" 
            element={
              isAuthenticated ? (
                <RegisterClient onAddClient={handleAddClient} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/registrar-compra" 
            element={
              isAuthenticated ? (
                <RegisterPurchase 
                  onAddTransaction={handleAddTransaction} 
                  clients={clients} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
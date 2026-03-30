// src/views/client/Historial.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";
import { useTheme } from "../context/ThemeContext";

const Historial = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, income, expense

  // Obtener el usuario del localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    const user = JSON.parse(storedUser);
    setUserData(user);
    
    // Verificar si es titular, si no, redirigir
    if (user.titular !== 1) {
      navigate("/client");
      return;
    }
    
    fetchUserBalance(user.usuarioId);
  }, [navigate]);

  const fetchUserBalance = async (usuarioId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/account/${usuarioId}/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserData(prev => ({
          ...prev,
          ...data.data.usuario,
          montoDisponible: data.data.usuario.montoDisponible,
          montoUtilizado: data.data.usuario.montoUtilizado
        }));
        
        // Ordenar transacciones por fecha (más reciente primero)
        const sortedTransactions = (data.data.transacciones || []).sort((a, b) => 
          new Date(b.transaccionFecha) - new Date(a.transaccionFecha)
        );
        setTransactions(sortedTransactions);
      } else {
        setError(data.message || "Error al obtener los datos");
      }
    } catch (error) {
      console.error("Error al obtener balance:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la descripción de la transacción
  const getTransactionDescription = (tx) => {
    if (tx.transaccionTipo === "A") {
      return "Recarga de saldo";
    } else if (tx.transaccionTipo === "C") {
      return "Canje de saldo";
    }
    return "Movimiento";
  };

  // Función para obtener el número de referencia
  const getReferenceNumber = (tx) => {
    if (tx.transaccionTipo === "A") {
      return tx.transaccionNoReferen;
    } else if (tx.transaccionTipo === "C") {
      return tx.transaccionNoReferen;
    }
    return "";
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar transacciones
  const filteredTransactions = transactions.filter(tx => {
    if (filter === "income") return tx.transaccionTipo === "A";
    if (filter === "expense") return tx.transaccionTipo === "C";
    return true;
  });

  // Calcular estadísticas
  const stats = {
    totalIngresos: transactions.filter(tx => tx.transaccionTipo === "A").reduce((sum, tx) => sum + tx.transaccionImporte, 0),
    totalGastos: transactions.filter(tx => tx.transaccionTipo === "C").reduce((sum, tx) => sum + tx.transaccionImporte, 0),
    totalMovimientos: transactions.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <ClientHeader esTitular={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando historial...</p>
          </div>
        </main>
        <ClientFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <ClientHeader esTitular={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-6 max-w-md">
            <p className="text-red-800 dark:text-red-300 text-center">❌ {error}</p>
            <button
              onClick={() => fetchUserBalance(userData?.usuarioId)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        </main>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ClientHeader esTitular={true} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Historial de Movimientos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userData?.usuarioNombre} {userData?.usuarioApellido}
            </p>
          </div>
          <Link
            to="/client"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total movimientos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalMovimientos}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total ingresos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalIngresos.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total gastos</p>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">${stats.totalGastos.toFixed(2)}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Gastos
          </button>
        </div>

        {/* Tabla de transacciones */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              {filter === "all" && "Todos los movimientos"}
              {filter === "income" && "Ingresos"}
              {filter === "expense" && "Gastos"}
            </h2>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === "all" && "No hay movimientos registrados"}
                {filter === "income" && "No hay ingresos registrados"}
                {filter === "expense" && "No hay gastos registrados"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Fecha</th>
                    <th className="px-6 py-3 text-left">Hora</th>
                    <th className="px-6 py-3 text-left">Descripción</th>
                    <th className="px-6 py-3 text-left">Referencia</th>
                    <th className="px-6 py-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((tx) => {
                    const isCredit = tx.transaccionTipo === "A";
                    const description = getTransactionDescription(tx);
                    const reference = getReferenceNumber(tx);
                    
                    return (
                      <tr key={tx.transaccionId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {formatDate(tx.transaccionFecha)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {formatTime(tx.transaccionFecha)}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">
                              {description}
                            </p>
                            {tx.transaccionTipo === "C" && tx.transaccionFolioTick !== "0" && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Folio tick: {tx.transaccionFolioTick}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {reference && reference !== "0" ? (
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {reference}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          isCredit 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-500 dark:text-red-400"
                        }`}>
                          {isCredit ? "+" : "-"}${tx.transaccionImporte.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default Historial;
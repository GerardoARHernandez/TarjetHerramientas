// src/views/ClientHome.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";
import QRModal from "../components/QRModal"; 
import { useTheme } from "../context/ThemeContext"; 

const ClientHome = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [business, setBusiness] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/digitalwallet/login");
      return;
    }
    
    const user = JSON.parse(storedUser);
    setUserData(user);
    
    const negocioId = user.negocioId || 1;
    fetchBusiness(negocioId);
    fetchUserBalance(user.usuarioId);
  }, [navigate]);

  const fetchBusiness = async (negocioId) => {
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/negocios/${negocioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (data.success) {
        setBusiness(data.data);
        localStorage.setItem("business", JSON.stringify(data.data));
      } else {
        console.error("Error al cargar negocio:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar negocio:", error);
    }
  };

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

  const getTransactionDescription = (tx) => {
    if (tx.transaccionTipo === "A") return "Recarga de saldo";
    if (tx.transaccionTipo === "C") return "Canje de saldo";
    return "Movimiento";
  };

  const getReferenceNumber = (tx) => {
    if (tx.transaccionTipo === "A" || tx.transaccionTipo === "C") {
      return tx.transaccionNoReferen;
    }
    return "";
  };

  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    return phone;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    if (userData?.titular !== 1) {
      return {
        ingresosMes: 0,
        gastosMes: 0,
        totalMovimientos: 0,
        totalRecargas: 0,
        totalCanjes: 0
      };
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let ingresosMes = 0;
    let gastosMes = 0;
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.transaccionFecha);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.transaccionTipo === "A") ingresosMes += tx.transaccionImporte;
        else if (tx.transaccionTipo === "C") gastosMes += tx.transaccionImporte;
      }
    });
    
    return {
      ingresosMes,
      gastosMes,
      totalMovimientos: transactions.length,
      totalRecargas: transactions.filter(tx => tx.transaccionTipo === "A").length,
      totalCanjes: transactions.filter(tx => tx.transaccionTipo === "C").length
    };
  };

  const stats = calculateStats();
  const esTitular = userData?.titular === 1;
  
  const color1 = business?.negocioColor1 || "#4f46e5";
  const color2 = business?.negocioColor2 || "#7c3aed";
  const imagenUrl = business?.negocioImagenUrl;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-400'} border rounded-lg p-6 max-w-md`}>
            <p className={`${isDark ? 'text-red-300' : 'text-red-800'}`}>❌ {error}</p>
            <button
              onClick={() => fetchUserBalance(userData?.usuarioId)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <ClientHeader esTitular={esTitular} color1={color1} color2={color2} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Balance card */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Imagen */}
          <div className="md:w-1/2 order-1 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-full">
              <img 
                src={imagenUrl && imagenUrl !== "" ? imagenUrl : "/1.jpeg"} 
                alt={business?.negocioNombre || "Wallet illustration"} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />              
            </div>
          </div>

          {/* Saldo y acciones QR */}
          <div className="md:w-1/2 order-2 md:order-2 space-y-4">
            {/* Tarjeta de saldo */}
            {isDark ? (
              <div className="rounded-2xl p-6 shadow-lg bg-gray-800 border border-gray-700">
                <div>
                  <div className="bottom-4 left-4">
                    <p className="text-sm font-medium text-gray-300">Bienvenido a <strong className="text-white">tu monedero digital</strong></p>                
                  </div>
                  <p className="text-sm font-medium flex items-center gap-2 pt-2 text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Saldo disponible
                  </p>
                  <p className="text-4xl font-bold mt-2 text-white">
                    ${userData?.montoDisponible?.toFixed(2) || "0.00"}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">
                        {userData?.usuarioNombre} {userData?.usuarioApellido}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1 text-gray-400">
                        {userData?.titular === 1 ? "Cuenta Titular" : "Cuenta Adicional"}
                        {userData?.idTitular > 0 && ` · ID Titular: ${userData.idTitular}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Saldo utilizado</p>
                      <p className="text-sm font-semibold text-gray-300">
                        ${userData?.montoUtilizado?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="rounded-2xl p-6 text-white shadow-lg"
                style={{ background: `linear-gradient(145deg, ${color1}, ${color2})` }}
              >
                <div>
                  <div className="bottom-4 left-4 text-white">
                    <p className="text-sm font-medium opacity-90">Bienvenido a <strong>tu monedero digital</strong></p>                
                  </div>
                  <p className="text-sm font-medium flex items-center gap-2 pt-2 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Saldo disponible
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    ${userData?.montoDisponible?.toFixed(2) || "0.00"}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t" style={{ borderColor: `${color1}40` }}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-sm">
                        {userData?.usuarioNombre} {userData?.usuarioApellido}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1">
                        {userData?.titular === 1 ? "Cuenta Titular" : "Cuenta Adicional"}
                        {userData?.idTitular > 0 && ` · ID Titular: ${userData.idTitular}`}
                      </p>
                    </div>
                    <div className="text-right text-white">
                      <p className="text-xs">Saldo utilizado</p>
                      <p className="text-sm font-semibold">
                        ${userData?.montoUtilizado?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de QR */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-4 px-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600 hover:text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={!isDark ? { color: color1, borderColor: color1 } : {}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Mi Código QR
            </button>
          </div>
        </div>

        {/* Quick stats */}
        {esTitular && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Ingresos del mes", value: `$${stats.ingresosMes.toFixed(2)}`, color: isDark ? "text-green-400" : "text-green-600" },
              { label: "Gastos del mes", value: `$${stats.gastosMes.toFixed(2)}`, color: isDark ? "text-red-400" : "text-red-500" },
              { label: "Movimientos", value: stats.totalMovimientos.toString(), color: isDark ? "text-white" : "text-gray-600" },
              { label: "Recargas", value: stats.totalRecargas.toString(), color: isDark ? "text-white" : "text-gray-600" },
            ].map((stat) => (
              <div key={stat.label} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 shadow-sm border`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recent transactions */}
        {esTitular && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Movimientos recientes</h2>
              <Link 
                to="/digitalwallet/client/historial" 
                className="text-sm hover:underline"
                style={!isDark ? { color: color1 } : { color: '#9ca3af' }}
              >
                Ver todos
              </Link>
            </div>
            {transactions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No hay movimientos registrados</p>
              </div>
            ) : (
              <ul className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {transactions.slice(0, 5).map((tx) => {
                  const isCredit = tx.transaccionTipo === "A";
                  const amount = tx.transaccionImporte;
                  const description = getTransactionDescription(tx);
                  const reference = getReferenceNumber(tx);
                  
                  return (
                    <li key={tx.transaccionId} className={`px-6 py-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${isCredit 
                              ? isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-600"
                              : isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-500"}`}>
                            {isCredit ? "↓" : "↑"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {description}
                              </p>
                              {reference && reference !== "0" && (
                                <span className={`text-xs font-mono ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'} px-2 py-0.5 rounded`}>
                                  {reference}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatDate(tx.transaccionFecha)}
                              </p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatTime(tx.transaccionFecha)}
                              </p>
                              {tx.transaccionTipo === "C" && tx.transaccionFolioTick !== "0" && (
                                <>
                                  <span className="text-xs text-gray-400">•</span>
                                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Folio: {tx.transaccionFolioTick}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isCredit 
                          ? isDark ? "text-green-400" : "text-green-600"
                          : isDark ? "text-red-400" : "text-red-500"}`}>
                          {isCredit ? "+" : "-"}${amount.toFixed(2)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {transactions.length > 5 && (
              <div className={`px-6 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                <Link 
                  to="/digitalwallet/client/historial" 
                  className="text-sm hover:underline"
                  style={!isDark ? { color: color1 } : { color: '#9ca3af' }}
                >
                  Ver los {transactions.length - 5} movimientos restantes
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mensaje para cuentas adicionales */}
        {!esTitular && (
          <div className={`${isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'} border rounded-xl p-6 text-center`}>
            <svg className={`w-12 h-12 mx-auto ${isDark ? 'text-amber-400' : 'text-amber-500'} mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`${isDark ? 'text-amber-300' : 'text-amber-700'} font-medium`}>
              Esta es una cuenta adicional
            </p>
            <p className={`text-sm ${isDark ? 'text-amber-400' : 'text-amber-600'} mt-1`}>
              El historial de movimientos solo está disponible para cuentas titulares.
            </p>
          </div>
        )}
      </main>

      <QRModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        phoneNumber={userData?.usuarioTelefono ? formatPhoneForDisplay(userData.usuarioTelefono.trim()) : ""}
        usuarioId={userData?.usuarioId}
      />

      <ClientFooter />
    </div>
  );
};

export default ClientHome;
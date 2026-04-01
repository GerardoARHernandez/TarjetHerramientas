// src/views/Login.jsx
import { useState, useEffect } from "react"; // Agrega useEffect
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true); // Estado para verificar sesión

  // Número de teléfono específico para admin
  const ADMIN_PHONE = "5512345678";

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

  // Verificar si ya hay una sesión iniciada al cargar el componente
  useEffect(() => {
    const user = getCurrentUser();
    
    if (user) {
      // Normalizar el rol
      const userRole = user.usuarioRol === "CLIE" ? "CLIENT" : user.usuarioRol;
      
      // Redirigir según el rol
      if (userRole === "ADMIN") {
        navigate("/digitalwallet/admin", { replace: true });
      } else if (userRole === "CLIENT") {
        navigate("/digitalwallet/client", { replace: true });
      } else {
        // Si el rol no es reconocido, mantener en login
        setCheckingSession(false);
      }
    } else {
      setCheckingSession(false);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const cleanPhone = phone.replace(/\D/g, "");
    
    // Verificar si es el admin (número especial, cualquier contraseña funciona)
    if (cleanPhone === ADMIN_PHONE) {
      const adminUser = {
        usuarioId: 1,
        usuarioNombre: "Admin",
        usuarioApellido: "Sistema",
        usuarioTelefono: ADMIN_PHONE,
        usuarioRol: "ADMIN",
        tipoUsuario: "Admin",
        titular: 1,
        idTitular: null,
        negocioId: 1
      };
      
      // Guardar según la opción "Recordarme"
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("rememberMe", "true");
      } else {
        sessionStorage.setItem("user", JSON.stringify(adminUser));
        // Limpiar localStorage si existe
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
      }
      
      console.log('Admin especial guardado:', rememberMe ? 'localStorage' : 'sessionStorage');
      
      navigate("/digitalwallet/admin");
      setLoading(false);
      return;
    }
    
    // Login normal
    try {
      const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono: cleanPhone,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        const userData = {
          usuarioId: data.data.usuarioId,
          usuarioNombre: data.data.usuarioNombre,
          usuarioApellido: data.data.usuarioApellido,
          usuarioTelefono: data.data.usuarioTelefono,
          usuarioRol: data.data.usuarioRol === "CLIE" ? "CLIENT" : data.data.usuarioRol,
          tipoUsuario: data.data.tipoUsuario,
          titular: data.data.titular,
          idTitular: data.data.idTitular,
          negocioId: data.data.negocioId || 1
        };
        
        // Guardar según la opción "Recordarme"
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
          // Limpiar localStorage si existe
          localStorage.removeItem("user");
          localStorage.removeItem("rememberMe");
        }
        
        console.log('Usuario guardado:', rememberMe ? 'localStorage' : 'sessionStorage');
        
        if (data.data.usuarioRol === "ADMIN") {
          navigate("/digitalwallet/admin");
        } else {
          navigate("/digitalwallet/client");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al conectar con el servidor. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el número de teléfono mientras se escribe
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers;    
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  // Mostrar un spinner mientras verificamos la sesión
  if (checkingSession) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-indigo-900 to-indigo-950' : 'from-indigo-100 to-indigo-200'} flex items-center justify-center px-4 transition-colors duration-300`}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-indigo-900 to-indigo-950' : 'from-indigo-100 to-indigo-200'} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-2 mb-6">
          <img src="/1.jpeg" alt="Logo Monedero" className="w-full h-auto rounded-t-2xl" />
        </div>
        <div className={` ${isDark ? 'dark:bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <div className="flex flex-col items-center mb-8">
            <div className="self-end mb-2">
              <ThemeToggle />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Monedero</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Inicia sesión en tu monedero</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Número de teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="55-1234-5678"
                  required
                  disabled={loading}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 
                    focus:border-transparent transition disabled:opacity-50 
                    disabled:cursor-not-allowed
                    ${error 
                      ? 'border-red-500' 
                      : (isDark ? 'border-gray-600' : 'border-gray-400')
                    }
                    ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 
                    focus:border-transparent transition disabled:opacity-50 
                    disabled:cursor-not-allowed
                    ${error 
                      ? 'border-red-500' 
                      : (isDark ? 'border-gray-600' : 'border-gray-400')
                    }
                    ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-400'} border rounded-lg p-3`}>
                <p className={`${isDark ? 'text-red-300' : 'text-red-800'} text-sm text-center`}>
                  ❌ {error}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} cursor-pointer`}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`rounded ${isDark ? 'bg-gray-700' : ''}`} 
                />
                Recordarme
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
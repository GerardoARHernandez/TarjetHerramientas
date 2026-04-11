// src/views/admin/Canjear.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const Canjear = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    searchTerm: "",
    importe: "",
    folioTick: "",
    sucursal: ""
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [success, setSuccess] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Función para obtener el usuario actual (de localStorage o sessionStorage)
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

  // Cargar todos los usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Verificar si viene un usuarioId en la URL (desde la tabla de usuarios)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usuarioId = params.get("usuarioId");
    if (usuarioId && users.length > 0) {
      const user = users.find(u => u.usuarioId === parseInt(usuarioId));
      if (user) {
        seleccionarUsuario(user);
      }
    }
  }, [location, users]);

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (formData.searchTerm.trim() === "") {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const searchLower = formData.searchTerm.toLowerCase();
    const filtered = users.filter(user => {
      const nombreCompleto = `${user.usuarioNombre} ${user.usuarioApellido}`.toLowerCase();
      const telefono = user.usuarioTelefono.trim();
      const telefonoFormateado = formatPhoneNumberForDisplay(telefono);
      
      return nombreCompleto.includes(searchLower) || 
             telefono.includes(searchLower) ||
             telefonoFormateado.includes(searchLower);
    });
    
    setFilteredUsers(filtered.slice(0, 10)); // Mostrar máximo 10 resultados
    setShowDropdown(filtered.length > 0);
  }, [formData.searchTerm, users]);

  const cargarUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const user = getCurrentUser();
      const negocioId = user?.negocioId || 1;
      
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/users/${negocioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        console.error("Error al cargar usuarios:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Función para formatear el número de teléfono para mostrar
  const formatPhoneNumberForDisplay = (phone) => {
    if (!phone) return "";
    const clean = phone.toString().trim();
    if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
    }
    return clean;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "searchTerm") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Limpiar usuario seleccionado cuando cambia la búsqueda
      if (selectedUser) {
        setSelectedUser(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Limpiar mensaje de éxito cuando el usuario modifica algo
    if (success) {
      setSuccess(null);
    }
  };

  const seleccionarUsuario = (user) => {
    setSelectedUser(user);
    setFormData(prev => ({
      ...prev,
      searchTerm: `${user.usuarioNombre} ${user.usuarioApellido} - ${formatPhoneNumberForDisplay(user.usuarioTelefono)}`
    }));
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, searchTerm: "" }));
  };

  // Función para generar folio automático basado en la sucursal
  const generarFolioAutomatico = (sucursal) => {
    if (!sucursal) return "";
    
    const fecha = new Date();
    const timestamp = fecha.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Formato: SUCURSAL-TIMESTAMP-RANDOM
    return `${sucursal}-${timestamp}-${random}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedUser) {
      newErrors.searchTerm = "Debe seleccionar un usuario válido";
    }

    // Validar importe
    if (!formData.importe) {
      newErrors.importe = "El importe es obligatorio";
    } else if (parseFloat(formData.importe) <= 0) {
      newErrors.importe = "El importe debe ser mayor a 0";
    } else if (isNaN(parseFloat(formData.importe))) {
      newErrors.importe = "El importe debe ser un número válido";
    }

    // Validar sucursal
    if (!formData.sucursal) {
      newErrors.sucursal = "La sucursal es obligatoria";
    } else if (!/^\d+$/.test(formData.sucursal)) {
      newErrors.sucursal = "La sucursal debe ser un número válido";
    }

    // FolioTick es opcional, pero si se ingresa, validamos que no esté vacío
    if (formData.folioTick && formData.folioTick.trim() === "") {
      newErrors.folioTick = "El folio no puede estar vacío";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSuccess(null);
      
      // Determinar el folio a usar
      let folioTick = formData.folioTick.trim();
      
      // Si no se proporcionó un folio, generar uno automático
      if (!folioTick) {
        folioTick = generarFolioAutomatico(formData.sucursal);
      }
      
      try {
        const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/account/wallet/redeem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId: selectedUser.usuarioId,
            importe: parseFloat(formData.importe),
            folioTick: folioTick,
            sucursal: formData.sucursal
          })
        });

        const data = await response.json();

        if (data.success) {
          setSuccess({
            message: data.message,
            transaccionId: data.data.transaccionId,
            saldoDetId: data.data.saldoDetId,
            folio: data.data.folio,
            importe: data.data.importe,
            montoDisponibleActualizado: data.data.montoDisponibleActualizado,
            montoUtilizadoActualizado: data.data.montoUtilizadoActualizado,
            fecha: new Date(data.data.fecha).toLocaleString('es-MX'),
            folioTickGenerado: folioTick,
            usuario: selectedUser
          });
          
          // Limpiar los campos después del éxito
          setFormData(prev => ({
            ...prev,
            importe: "",
            folioTick: "",
            sucursal: ""
          }));
          
          // Limpiar el mensaje de éxito después de 5 segundos
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          throw new Error(data.message || "Error al procesar el canje");
        }
      } catch (error) {
        console.error("Error al canjear:", error);
        setErrors({
          submit: error.message || "Error al conectar con el servidor"
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950 transition-colors duration-300">
      <AdminHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
          {/* Header del formulario */}
          <div className="px-6 py-4 border-b border-gray-500 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Canjear Saldo
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Redima saldo de la cuenta de un cliente
              </p>
            </div>
            <Link
              to="/admin"
              className="text-xs bg-gray-500 hover:bg-gray-600 text-white font-semibold px-3 py-1.5 rounded-lg transition"
            >
              ← Volver
            </Link>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Buscador de usuarios con autocompletado */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar Cliente <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    name="searchTerm"
                    value={formData.searchTerm}
                    onChange={handleChange}
                    placeholder="Buscar por nombre o teléfono..."
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.searchTerm 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-400 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                    autoComplete="off"
                  />
                  {loadingUsers && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Dropdown de resultados */}
                {showDropdown && filteredUsers.length > 0 && (
                  <div 
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  >
                    {filteredUsers.map((user) => (
                      <button
                        key={user.usuarioId}
                        type="button"
                        onClick={() => seleccionarUsuario(user)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.usuarioNombre} {user.usuarioApellido}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatPhoneNumberForDisplay(user.usuarioTelefono)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.titular === 1 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" 
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                            }`}>
                              {user.titular === 1 ? "Titular" : "Adicional"}
                            </span>
                            {user.idTitular !== user.usuarioId && user.idTitular > 0 && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                ID Titular: {user.idTitular}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.searchTerm && (
                <p className="mt-1 text-xs text-red-500">{errors.searchTerm}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Comience a escribir el nombre o teléfono del cliente para buscarlo
              </p>
            </div>

            {/* Información del usuario seleccionado */}
            {selectedUser && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                  ✓ Usuario seleccionado
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">ID:</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.usuarioId}</p>
                  
                  <p className="text-gray-600 dark:text-gray-400">Nombre completo:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedUser.usuarioNombre} {selectedUser.usuarioApellido}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400">Teléfono:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatPhoneNumberForDisplay(selectedUser.usuarioTelefono)}
                  </p>
                  
                  {selectedUser.usuarioCorreo && (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">Email:</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedUser.usuarioCorreo}</p>
                    </>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-400">Tipo de cuenta:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedUser.titular === 1 ? "Cuenta Titular" : "Cuenta Adicional"}
                    {selectedUser.idTitular !== selectedUser.usuarioId && selectedUser.idTitular > 0 && 
                      ` (ID Titular: ${selectedUser.idTitular})`}
                  </p>
                </div>
              </div>
            )}

            {/* Importe a canjear */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Importe a canjear <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="importe"
                  value={formData.importe}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  disabled={!selectedUser}
                  className={`w-full pl-8 pr-4 py-2.5 rounded-lg border ${
                    errors.importe 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    !selectedUser ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              {errors.importe && (
                <p className="mt-1 text-xs text-red-500">{errors.importe}</p>
              )}
            </div>

            {/* Sucursal */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sucursal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                placeholder="Ej: 1, 2, 12, 15..."
                disabled={!selectedUser}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.sucursal 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-400 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  !selectedUser ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              {errors.sucursal && (
                <p className="mt-1 text-xs text-red-500">{errors.sucursal}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Número de la sucursal donde se realiza el canje
              </p>
            </div>

            {/* Folio Tick (opcional) */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Folio Tick <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                name="folioTick"
                value={formData.folioTick}
                onChange={handleChange}
                placeholder="Dejar en blanco para generar automático"
                disabled={!selectedUser}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.folioTick 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-400 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  !selectedUser ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              {errors.folioTick && (
                <p className="mt-1 text-xs text-red-500">{errors.folioTick}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Si no se especifica, se generará automáticamente con el formato: [sucursal]-[timestamp]-[random]
              </p>
            </div>

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg p-4 animate-fade-in">
                <div className="flex items-start gap-2">
                  <div className="text-green-800 dark:text-green-300 font-semibold">
                    ✓ {success.message}
                  </div>
                </div>
                <div className="mt-3 text-sm text-green-700 dark:text-green-400 space-y-1">
                  <p><span className="font-medium">Cliente:</span> {success.usuario.usuarioNombre} {success.usuario.usuarioApellido}</p>
                  <p><span className="font-medium">Folio de transacción:</span> <span className="font-mono">{success.folio}</span></p>
                  <p><span className="font-medium">Folio Tick usado:</span> <span className="font-mono">{success.folioTickGenerado}</span></p>
                  <p><span className="font-medium">Importe canjeado:</span> ${success.importe.toFixed(2)} MXN</p>
                  <p><span className="font-medium">Nuevo saldo disponible:</span> ${success.montoDisponibleActualizado.toFixed(2)} MXN</p>
                  <p><span className="font-medium">Saldo utilizado acumulado:</span> ${success.montoUtilizadoActualizado.toFixed(2)} MXN</p>
                  <p><span className="font-medium">Fecha:</span> {success.fecha}</p>
                  <p><span className="font-medium">ID Transacción:</span> {success.transaccionId}</p>
                </div>
              </div>
            )}

            {/* Error general */}
            {errors.submit && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300 text-sm">
                  ❌ {errors.submit}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <button
                type="submit"
                disabled={!selectedUser || loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Canjear Saldo"
                )}
              </button>
              <Link
                to="/admin"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
};

export default Canjear;
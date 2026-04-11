// src/views/admin/RegisterFromAdmin.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const RegisterFromAdmin = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    esTitular: "1", // "1" para Sí, "0" para No
    idTitular: "" // ID del titular cuando es cuenta no titular
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [titulares, setTitulares] = useState([]); // Lista de titulares disponibles
  const [filteredTitulares, setFilteredTitulares] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTitular, setSearchTitular] = useState("");
  const [selectedTitular, setSelectedTitular] = useState(null);
  const [loadingTitulares, setLoadingTitulares] = useState(false);
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

  // Cargar la lista de titulares (usuarios con titular = 1)
  useEffect(() => {
    if (formData.esTitular === "0") {
      cargarTitulares();
    } else {
      // Limpiar datos cuando cambia a "Sí"
      setSearchTitular("");
      setSelectedTitular(null);
      setFormData(prev => ({ ...prev, idTitular: "" }));
      setShowDropdown(false);
    }
  }, [formData.esTitular]);

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

  // Filtrar titulares cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTitular.trim() || formData.esTitular !== "0") {
      setFilteredTitulares([]);
      setShowDropdown(false);
      return;
    }

    const searchLower = searchTitular.toLowerCase();
    const filtered = titulares.filter(titular => {
      const nombreCompleto = `${titular.usuarioNombre} ${titular.usuarioApellido}`.toLowerCase();
      const telefono = titular.usuarioTelefono.trim();
      const telefonoFormateado = formatPhoneNumberForDisplay(telefono);
      
      return nombreCompleto.includes(searchLower) || 
             telefono.includes(searchLower) ||
             telefonoFormateado.includes(searchLower);
    });
    
    setFilteredTitulares(filtered.slice(0, 10));
    setShowDropdown(filtered.length > 0);
  }, [searchTitular, titulares, formData.esTitular]);

  const cargarTitulares = async () => {
    setLoadingTitulares(true);
    try {
      const user = getCurrentUser();
      const negocioId = user?.negocioId || 1;
      
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/users/${negocioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const soloTitulares = data.data.filter(user => user.titular === 1);
        setTitulares(soloTitulares);
      } else {
        console.error("Error al cargar titulares");
      }
    } catch (error) {
      console.error("Error al cargar titulares:", error);
    } finally {
      setLoadingTitulares(false);
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

  // Función para formatear el número de teléfono mientras se escribe
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "telefono") {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
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

  const seleccionarTitular = (titular) => {
    setSelectedTitular(titular);
    setSearchTitular(`${titular.usuarioNombre} ${titular.usuarioApellido} - ${formatPhoneNumberForDisplay(titular.usuarioTelefono)}`);
    setFormData(prev => ({
      ...prev,
      idTitular: titular.usuarioId
    }));
    setShowDropdown(false);
    // Limpiar error del campo idTitular
    if (errors.idTitular) {
      setErrors(prev => ({ ...prev, idTitular: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    // Validar teléfono
    const cleanPhone = formData.telefono.replace(/\D/g, "");
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (cleanPhone.length !== 10) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    // Validar email (opcional pero si se ingresa, validar formato)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar fecha de nacimiento (opcional pero si se ingresa, debe ser válida)
    if (formData.fechaNacimiento) {
      const fecha = new Date(formData.fechaNacimiento);
      if (isNaN(fecha.getTime())) {
        newErrors.fechaNacimiento = "Fecha inválida";
      } else if (fecha > new Date()) {
        newErrors.fechaNacimiento = "La fecha no puede ser futura";
      }
    }

    // Validar ID del titular cuando NO es titular
    if (formData.esTitular === "0") {
      if (!formData.idTitular) {
        newErrors.idTitular = "Debe seleccionar un titular";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSuccess(null);
      
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const negocioId = user?.negocioId || 1;
      
      const cleanPhone = formData.telefono.replace(/\D/g, "");
      
      let idTitular;
      if (formData.esTitular === "1") {
        idTitular = 0;
      } else {
        idTitular = parseInt(formData.idTitular);
      }
      
      const apiData = {
        negocioId: negocioId, // Usar el negocioId del usuario
        titular: parseInt(formData.esTitular),
        idTitular: idTitular,
        usuarioNombre: formData.nombre.trim(),
        usuarioApellido: formData.apellido.trim(),
        usuarioTelefono: cleanPhone,
        usuarioPass: formData.password,
        usuarioCorreo: formData.email.trim() || null,
        usuarioFechaNacimiento: formData.fechaNacimiento || null
      };
      
      try {
        const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData)
        });

        const data = await response.json();

        if (data.success) {
          setSuccess({
            message: data.message,
            usuarioId: data.data.usuarioId,
            usuarioNombre: data.data.usuarioNombre,
            usuarioApellido: data.data.usuarioApellido,
            usuarioTelefono: data.data.usuarioTelefono,
            usuarioCorreo: data.data.usuarioCorreo,
            esTitular: data.data.titular === 1 ? "Sí" : "No",
            idTitularUsado: idTitular,
            nombreTitular: selectedTitular ? `${selectedTitular.usuarioNombre} ${selectedTitular.usuarioApellido}` : null,
            usuarioMiembroDesde: new Date(data.data.usuarioMiembroDesde).toLocaleString('es-MX')
          });
          
          // Limpiar el formulario después del éxito
          setFormData({
            nombre: "",
            apellido: "",
            telefono: "",
            email: "",
            password: "",
            confirmPassword: "",
            fechaNacimiento: "",
            esTitular: "1",
            idTitular: ""
          });
          setSearchTitular("");
          setSelectedTitular(null);
          
          // Limpiar el mensaje de éxito después de 5 segundos
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          throw new Error(data.message || "Error al registrar el usuario");
        }
      } catch (error) {
        console.error("Error al registrar:", error);
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
                Registrar Nuevo Usuario
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete los datos para crear una nueva cuenta
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
            {/* Grid de 2 columnas para datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.nombre 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.apellido 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.apellido && (
                  <p className="mt-1 text-xs text-red-500">{errors.apellido}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="55-1234-5678"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.telefono 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.telefono && (
                  <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
                )}
              </div>

              {/* Email (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo electrónico <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento (opcional) */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de nacimiento <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.fechaNacimiento 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-400 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
              />
              {errors.fechaNacimiento && (
                <p className="mt-1 text-xs text-red-500">{errors.fechaNacimiento}</p>
              )}
            </div>

            {/* Pregunta de cuenta titular */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                ¿Será cuenta titular? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="esTitular"
                    value="1"
                    checked={formData.esTitular === "1"}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="esTitular"
                    value="0"
                    checked={formData.esTitular === "0"}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>

            {/* Buscador de titular (solo cuando NO es titular) */}
            {formData.esTitular === "0" && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buscar Titular <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchTitular}
                      onChange={(e) => setSearchTitular(e.target.value)}
                      placeholder="Buscar titular por nombre o teléfono..."
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.idTitular 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-400 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                      autoComplete="off"
                    />
                    {loadingTitulares && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Dropdown de resultados */}
                  {showDropdown && filteredTitulares.length > 0 && (
                    <div 
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                    >
                      {filteredTitulares.map((titular) => (
                        <button
                          key={titular.usuarioId}
                          type="button"
                          onClick={() => seleccionarTitular(titular)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {titular.usuarioNombre} {titular.usuarioApellido}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatPhoneNumberForDisplay(titular.usuarioTelefono)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                Titular
                              </span>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                ID: {titular.usuarioId}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.idTitular && (
                  <p className="mt-1 text-xs text-red-500">{errors.idTitular}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Busque al titular por nombre o teléfono. Esta cuenta quedará asociada a ese titular.
                </p>
              </div>
            )}

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.password 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-400 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.confirmPassword 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-400 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
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
                  <p><span className="font-medium">ID Usuario:</span> {success.usuarioId}</p>
                  <p><span className="font-medium">Nombre completo:</span> {success.usuarioNombre} {success.usuarioApellido}</p>
                  <p><span className="font-medium">Teléfono:</span> {success.usuarioTelefono}</p>
                  {success.usuarioCorreo && <p><span className="font-medium">Email:</span> {success.usuarioCorreo}</p>}
                  <p><span className="font-medium">Cuenta titular:</span> {success.esTitular}</p>
                  {success.idTitularUsado !== 0 && (
                    <p><span className="font-medium">Titular asociado:</span> {success.nombreTitular} (ID: {success.idTitularUsado})</p>
                  )}
                  {success.idTitularUsado === 0 && (
                    <p><span className="font-medium">ID Titular asociado:</span> N/A (es titular)</p>
                  )}
                  <p><span className="font-medium">Miembro desde:</span> {success.usuarioMiembroDesde}</p>
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
                disabled={loading}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  "Registrar Usuario"
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

export default RegisterFromAdmin;
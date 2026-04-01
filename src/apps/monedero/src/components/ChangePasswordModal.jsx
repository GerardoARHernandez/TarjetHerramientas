// src/components/ChangePasswordModal.jsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const ChangePasswordModal = ({ isOpen, onClose, usuarioId }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    passwordActual: "",
    passwordNuevo: "",
    passwordNuevoConfirmar: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes al modificar
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.passwordActual) {
      setError("La contraseña actual es requerida");
      return false;
    }
    if (!formData.passwordNuevo) {
      setError("La nueva contraseña es requerida");
      return false;
    }
    if (formData.passwordNuevo.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.passwordNuevo !== formData.passwordNuevoConfirmar) {
      setError("Las contraseñas nuevas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(
        `https://souvenir-site.com/TarjetCashBack/api/account/${usuarioId}/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData)
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Contraseña actualizada correctamente");
        // Limpiar formulario después de 2 segundos y cerrar modal
        setTimeout(() => {
          setFormData({
            passwordActual: "",
            passwordNuevo: "",
            passwordNuevoConfirmar: ""
          });
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`max-w-md w-full rounded-xl shadow-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Cambiar Contraseña
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition ${
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}
          
          {success && (
            <div className={`p-3 rounded-lg text-sm ${
              isDark ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-green-100 text-green-700'
            }`}>
              {success}
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contraseña Actual
            </label>
            <input
              type="password"
              name="passwordActual"
              value={formData.passwordActual}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-transparent'
              }`}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="passwordNuevo"
              value={formData.passwordNuevo}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-transparent'
              }`}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="passwordNuevoConfirmar"
              value={formData.passwordNuevoConfirmar}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-transparent'
              }`}
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
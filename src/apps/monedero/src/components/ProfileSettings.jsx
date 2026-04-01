// src/components/ProfileSettings.jsx
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useTheme } from "../context/ThemeContext";

const ProfileSettings = ({ userData, onClose }) => {
  const { isDark } = useTheme();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className={`max-w-2xl w-full rounded-xl shadow-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Configuración de Cuenta
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
          
          <div className="p-6 space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nombre
                  </label>
                  <p className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    {userData?.usuarioNombre || "No disponible"}
                  </p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Apellido
                  </label>
                  <p className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    {userData?.usuarioApellido || "No disponible"}
                  </p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Teléfono
                  </label>
                  <p className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    {userData?.usuarioTelefono || "No disponible"}
                  </p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tipo de Cuenta
                  </label>
                  <p className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    {userData?.titular === 1 ? "Cuenta Titular" : "Cuenta Adicional"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Seguridad */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Seguridad
              </h3>
              
              <div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                >
                  Cambiar Contraseña
                </button>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recomendamos cambiar tu contraseña regularmente por seguridad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        usuarioId={userData?.usuarioId}
      />
    </>
  );
};

export default ProfileSettings;
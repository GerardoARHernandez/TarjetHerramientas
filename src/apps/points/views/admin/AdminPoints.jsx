// src/apps/points/views/AdminPoints.jsx
import { useState, useEffect } from 'react';
import { usePoints } from '../../../../contexts/PointsContext';
import { useAuth } from '../../../../contexts/AuthContext';
import ProgramConfigForm from '../../components/admin/ProgramConfigForm';

const AdminPoints = () => {
  const { transactions, clients, businessStats, business } = usePoints();
  const { user } = useAuth();
  
  // Estado para la configuración
  const [config, setConfig] = useState({
    montoMinimo: '',
    tipoPrograma: business?.NegocioTipoPS,
    porcentajePuntos: '',
    cantidadSellos: '',
    acumulable: false,
    observaciones: ''
  });

  // Efecto para establecer acumulable en true automáticamente si es programa de puntos
  useEffect(() => {
    if (config.tipoPrograma === 'P') {
      setConfig(prev => ({
        ...prev,
        acumulable: true
      }));
    }
  }, [config.tipoPrograma]);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  // Manejar cambios en los campos
  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Información del Negocio */}
      {business && (
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Panel de Control - {business.NegocioDesc || business.NegocioNombre}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Nombre del Negocio</p>
              <p className="text-lg font-bold">{business.NegocioDesc}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Propietario</p>
              <p className="text-lg font-bold">{business.NegocioNombre} {business.NegocioApellidos}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Vigencia</p>
              <p className="text-lg font-bold">{formatDate(business.NegocioVigencia)}</p>
            </div>
            <div className={`p-4 rounded-lg ${business.NegocioActivo === 1 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm">Estado</p>
              <p className={`text-lg font-bold ${business.NegocioActivo === 1 ? 'text-green-600' : 'text-red-600'}`}>
                {business.NegocioActivo === 1 ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas y Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Resumen de estadísticas */}
        <div className="bg-white rounded-lg shadow-xl p-6 col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Información del Negocio</h2>
          <div className="grid grid-cols-1 gap-4">            
            {business && (
              <>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Tipo de Programa</p>
                  <p className="text-2xl font-bold">
                    {business.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600">Miembro Desde</p>
                  <p className="text-lg font-bold">{formatDate(business.NegocioMiembro)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Componente de Configuración Separado */}
        <ProgramConfigForm 
          config={config} 
          onConfigChange={handleInputChange}
          business={business}
        />        
      </div>

      {/* Información del Usuario Admin */}
      <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Información del Administrador</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Usuario</p>
            <p className="text-lg font-bold">{user?.name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Rol</p>
            <p className="text-lg font-bold capitalize">{user?.role}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">ID Negocio</p>
            <p className="text-lg font-bold">{business?.NegocioId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPoints;
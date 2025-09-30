// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/BusinessInfoSidebar.jsx

const BusinessInfoSidebar = ({ business, showPreview }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-MX');
  };
  
  return (
    <div className="space-y-6">
      {business && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Negocio</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Nombre</p>
              <p className="font-medium text-blue-800">{business.NegocioDesc}</p>
            </div>
            <div>
              <p className="text-gray-500">Propietario</p>
              <p className="font-medium">{business.NegocioNombre} {business.NegocioApellidos}</p>
            </div>
            <div>
              <p className="text-gray-500">Vigencia</p>
              <p className="font-medium">{formatDate(business.NegocioVigencia)}</p>
            </div>
            <div>
              <p className="text-gray-500">Estado</p>
              <p className={`font-medium ${business.NegocioActivo === 1 ? 'text-green-600' : 'text-red-600'}`}>
                {business.NegocioActivo === 1 ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Consejos</h3>
        <div className="space-y-4 text-sm">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="font-medium text-orange-800 mb-2">Nombre atractivo</p>
            <p className="text-orange-700">Usa nombres llamativos que describan claramente la recompensa</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="font-medium text-blue-800 mb-2">Cantidad de {business?.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}</p>
            <p className="text-blue-700">Entre {business?.NegocioTipoPS === 'P' ? ' 80-120 puntos' : ' 5-15 sellos'}{' '}es lo ideal.</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="font-medium text-green-800 mb-2">Vigencia</p>
            <p className="text-green-700">Promociones de 30-90 días funcionan mejor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSidebar;
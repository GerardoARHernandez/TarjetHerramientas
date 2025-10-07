// src/apps/points-loyalty/components/admin/PromotionPreview.jsx
import { Star, Calendar, Gift, Award } from 'lucide-react';

const PromotionPreview = ({ formData, business }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!formData.CampaVigeFin) return null;
    const endDate = new Date(formData.CampaVigeFin);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Vista Previa</h3>
        <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-600">
          Cliente
        </div>
      </div>

      {/* Card como la vería el cliente */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
        
        {/* Header de la promoción */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-xl">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-800">
              {formData.CampaNombre || 'Nombre de la Promoción'}
            </h4>
            {daysRemaining !== null && daysRemaining > 0 && (
              <p className="text-xs text-blue-600 font-medium">
                {daysRemaining} días restantes
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {formData.CampaDesc || 'Descripción de la promoción aparecerá aquí...'}
          </p>
        </div>

        {/* Información de sellos/puntos */}
        <div className="bg-white/60 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{business?.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'} necesarios:</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-cyan-500" />
              <span className="font-bold text-cyan-600">
                {formData.CampaCantPSCanje || '0'}
              </span>
            </div>
          </div>
          
          {/* Simulación de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full w-3/5"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Progreso ejemplo: {business?.NegocioTipoPS === 'P' ? '60 Puntos de 100' : '6/10 Sellos'}</p>
        </div>

        {/* Recompensa */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Tu recompensa:</span>
          </div>
          <p className="font-bold text-green-800">
            {formData.CampaRecompensa || 'Recompensa aparecerá aquí'}
          </p>
        </div>

        {/* Vigencia */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Inicio: {formatDate(formData.CampaVigeInico)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Fin: {formatDate(formData.CampaVigeFin)}</span>
          </div>
        </div>
      </div>

      {/* Estado de la vista previa */}
      <div className="mt-4 text-center">
        {formData.CampaNombre && formData.CampaDesc && formData.CampaCantPSCanje && formData.CampaRecompensa ? (
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm">
            ✅ Vista previa completa
          </div>
        ) : (
          <div className="bg-cyan-50 text-cyan-700 px-3 py-2 rounded-xl text-sm">
            ⚠️ Completa el formulario para ver la vista previa
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>💡 Tip:</strong> Así verán los clientes tu promoción en su aplicación. 
          Asegúrate de que sea atractiva y clara.
        </p>
      </div>
    </div>
  );
};

export default PromotionPreview;
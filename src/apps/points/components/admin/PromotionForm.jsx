// src/apps/points-loyalty/components/admin/PromotionForm.jsx
import { Save, Calendar, Gift, FileText, Star, Award } from 'lucide-react';

const PromotionForm = ({business, formData, onChange, onSubmit, isSubmitting, isValid }) => {
  
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* Nombre de la Campaña */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Gift className="w-4 h-4 text-blue-500" />
          Nombre de la Promoción
        </label>
        <input
          type="text"
          name="CampaNombre"
          value={formData.CampaNombre}
          onChange={handleChange}
          placeholder="ej. PAPAS A LA FRANCESA"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        />
        <p className="text-xs text-gray-500">Nombre atractivo que aparecerá en la app del cliente</p>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FileText className="w-4 h-4 text-blue-500" />
          Descripción
        </label>
        <textarea
          name="CampaDesc"
          value={formData.CampaDesc}
          onChange={handleChange}
          placeholder="ej. RECIBE UNAS PAPAS GRATIS AL JUNTAR 10 SELLOS"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
          required
        />
        <p className="text-xs text-gray-500">Describe claramente cómo obtener la recompensa</p>
      </div>

      {/* Fechas de Vigencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 text-green-500" />
            Fecha de Inicio
          </label>
          <input
            type="date"
            name="CampaVigeInico"
            value={formData.CampaVigeInico}
            onChange={handleChange}
            min={today}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 text-red-500" />
            Fecha de Fin
          </label>
          <input
            type="date"
            name="CampaVigeFin"
            value={formData.CampaVigeFin}
            onChange={handleChange}
            min={formData.CampaVigeInico || today}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
      </div>

      {/* Cantidad de Sellos/Puntos y Recompensa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Star className="w-4 h-4 text-cyan-500" />
            {business?.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'} Requeridos
          </label>
          <input
            type="number"
            name="CampaCantPSCanje"
            value={formData.CampaCantPSCanje}
            onChange={handleChange}
            placeholder="10"
            min="1"
            max="50"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
          <p className="text-xs text-gray-500">Entre {business?.NegocioTipoPS === 'P' ? ' 80-120 puntos' : ' 5-15 sellos'}{' '} es lo recomendado</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Award className="w-4 h-4 text-purple-500" />
            Recompensa
          </label>
          <input
            type="text"
            name="CampaRecompensa"
            value={formData.CampaRecompensa}
            onChange={handleChange}
            placeholder="ej. PAPAS Gratis"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
          <p className="text-xs text-gray-500">Describe específicamente qué recibirá el cliente</p>
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3
            ${isValid && !isSubmitting
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creando Promoción...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Crear Promoción
            </>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200">
        <p className="text-sm text-cyan-800">
          <strong>📋 Importante:</strong> Una vez creada, la promoción estará disponible 
          inmediatamente para los clientes. Asegúrate de que toda la información sea correcta.
        </p>
      </div>
    </form>
  );
};

export default PromotionForm;
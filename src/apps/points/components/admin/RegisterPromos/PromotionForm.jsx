// src/apps/points-loyalty/components/admin/PromotionForm.jsx
import { Save, Calendar, Gift, FileText, Star, Award, Image as ImageIcon, X, Loader } from 'lucide-react';

const PromotionForm = ({
  business,
  formData,
  onChange,
  onImageChange,
  onRemoveImage,
  imageFile,
  imagePreview,
  onSubmit,
  isSubmitting,
  isUploadingImage,
  isValid
}) => {
  
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.includes('webp') && !file.type.includes('jpeg') && !file.type.includes('png') && !file.type.includes('jpg')) {
        alert('Formato de imagen no válido. Por favor sube JPG, PNG o WEBP');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          disabled={isSubmitting || isUploadingImage}
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
          placeholder={`ej. RECIBE UNAS PAPAS GRATIS AL JUNTAR ${business?.NegocioTipoPS === 'P' ? '80 Puntos' : '10 Sellos'}`}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
          required
          disabled={isSubmitting || isUploadingImage}
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
            disabled={isSubmitting || isUploadingImage}
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
            disabled={isSubmitting || isUploadingImage}
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
            placeholder={`${business?.NegocioTipoPS === 'P' ? '80' : '10'}`}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
            disabled={isSubmitting || isUploadingImage}
          />
          <p className="text-xs text-gray-500">Entre {business?.NegocioTipoPS === 'P' ? '80-120 puntos' : '5-15 sellos'}{' '} es lo recomendado</p>
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
            disabled={isSubmitting || isUploadingImage}
          />
          <p className="text-xs text-gray-500">Describe específicamente qué recibirá el cliente</p>
        </div>
      </div>

      {/* Sección de Imagen - Para todos los negocios */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-700">
            Imagen de la Promoción (Opcional)
          </label>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors duration-200">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  disabled={isSubmitting || isUploadingImage}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {imageFile?.name} ({(imageFile?.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Recomendado: 400x400px, formato JPG, PNG o WEBP (máx. 5MB)
              </p>
            </>
          )}
          
          <input
            type="file"
            id="promotion-image"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageChange}
            className="hidden"
            disabled={isSubmitting || isUploadingImage}
          />
          <label
            htmlFor="promotion-image"
            className={`inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200 text-sm font-medium
              ${(isSubmitting || isUploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
          </label>
        </div>
        
        {isUploadingImage && (
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Loader className="w-4 h-4 animate-spin" />
            Subiendo imagen...
          </div>
        )}
      </div>

      {/* Botón de Envío */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting || isUploadingImage}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3
            ${isValid && !isSubmitting && !isUploadingImage
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isSubmitting || isUploadingImage ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {isUploadingImage ? 'Subiendo imagen...' : 'Creando Promoción...'}
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
          inmediatamente para los clientes. Si seleccionaste una imagen, se subirá automáticamente
          después de crear la campaña.
        </p>
      </div>
    </form>
  );
};

export default PromotionForm;
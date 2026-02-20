// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/EditCampaignModal.jsx
import { useState } from 'react';
import { X, Save, Calendar, Gift, FileText, Star, Award, Loader, Image as ImageIcon, Upload } from 'lucide-react';

const EditCampaignModal = ({ campaign, business, onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        CampaNombre: campaign.CampaNombre || '',
        CampaDesc: campaign.CampaDesc || '',
        CampaVigeInico: campaign.CampaVigeInico || '',
        CampaVigeFin: campaign.CampaVigeFin || '',
        CampaCantPSCanje: campaign.CampaCantPSCanje || '',
        CampaRecompensa: campaign.CampaRecompensa || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Función para verificar si una fecha es anterior a hoy
    const isPastDate = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date(today);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Función para convertir archivo a base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Eliminar el prefijo "data:image/xxx;base64," para obtener solo el string base64
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.includes('webp') && !file.type.includes('jpeg') && !file.type.includes('png') && !file.type.includes('jpg')) {
                setError('Formato de imagen no válido. Por favor sube JPG, PNG o WEBP');
                return;
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }

            setImageFile(file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para subir la imagen 
const uploadImage = async (campaId) => {
    if (!imageFile) return;

    setIsUploadingImage(true);
    try {
        const base64String = await convertToBase64(imageFile);
        
        // Usar la extensión original
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `campana_${campaId}_${Date.now()}.${fileExtension}`;

        const payload = {
            CampaId: parseInt(campaId),
            Base64File: base64String,
            FileName: fileName
        };

        // IMPORTANTE: Usar HTTP en desarrollo (no HTTPS)
        const url = 'http://souvenir-site.com/WebPuntos/API1/images/Campanias/';

        console.log('Enviando imagen a:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('No se pudo parsear JSON:', responseText);
            throw new Error(`Respuesta no válida del servidor: ${responseText.substring(0, 100)}`);
        }

        if (data.error) {
            throw new Error(data.Mensaje || 'Error al subir la imagen');
        }

        setUploadSuccess(true);
        console.log('Imagen subida exitosamente:', data);
        
    } catch (err) {
        console.error('Error uploading image:', err);
        setError(`Error al subir la imagen: ${err.message}`);
        throw err;
    } finally {
        setIsUploadingImage(false);
    }
};

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setUploadSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.CampaNombre || !formData.CampaDesc || !formData.CampaVigeInico || 
            !formData.CampaVigeFin || !formData.CampaCantPSCanje || !formData.CampaRecompensa) {
            setError('Todos los campos son obligatorios');
            return;
        }

        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if (new Date(formData.CampaVigeFin) < new Date(formData.CampaVigeInico)) {
            setError('La fecha de fin no puede ser anterior a la fecha de inicio');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setUploadSuccess(false);

        try {
            // Primero actualizamos los datos de la campaña
            const payload = {
                campaId: parseInt(campaign.CampaId),
                ListCampa: {
                    NegocioId: business.NegocioId,
                    CampaNombre: formData.CampaNombre,
                    CampaDesc: formData.CampaDesc,
                    CampaVigeInico: formData.CampaVigeInico,
                    CampaVigeFin: formData.CampaVigeFin,
                    CampaCantPSCanje: parseInt(formData.CampaCantPSCanje),
                    CampaRecompensa: formData.CampaRecompensa
                }
            };

            const response = await fetch('https://souvenir-site.com/WebPuntos/API1/ModificarCampana', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.Mensaje || 'Error al actualizar la campaña');
            }

            if (data.error) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            // Si hay una imagen seleccionada y es el negocio correcto, subirla
            if (imageFile && business?.NegocioId == 3) {
                await uploadImage(campaign.CampaId);
            }

            // Éxito - Todo se completó correctamente
            onUpdateSuccess();

        } catch (err) {
            console.error('Error updating campaign:', err);
            setError(err.message || 'Error al actualizar la campaña');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.CampaNombre && formData.CampaDesc && 
                       formData.CampaVigeInico && formData.CampaVigeFin && 
                       formData.CampaCantPSCanje && formData.CampaRecompensa;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header - sin cambios */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-2 rounded-xl">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Editar Campaña</h2>
                            <p className="text-sm text-gray-600">ID: {campaign.CampaId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                            <p className="text-green-800 text-sm">✓ Imagen subida exitosamente</p>
                        </div>
                    )}

                    {/* Información sobre fechas pasadas */}
                    {(isPastDate(formData.CampaVigeInico) || isPastDate(formData.CampaVigeFin)) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>⚠️ Atención:</strong> Esta campaña contiene fechas pasadas. 
                                Puedes editarla, pero ten en cuenta que podría afectar su visibilidad para los clientes.
                            </p>
                        </div>
                    )}

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
                        />
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                required
                            />
                            {isPastDate(formData.CampaVigeInico) && (
                                <p className="text-xs text-yellow-600">
                                    ⚠️ Fecha de inicio en el pasado
                                </p>
                            )}
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
                                min={formData.CampaVigeInico}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                required
                            />
                            {isPastDate(formData.CampaVigeFin) && (
                                <p className="text-xs text-yellow-600">
                                    ⚠️ Fecha de fin en el pasado
                                </p>
                            )}
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
                            />
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
                        </div>
                    </div>

                    {/* Sección de Imagen - Solo para NegocioId == 3 */}
                    {business?.NegocioId == 3 && (
                        <div className="space-y-2 pt-4 border-t border-gray-200">
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
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Haz clic para agregar o cambiar la imagen
                                        </p>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Recomendado: 400x400px, formato JPG, PNG o WEBP (máx. 5MB)
                                        </p>
                                    </>
                                )}
                                
                                <input
                                    type="file"
                                    id="edit-promotion-image"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={isSubmitting || isUploadingImage}
                                />
                                <label
                                    htmlFor="edit-promotion-image"
                                    className={`inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200 text-sm font-medium
                                        ${(isSubmitting || isUploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {imagePreview ? 'Cambiar Imagen' : 'Agregar Imagen'}
                                </label>
                            </div>
                            
                            {isUploadingImage && (
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Subiendo imagen...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Nota:</strong> Puedes editar campañas con fechas pasadas para 
                            corregir información histórica o reactivar promociones.
                            {business?.NegocioId == 3 && (
                                <span className="block mt-1">
                                    <strong>✨ Nueva función:</strong> Ahora puedes agregar o actualizar la imagen de tus promociones. 
                                    La imagen se subirá automáticamente al guardar los cambios.
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                            disabled={isSubmitting || isUploadingImage}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting || isUploadingImage}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2
                                ${isFormValid && !isSubmitting && !isUploadingImage
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting || isUploadingImage ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    {isUploadingImage ? 'Subiendo imagen...' : 'Actualizando...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Actualizar Campaña
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;
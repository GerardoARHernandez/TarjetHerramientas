// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/EditCampaignModal.jsx
import { useState } from 'react';
import { X, Save, Calendar, Gift, FileText, Star, Award, Loader } from 'lucide-react';

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
    const [error, setError] = useState('');

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

        try {
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

            // Éxito
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
                {/* Header */}
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
                                // Remover la restricción min={today} para permitir fechas pasadas
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
                                // Solo validar que no sea menor que la fecha de inicio
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
                                max="200"
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

                    {/* Información adicional */}
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Nota:</strong> Puedes editar campañas con fechas pasadas para 
                            corregir información histórica o reactivar promociones.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2
                                ${isFormValid && !isSubmitting
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Actualizando...
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
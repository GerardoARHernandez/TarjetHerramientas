// src/apps/points-loyalty/views/admin/RegisterPromotion.jsx
import { useState } from 'react';
import { Gift, Plus, Calendar, Star, Save, AlertCircle } from 'lucide-react';
import PromotionForm from '../../components/admin/PromotionForm';
import PromotionPreview from '../../components/admin/PromotionPreview';
import LoadingSpinner from '../../components/LoadingSpinner';

const RegisterPromotion = () => {
  const [formData, setFormData] = useState({
    NegocioId: 1, // Este debería venir del contexto o ser seleccionado
    CampaNombre: '',
    CampaDesc: '',
    CampaVigeInico: '',
    CampaVigeFin: '',
    CampaCantPSCanje: '',
    CampaRecompensa: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar estado de envío cuando el usuario edite
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validación básica
      if (!formData.CampaNombre || !formData.CampaDesc || !formData.CampaVigeInico || 
          !formData.CampaVigeFin || !formData.CampaCantPSCanje || !formData.CampaRecompensa) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Simular llamada a API
      const payload = {
        ListCampa: {
          ...formData,
          CampaCantPSCanje: parseInt(formData.CampaCantPSCanje)
        }
      };

      console.log('Enviando promoción:', payload);
      
      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay

      setSubmitStatus('success');
      
      // Limpiar formulario después de éxito
      setTimeout(() => {
        setFormData({
          NegocioId: 1,
          CampaNombre: '',
          CampaDesc: '',
          CampaVigeInico: '',
          CampaVigeFin: '',
          CampaCantPSCanje: '',
          CampaRecompensa: ''
        });
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error al crear promoción:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.CampaNombre && formData.CampaDesc && 
                     formData.CampaVigeInico && formData.CampaVigeFin && 
                     formData.CampaCantPSCanje && formData.CampaRecompensa;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Promoción</h1>
              <p className="text-gray-600 mt-1">Configura una nueva campaña de recompensas</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promociones Activas</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Star className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canjes Este Mes</p>
                  <p className="text-2xl font-bold text-green-600">127</p>
                </div>
                <Gift className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div> */}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Información de la Promoción</h2>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    {showPreview ? 'Ocultar' : 'Vista Previa'}
                  </button>
                </div>
              </div>

              <PromotionForm 
                formData={formData} 
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isValid={isFormValid}
              />

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="bg-green-200 rounded-full p-1">
                      <Save className="w-4 h-4" />
                    </div>
                    <p className="font-medium">¡Promoción creada exitosamente!</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Error al crear la promoción. Intenta nuevamente.</p>
                  </div>
                </div>
              )}

              {isSubmitting && (
                <div className="mt-6">
                  <LoadingSpinner message="Creando promoción..." />
                </div>
              )}
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            {showPreview && (
              <div className="sticky top-8">
                <PromotionPreview formData={formData} />
              </div>
            )}
            
            {!showPreview && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Consejos</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-orange-50 rounded-xl p-4 border border-blue-100">
                    <p className="font-medium text-blue-800 mb-2">Nombre atractivo</p>
                    <p className="text-blue-700">Usa nombres llamativos que describan claramente la recompensa</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="font-medium text-blue-800 mb-2">Cantidad de Sellos</p>
                    <p className="text-blue-700">Entre 5-15 sellos es lo ideal para mantener el engagement</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="font-medium text-green-800 mb-2">Vigencia</p>
                    <p className="text-green-700">Promociones de 30-90 días funcionan mejor</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPromotion;
// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/CreateCampaignForm.jsx
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PromotionForm from './PromotionForm';
import PromotionPreview from './PromotionPreview';
import LoadingSpinner from '../../LoadingSpinner';
import { AlertCircle, Save } from 'lucide-react';

const CreateCampaignForm = ({ business, onCampaignCreated, showPreview, onTogglePreview }) => {
  const [formData, setFormData] = useState({
    NegocioId: business?.NegocioId || '',
    CampaNombre: '',
    CampaDesc: '',
    CampaVigeInico: '',
    CampaVigeFin: '',
    CampaCantPSCanje: '',
    CampaRecompensa: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!business?.NegocioId) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validación básica
      if (!formData.CampaNombre || !formData.CampaDesc || !formData.CampaVigeInico || 
          !formData.CampaVigeFin || !formData.CampaCantPSCanje || !formData.CampaRecompensa) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Preparar payload para la API
      const payload = {
        ListCampa: {
          ...formData,
          NegocioId: business.NegocioId,
          CampaCantPSCanje: parseInt(formData.CampaCantPSCanje)
        }
      };

      // Llamada real a la API
      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/GeneraCampana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Mensaje || 'Error al crear la campaña');
      }

      if (data.error) {
        throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
      }

      setSubmitStatus('success');
      
      // Recargar las campañas y limpiar formulario
      setTimeout(() => {
        onCampaignCreated();
        setFormData({
          NegocioId: business.NegocioId,
          CampaNombre: '',
          CampaDesc: '',
          CampaVigeInico: '',
          CampaVigeFin: '',
          CampaCantPSCanje: '',
          CampaRecompensa: ''
        });
        setSubmitStatus(null);
      }, 2000);

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
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Crear Nueva Promoción</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onTogglePreview}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
          </button>
          <button
            type="button"
            onClick={onCampaignCreated}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="mb-6">
          <PromotionPreview formData={formData} business={business} />
        </div>
      )}

      <PromotionForm 
        business={business}
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
  );
};

export default CreateCampaignForm;
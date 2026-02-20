// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/CreateCampaignForm.jsx
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PromotionForm from './PromotionForm';
import PromotionPreview from './PromotionPreview';
import LoadingSpinner from '../../LoadingSpinner';
import { AlertCircle, Save, CheckCircle, XCircle } from 'lucide-react';

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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [createdCampaignId, setCreatedCampaignId] = useState(null);
  const [imageUploadStatus, setImageUploadStatus] = useState(null); // 'success', 'error', null
  const [imageUrl, setImageUrl] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleImageChange = (file, preview) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUploadStatus(null);
    setImageUrl(null);
  };

  // Función para convertir archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Función para subir la imagen
  const uploadImage = async (campaId) => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    setImageUploadStatus(null);
    
    try {
      const base64String = await convertToBase64(imageFile);
      
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `campana_${campaId}_${Date.now()}.${fileExtension}`;

      const payload = {
        CampaId: parseInt(campaId),
        Base64File: base64String,
        FileName: fileName
      };

      // Detectar entorno automáticamente
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      const protocol = isDevelopment ? 'http' : 'https';
      const url = `${protocol}://souvenir-site.com/WebPuntos/API1/images/Campanias/`;

      console.log('Subiendo imagen a:', url);
      
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
        throw new Error(`Respuesta no válida del servidor: ${responseText.substring(0, 100)}`);
      }

      if (data.error) {
        throw new Error(data.Mensaje || 'Error al subir la imagen');
      }

      // Obtener la URL de la imagen desde la API de listado
      const imageUrl = await getCampaignImageUrl(campaId);
      
      setImageUploadStatus('success');
      setImageUrl(imageUrl);
      
      return {
        success: true,
        imageUrl: imageUrl
      };
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setImageUploadStatus('error');
      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Función para obtener la URL de la imagen de la campaña
  const getCampaignImageUrl = async (campaId) => {
    try {
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      const protocol = isDevelopment ? 'http' : 'https';
      const url = `${protocol}://souvenir-site.com/WebPuntos/API1/Campanias/negocioid/${business.NegocioId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.ListCampanias) {
        const campaign = data.ListCampanias.find(c => parseInt(c.CampaId) === parseInt(campaId));
        if (campaign && campaign.URLImagen) {
          return campaign.URLImagen;
        }
      }
      return null;
    } catch (err) {
      console.error('Error obteniendo URL de imagen:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!business?.NegocioId) {
      setSubmitStatus('error');
      return;
    }

    // Validación básica
    if (!formData.CampaNombre || !formData.CampaDesc || !formData.CampaVigeInico || 
        !formData.CampaVigeFin || !formData.CampaCantPSCanje || !formData.CampaRecompensa) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setImageUploadStatus(null);
    setImageUrl(null);

    try {
      // PASO 1: Crear la campaña
      const payload = {
        ListCampa: {
          ...formData,
          NegocioId: business.NegocioId,
          CampaCantPSCanje: parseInt(formData.CampaCantPSCanje)
        }
      };

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

      // Obtener el ID de la campaña creada (ajusta según lo que devuelva tu API)
      // Si la API no devuelve el ID, necesitamos consultar el listado
      let campaignId = data.CampaId;
      
      if (!campaignId) {
        // Si no viene el ID, obtenemos la última campaña creada
        campaignId = await getLastCreatedCampaignId();
      }

      setCreatedCampaignId(campaignId);

      // PASO 2: Subir la imagen si existe
      if (imageFile && campaignId) {
        await uploadImage(campaignId);
      }

      setSubmitStatus('success');
      
      // Recargar las campañas y limpiar formulario después de 3 segundos
      setTimeout(() => {
        onCampaignCreated();
        // Limpiar formulario
        setFormData({
          NegocioId: business.NegocioId,
          CampaNombre: '',
          CampaDesc: '',
          CampaVigeInico: '',
          CampaVigeFin: '',
          CampaCantPSCanje: '',
          CampaRecompensa: ''
        });
        handleRemoveImage(); // Limpiar imagen
        setCreatedCampaignId(null);
        setSubmitStatus(null);
        setImageUploadStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error al crear promoción:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función auxiliar para obtener el ID de la última campaña creada
  const getLastCreatedCampaignId = async () => {
    try {
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      const protocol = isDevelopment ? 'http' : 'https';
      const url = `${protocol}://souvenir-site.com/WebPuntos/API1/Campanias/negocioid/${business.NegocioId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.ListCampanias && data.ListCampanias.length > 0) {
        // Ordenar por ID descendente y tomar el primero
        const sorted = data.ListCampanias.sort((a, b) => parseInt(b.CampaId) - parseInt(a.CampaId));
        return sorted[0].CampaId;
      }
      return null;
    } catch (err) {
      console.error('Error obteniendo última campaña:', err);
      return null;
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
          <PromotionPreview 
            formData={formData} 
            business={business} 
            imagePreview={imagePreview}
          />
        </div>
      )}

      <PromotionForm 
        business={business}
        formData={formData} 
        onChange={handleInputChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isUploadingImage={isUploadingImage}
        isValid={isFormValid}
      />

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-green-800">
            <div className="bg-green-200 rounded-full p-1">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">¡Promoción creada exitosamente!</p>
              {createdCampaignId && (
                <p className="text-sm text-green-600 mt-1">ID: {createdCampaignId}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {imageUploadStatus === 'success' && imageUrl && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-purple-800">
            <div className="bg-purple-200 rounded-full p-1">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">✓ Imagen subida correctamente</p>
              <p className="text-xs text-purple-600 mt-1 break-all">{imageUrl}</p>
            </div>
          </div>
        </div>
      )}

      {imageUploadStatus === 'error' && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-orange-800">
            <XCircle className="w-5 h-5" />
            <p className="font-medium">La campaña se creó pero hubo un error al subir la imagen</p>
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

      {(isSubmitting || isUploadingImage) && (
        <div className="mt-6">
          <LoadingSpinner 
            message={isUploadingImage ? "Subiendo imagen..." : "Creando promoción..."} 
          />
        </div>
      )}
    </div>
  );
};

export default CreateCampaignForm;
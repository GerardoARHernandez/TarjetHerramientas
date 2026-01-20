import { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useAuth } from '../../../../contexts/AuthContext';
import ClientSearch from '../../components/admin/ClientSearch';
import { Gift, AlertCircle, CheckCircle, Coins, RefreshCw } from 'lucide-react';
import Footer from '../../components/Footer';

const RedeemPromo = () => {
  const [formData, setFormData] = useState({ 
    clientId: '',
    campaignId: '',
    reference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { business, campaigns, isLoading, refreshData } = useBusiness();
  const { user } = useAuth();

  // Filtrar campañas activas EN EL COMPONENTE (CampaActiva === 'S')
  const activeCampaigns = campaigns.filter(campaign => 
    campaign.CampaActiva === 'S'
  );

  // Función para generar referencia automática
  const generateReference = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CANJE-${random}`;
  };

  // Inicializar referencia al montar el componente
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      reference: generateReference()
    }));
  }, []);

  const handleClientsUpdate = useCallback((clientsList) => {
    setClients(clientsList);
  }, []);

  const handleClientSelect = useCallback((clientId) => {
    setFormData(prev => ({ ...prev, clientId }));
    setApiResponse(null);
    setIsSuccess(false);
  }, []);

  const handleCampaignChange = (campaignId) => {
    setFormData(prev => ({ ...prev, campaignId }));
    setApiResponse(null);
    setIsSuccess(false);
  };

  const handleReferenceChange = (reference) => {
    setFormData(prev => ({ ...prev, reference }));
  };

  const selectedClient = clients.find(client => client.id.toString() === formData.clientId);
  const selectedCampaign = activeCampaigns.find(campaign => 
    campaign.CampaId === formData.campaignId
  );

  const canSubmit = formData.clientId && formData.campaignId && formData.reference && business;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    setIsSubmitting(true);
    setApiResponse(null);
    setIsSuccess(false);

    try {
      const transactionData = {
        ListTransaccion: {
          UsuarioId: parseInt(formData.clientId),
          NegocioId: parseInt(business?.NegocioId),
          CampaId: parseInt(formData.campaignId),
          TransaccionNoReferen: formData.reference
        }
      };

      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/CanjePuntos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();
      console.log('✅ Respuesta de canje:', result);

      setApiResponse(result);
      setIsSuccess(!result.error);

      if (!result.error && result.TransaccionId) {
        // Éxito - limpiar formulario y generar nueva referencia
        setFormData(prev => ({
          clientId: '',
          campaignId: '',
          reference: generateReference()
        }));
        
        // Recargar datos para actualizar información
        refreshData();
      }

    } catch (error) {
      console.error('❌ Error al canjear promoción:', error);
      setApiResponse({
        error: true,
        Mensaje: 'Error de conexión al procesar el canje'
      });
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      campaignId: '',
      reference: generateReference()
    });
    setApiResponse(null);
    setIsSuccess(false);
  };

  const handleRefreshData = () => {
    refreshData();
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-2 py-8">
        {/* Header */}
        <div className="text-center mb-0">
          <div className="inline-flex items-center gap-16 bg-purple-50 px-12 py-3 rounded-2xl border border-purple-200 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-950">Canje de Promociones</h2>
              <p className="text-gray-600 text-sm">Canjea puntos o sellos por recompensas</p>
            </div>

          </div>          
            {business?.NegocioDesc && (
              <div className="">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Negocio:</span> {business.NegocioDesc}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {business.NegocioId} | Campañas: {campaigns.length} total, {activeCampaigns.length} activas
                </p>
              </div>
            )}
        </div>

        {/* Botón de recarga */}
        <div className="flex justify-end mb-1">
          <button
            onClick={handleRefreshData}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Cargando...' : 'Recargar Datos'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Cliente
              </label>
              <ClientSearch
                selectedClientId={formData.clientId}
                onClientSelect={handleClientSelect}
                onClientsUpdate={handleClientsUpdate}
              />
            </div>

            {/* Selección de campaña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Promoción
              </label>
              <select
                value={formData.campaignId}
                onChange={(e) => handleCampaignChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                required
                disabled={isLoading}
              >
                <option value="">Selecciona una promoción</option>
                {activeCampaigns.map(campaign => (
                  <option key={campaign.CampaId} value={campaign.CampaId}>
                    {campaign.CampaNombre} - {campaign.CampaCantPSCanje} {campaign.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
                  </option>
                ))}
              </select>
              
              {isLoading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">Cargando campañas...</p>
                </div>
              )}
              
              {!isLoading && activeCampaigns.length === 0 && campaigns.length > 0 && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No hay promociones activas disponibles
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Hay {campaigns.length} campaña(s) en total, pero ninguna está activa (CampaActiva: "S").
                  </p>
                </div>
              )}
              
              {!isLoading && campaigns.length === 0 && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No se encontraron campañas para este negocio
                  </p>
                </div>
              )}
              
              {!isLoading && activeCampaigns.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {activeCampaigns.length} promoción(es) activa(s) disponible(s)
                </p>
              )}
            </div>

            {/* Información de la campaña seleccionada */}
            {selectedCampaign && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Detalles de la Promoción
                </h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <div>
                    <strong>Recompensa:</strong> {selectedCampaign.CampaRecompensa}
                  </div>
                  <div>
                    <strong>Descripción:</strong> {selectedCampaign.CampaDesc}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      <span>
                        <strong>Costo:</strong> {selectedCampaign.CampaCantPSCanje} {selectedCampaign.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
                      </span>
                    </div>
                    <div>
                      <strong>Vigencia:</strong> {new Date(selectedCampaign.CampaVigeInico).toLocaleDateString()} - {new Date(selectedCampaign.CampaVigeFin).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia del Canje
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleReferenceChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Referencia única para el canje"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Esta referencia identificará el canje en el sistema
              </p>
            </div>

            {/* Información del cliente seleccionado */}
            {selectedClient && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Cliente Listo para Canjear
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div><strong>Nombre:</strong> {selectedClient.name}</div>
                  <div><strong>Teléfono:</strong> {selectedClient.phone}</div>
                  {selectedClient.email && (
                    <div><strong>Email:</strong> {selectedClient.email}</div>
                  )}
                  {selectedClient.id && (
                    <div><strong>ID Cliente:</strong> {selectedClient.id}</div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Limpiar Formulario
              </button>
              
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting || activeCampaigns.length === 0}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando Canje...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Canjear Promoción
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Respuesta de la API */}
          {apiResponse && (
            <div className={`mb-6 p-4 mt-6 rounded-lg border ${
              isSuccess 
                ? 'bg-green-100 border-green-200 text-green-800' 
                : 'bg-red-100 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-3">
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{apiResponse.Mensaje}</p>
                  {apiResponse.TransaccionId > 0 && (
                    <div className="mt-2">
                      <span className="block font-semibold text-lg text-green-900">¡Promoción Canjeada Exitosamente!</span>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm">
                          <span className="font-medium">Transacción ID:</span> <strong className="text-green-900">{apiResponse.TransaccionId}</strong>
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Referencia: {formData.reference} 
                        </p>
                      </div>
                    </div>
                  )}
                  {apiResponse.error && apiResponse.details && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                      <p className="font-medium">Detalles del error:</p>
                      <p className="text-red-700">{apiResponse.details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </>
  );
};

export default RedeemPromo;
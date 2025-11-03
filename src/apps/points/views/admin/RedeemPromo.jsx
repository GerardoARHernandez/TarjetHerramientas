import { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useAuth } from '../../../../contexts/AuthContext';
import ClientSearch from '../../components/admin/ClientSearch';
import { Gift, AlertCircle, CheckCircle, Coins } from 'lucide-react';

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
  
  const { business, activeCampaigns, isLoading: businessLoading } = useBusiness();
  const { user } = useAuth();

  // Función para generar referencia automática
  const generateReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CANJE-${timestamp}-${random}`;
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

  const canSubmit = formData.clientId && formData.campaignId && formData.reference;

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

      console.log('Enviando canje a la API:', transactionData);

      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/CanjePuntos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();
      console.log('Respuesta de canje:', result);

      setApiResponse(result);
      setIsSuccess(!result.error);

      if (!result.error && result.TransaccionId) {
        // Éxito - limpiar formulario y generar nueva referencia
        setFormData(prev => ({
          clientId: '',
          campaignId: '',
          reference: generateReference()
        }));
      }

    } catch (error) {
      console.error('Error al canjear promoción:', error);
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

  return (
    <div className="max-w-3xl mx-auto px-2 py-8">
      {/* Header */}
      <div className="text-center mb-8">
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
          <p className="text-sm text-gray-500">
            Negocio: {business.NegocioDesc}
          </p>
        )}
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
                    >
                    <option value="">Selecciona una promoción</option>
                    {activeCampaigns.map(campaign => (
                        <option key={campaign.CampaId} value={campaign.CampaId}>
                        {campaign.CampaNombre} - {campaign.CampaCantPSCanje} {campaign.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
                        </option>
                    ))}
                    </select>
                    
                    {businessLoading && (
                    <p className="text-sm text-gray-500 mt-1">Cargando promociones...</p>
                    )}
                    
                    {activeCampaigns.length === 0 && !businessLoading && (
                    <p className="text-sm text-amber-600 mt-1">
                        No hay promociones activas disponibles para canjear.
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
                            <div className="flex items-center gap-4">
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
                        <div className="text-sm text-green-700">
                            <div><strong>Nombre:</strong> {selectedClient.name}</div>
                            <div><strong>Teléfono:</strong> {selectedClient.phone}</div>
                            {selectedClient.email && (
                            <div><strong>Email:</strong> {selectedClient.email}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-4 pt-4">
                    <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSubmitting}
                    >
                    Limpiar
                    </button>
                    
                    <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                    {isSubmitting ? (
                        <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
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
            <div className={`mb-6 p-4 mt-3 rounded-lg border ${
                isSuccess 
                ? 'bg-green-100 border-green-200 text-green-800' 
                : 'bg-red-100 border-red-200 text-red-800'
            }`}>
                <div className="flex items-center gap-3">
                    {isSuccess ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                        <p className="font-medium">{apiResponse.Mensaje}</p>
                        {apiResponse.TransaccionId > 0 && (
                            <span className="block mt-1 font-semibold text-lg">¡Promoción Canjeada Exitosamente!
                                <p className="text-sm mt-1">
                                    Transacción ID: <strong>{apiResponse.TransaccionId}</strong>
                                </p>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>

      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Información importante
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• El cliente debe tener los puntos o sellos suficientes para canjear la promoción</li>
          <li>• Las promociones mostradas son las activas y vigentes</li>
          <li>• El canje es irreversible una vez procesado</li>
          <li>• La referencia se genera automáticamente pero puedes modificarla</li>
        </ul>
      </div>
    </div>
  );
};

export default RedeemPromo;
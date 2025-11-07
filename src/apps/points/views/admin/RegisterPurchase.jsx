// src/apps/admin-puntos/views/RegisterPurchase.jsx
import { useState, useEffect, useCallback } from 'react';
import { usePoints } from '../../../../contexts/PointsContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusinessRules } from '../../../../hooks/useBusinessRules';
import { Coins, Stamp } from 'lucide-react';
import PointsForm from '../../components/admin/RegisterPurchase/PointsForm';
import StampsForm from '../../components/admin/RegisterPurchase/StampsForm';
import ClientSearch from '../../components/admin/ClientSearch';
import BusinessStats from '../../components/admin/RegisterPurchase/BusinessStats';
import Footer from '../../components/Footer';

export const RegisterPurchase = () => {
  const [formData, setFormData] = useState({ 
    clientId: '',
    amount: '',
    stamps: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [validationError, setValidationError] = useState('');
  
  const { addTransaction, addStamp } = usePoints();
  const { business } = useAuth();
  
  // Obtener reglas de negocio
  const { rules, loading: rulesLoading } = useBusinessRules(business?.NegocioId);

  // Determinar el tipo de sistema del negocio
  const businessType = business?.NegocioTipoPS; // 'P' para puntos, 'S' para sellos
  const isPointsSystem = businessType === 'P';
  const isStampsSystem = businessType === 'S';

  // Función para limpiar completamente los formularios
  const clearForms = () => {
    setFormData({ 
      clientId: '', 
      amount: '', 
      stamps: 1 
    });
    setValidationError('');
  };

  // Función para validar monto mínimo
  const validateMinimumAmount = (amount) => {
    if (!rules || !rules.ReglasMontoMinimo) return true;
    
    const minAmount = parseFloat(rules.ReglasMontoMinimo);
    const purchaseAmount = parseFloat(amount);
    
    if (purchaseAmount < minAmount) {
      setValidationError(`El monto mínimo de compra es $${minAmount.toFixed(2)}`);
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // Función para calcular puntos según reglas
  const calculatePoints = (amount) => {
    if (!rules || !rules.ReglasPorcentaje) {
      // Valor por defecto si no hay reglas
      return Math.floor(amount * 0.1);
    }
    
    const percentage = parseFloat(rules.ReglasPorcentaje) / 100;
    return Math.floor(amount * percentage);
  };

  // Función para calcular sellos según reglas
  const calculateStamps = (amount) => {
    if (!rules || !rules.ReglasMontoMinimo) {
      return 1; // Valor por defecto
    }
    
    const minAmount = parseFloat(rules.ReglasMontoMinimo);
    const purchaseAmount = parseFloat(amount);
    
    // Si no es acumulable, solo 1 sello
    if (!rules.ReglasAcumulable) {
      return 1;
    }
    
    // Si es acumulable, calcular según monto mínimo
    return Math.floor(purchaseAmount / minAmount);
  };

  // Usar useCallback para estabilizar la función
  const handleClientsUpdate = useCallback((clientsList) => {
    setClients(clientsList);
  }, []);

  // Usar useCallback para estabilizar la función
  const handleClientSelect = useCallback((clientId) => {
    setFormData(prev => ({ ...prev, clientId }));
    setValidationError(''); // Limpiar error al cambiar cliente
  }, []);

  // Obtener el cliente seleccionado
  const selectedClient = clients.find(client => client.id.toString() === formData.clientId);

  // Función para generar un folio único
  const generateFolio = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FOL-${timestamp}-${random}`;
  };

  const handlePointsSubmit = async (amount, client) => {
    if (!client) return;
    
    // Validar monto mínimo
    if (!validateMinimumAmount(amount)) {
      return;
    }
    
    setIsSubmitting(true);
    setValidationError('');

    try {
      const points = calculatePoints(amount);
      const folio = generateFolio();

      // Preparar datos para la API
      const transactionData = {
        ListTransaccion: {
          UsuarioId: parseInt(client.id), // Usar el UsuarioId real
          TransaccionCant: points,
          TransaccionImporte: parseFloat(amount),
          TransaccionNoReferen: folio // Folio único
        }
      };

      // Llamar a la API real
      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/AbonoPuntos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      // Validar usando result.error === false
      if (result.error === false && result.TransaccionId) {
        // Éxito - crear transacción local para el contexto
        const transaction = {
          id: result.TransaccionId, // Usar el ID de la transacción de la API
          clientId: client.id,
          clientName: client.name,
          phone: client.phone,
          amount: amount,
          points: points,
          type: 'points',
          date: new Date().toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          businessId: business?.NegocioId,
          folio: folio,
          apiResponse: result
        };

        addTransaction(transaction);
        
        // LIMPIAR FORMULARIOS DESPUÉS DE ÉXITO
        clearForms();
        
        alert(`✅ ${result.Mensaje}\n\nCliente: ${client.name}\nTeléfono: ${client.phone}\nMonto: $${amount.toFixed(2)}\nPuntos otorgados: ${points}\nFolio: ${folio}\nTransacción ID: ${result.TransaccionId}`);
      } else {
        // Error - la API respondió con error: true o mensaje de error
        throw new Error(result.Mensaje || 'Error desconocido al registrar la transacción');
      }

    } catch (error) {
      console.error('Error al registrar puntos:', error);
      alert(`❌ Error al registrar la compra: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStampsSubmit = async (stamps, amount = 0) => {
    if (!selectedClient) return;
    
    // Si se proporciona un monto, validarlo
    if (amount > 0 && !validateMinimumAmount(amount)) {
      return;
    }
    
    setIsSubmitting(true);
    setValidationError('');

    try {
      const folio = generateFolio();
      const stampsToAssign = amount > 0 ? calculateStamps(amount) : parseInt(stamps);

      // Para sellos, usamos la misma API
      const transactionData = {
        ListTransaccion: {
          UsuarioId: parseInt(selectedClient.id), // Usar el UsuarioId real
          TransaccionCant: stampsToAssign,
          TransaccionImporte: amount || 0, // Para sellos, el importe puede ser 0 o el monto real
          TransaccionNoReferen: folio
        }
      };

      console.log('Enviando datos de sellos a la API:', transactionData);

      // Llamar a la API real
      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/AbonoPuntos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      console.log('Respuesta de la API para sellos:', result);

      // Validar usando result.error === false
      if (result.error === false && result.TransaccionId) {
        // Éxito - crear transacción local para el contexto
        const stampTransaction = {
          id: result.TransaccionId, // Usar el ID de la transacción de la API
          clientId: selectedClient.id,
          clientName: selectedClient.name,
          phone: selectedClient.phone,
          stamps: stampsToAssign,
          type: 'stamps',
          date: new Date().toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          businessId: business?.NegocioId,
          folio: folio,
          apiResponse: result
        };

        addStamp(stampTransaction);
        
        // LIMPIAR FORMULARIOS DESPUÉS DE ÉXITO
        clearForms();
        
        alert(`✅ ${result.Mensaje}\n\nCliente: ${selectedClient.name}\nTeléfono: ${selectedClient.phone}\nSellos otorgados: ${stampsToAssign}\nFolio: ${folio}\nTransacción ID: ${result.TransaccionId}`);
      } else {
        // Error - la API respondió con error: true o mensaje de error
        throw new Error(result.Mensaje || 'Error desconocido al registrar los sellos');
      }

    } catch (error) {
      console.error('Error al registrar sellos:', error);
      alert(`❌ Error al asignar sellos: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determinar el icono y color según el sistema
  const systemConfig = {
    points: {
      icon: Coins,
      color: 'blue',
      title: 'Sistema de Puntos',
      description: 'Registra compras para tus clientes y otorga puntos'
    },
    stamps: {
      icon: Stamp,
      color: 'orange',
      title: 'Sistema de Sellos', 
      description: 'Asigna sellos a los clientes'
    }
  };

  const currentSystem = isPointsSystem ? systemConfig.points : systemConfig.stamps;
  const SystemIcon = currentSystem.icon;

  return (
    <>
    <div className="max-w-3xl mx-auto px-2 py-8">
      {/* Header informativo */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-16 bg-${currentSystem.color}-50 px-12 py-3 rounded-2xl border border-${currentSystem.color}-200 mb-4`}>
          <div className={`p-2 bg-${currentSystem.color}-100 rounded-lg`}>
            <SystemIcon className={`w-6 h-6 text-${currentSystem.color}-600`} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-950">{currentSystem.title}</h2>
            <p className="text-gray-600 text-sm">{currentSystem.description}</p>
          </div>
        </div>
        
        {business?.NegocioDesc && (
          <p className="text-sm text-gray-500">
            Negocio: {business.NegocioDesc}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8">
        {/* Mostrar error de validación */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{validationError}</p>
          </div>
        )}

        {/* Mostrar reglas de negocio */}
        {rules && !rulesLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 text-sm mb-1">Reglas Configuradas:</h4>
            <p className="text-blue-700 text-xs">
              Monto mínimo: ${parseFloat(rules.ReglasMontoMinimo || 0).toFixed(2)} | 
              {isPointsSystem ? ` Porcentaje: ${rules.ReglasPorcentaje || 0}%` : ` Acumulable: ${rules.ReglasAcumulable ? 'Sí' : 'No'}`}
            </p>
          </div>
        )}

        {/* Componente de búsqueda de cliente */}
        <ClientSearch
          selectedClientId={formData.clientId}
          onClientSelect={handleClientSelect}
          onClientsUpdate={handleClientsUpdate}
        />

        {/* Mostrar solo el formulario correspondiente al sistema */}
        {isPointsSystem ? (
          <PointsForm
            formData={formData}
            onFormDataChange={setFormData}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
            onSubmit={handlePointsSubmit}
            businessRules={rules}
            onValidationError={setValidationError}
            onClearForm={clearForms}
          />
        ) : isStampsSystem ? (
          <StampsForm
            formData={formData}
            onFormDataChange={setFormData}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
            onSubmit={handleStampsSubmit}
            businessRules={rules}
            onValidationError={setValidationError}
            onClearForm={clearForms}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se ha configurado el sistema de fidelidad para este negocio.</p>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <BusinessStats 
        clients={clients}
        businessType={businessType}
        business={business}
      />
    </div>
    <Footer />
    </>
  );
};
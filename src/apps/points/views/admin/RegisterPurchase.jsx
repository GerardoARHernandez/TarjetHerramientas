// src/apps/admin-puntos/views/RegisterPurchase.jsx
import { useState, useEffect, useCallback } from 'react';
import { usePoints } from '../../../../contexts/PointsContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { Coins, Stamp } from 'lucide-react';
import PointsForm from '../../components/admin/RegisterPurchase/PointsForm';
import StampsForm from '../../components/admin/RegisterPurchase/StampsForm';
import ClientSearch from '../../components/admin/RegisterPurchase/ClientSearch';
import BusinessStats from '../../components/admin/RegisterPurchase/BusinessStats';

export const RegisterPurchase = () => {
  const [formData, setFormData] = useState({ 
    clientId: '',
    amount: '',
    stamps: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  
  const { addTransaction, addStamp } = usePoints();
  const { business } = useAuth();

  // Determinar el tipo de sistema del negocio
  const businessType = business?.NegocioTipoPS; // 'P' para puntos, 'S' para sellos
  const isPointsSystem = businessType === 'P';
  const isStampsSystem = businessType === 'S';

  // Usar useCallback para estabilizar la función
  const handleClientsUpdate = useCallback((clientsList) => {
    setClients(clientsList);
  }, []);

  // Usar useCallback para estabilizar la función
  const handleClientSelect = useCallback((clientId) => {
    setFormData(prev => ({ ...prev, clientId }));
  }, []);

  // Obtener el cliente seleccionado
  const selectedClient = clients.find(client => client.id.toString() === formData.clientId);

  const handlePointsSubmit = async (amount) => {
    if (!selectedClient) return;
    
    setIsSubmitting(true);

    const points = Math.floor(amount * 0.1);
    
    const transaction = {
      id: Date.now(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      phone: selectedClient.phone,
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
      businessId: business?.NegocioId
    };

    setTimeout(() => {
      addTransaction(transaction);
      setFormData({ clientId: '', amount: '', stamps: 1 });
      setIsSubmitting(false);
      
      alert(`✅ Compra registrada exitosamente\n\nCliente: ${selectedClient.name}\nTeléfono: ${selectedClient.phone}\nMonto: $${amount.toFixed(2)}\nPuntos otorgados: ${points}`);
    }, 800);
  };

  const handleStampsSubmit = async (stamps) => {
    if (!selectedClient) return;
    
    setIsSubmitting(true);

    const stampTransaction = {
      id: Date.now(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      phone: selectedClient.phone,
      stamps: parseInt(stamps),
      type: 'stamps',
      date: new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      businessId: business?.NegocioId
    };

    setTimeout(() => {
      addStamp(stampTransaction);
      setFormData({ clientId: '', amount: '', stamps: 1 });
      setIsSubmitting(false);
      
      alert(`✅ Sellos asignados exitosamente\n\nCliente: ${selectedClient.name}\nTeléfono: ${selectedClient.phone}\nSellos otorgados: ${stamps}`);
    }, 800);
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
          />
        ) : isStampsSystem ? (
          <StampsForm
            formData={formData}
            onFormDataChange={setFormData}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
            onSubmit={handleStampsSubmit}
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
  );
};
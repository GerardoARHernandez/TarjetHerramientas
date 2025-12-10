// src/components/admin/RegisterPurchase/ConfirmationModal.jsx
import { WhatsAppButton } from '../../../../../utils/whatsappUtils';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  client, 
  transactionDetails,
  business,
  businessType
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-6 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-xl bg-blue-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            Transacción Exitosa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-semibold mb-2">
              {transactionDetails.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="font-semibold">{client.name}</p>
            </div>
            
            {transactionDetails.phone && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="font-semibold">{transactionDetails.phone}</p>
              </div>
            )}

            {transactionDetails.amount && transactionDetails.amount > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Monto</p>
                <p className="font-semibold">${parseFloat(transactionDetails.amount).toFixed(2)}</p>
              </div>
            )}

            {transactionDetails.points && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-500">Puntos otorgados</p>
                <p className="font-semibold text-blue-700">{transactionDetails.points}</p>
              </div>
            )}

            {transactionDetails.stamps && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-500">Sellos otorgados</p>
                <p className="font-semibold text-orange-700">{transactionDetails.stamps}</p>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Folio</p>
              <p className="font-semibold">{transactionDetails.folio}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Transacción ID</p>
              <p className="font-semibold">{transactionDetails.transactionId}</p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <div className='cursor-pointer'>
            {transactionDetails.phone && (
              <WhatsAppButton
                phone={transactionDetails.phone}
                clientName={client.name}
                balance={transactionDetails.points || transactionDetails.stamps}
                businessName={business?.NegocioDesc}
                businessType={businessType}
                context="abono" 
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
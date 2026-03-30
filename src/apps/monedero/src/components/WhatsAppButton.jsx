// src/components/WhatsAppButton.jsx
import { useState } from 'react';

const WhatsAppButton = ({ phoneNumber, businessName, negocioDesc, userName }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Limpiar el número de teléfono (solo dígitos)
  const cleanPhone = phoneNumber?.toString().replace(/\D/g, '');
  
  // Crear mensaje personalizado
  const message = `Hola ${userName || 'cliente'} del negocio: ${negocioDesc || 'Monedero Cashback'}. ¡Saludos!`;
  
  // URL de WhatsApp (sin codificar para que sea más legible)
  const whatsappUrl = `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  // Si no hay número de teléfono válido, no mostrar el botón
  if (!cleanPhone || cleanPhone.length < 10) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded transition flex items-center gap-1"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        WhatsApp
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap z-50 shadow-lg">
          Enviar mensaje por WhatsApp
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
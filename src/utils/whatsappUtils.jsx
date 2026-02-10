// src/utils/whatsappUtils.js
export const sendWhatsApp = (phone, clientName, balance, businessName, businessType, context = 'balance', countryCode = '+52') => {
  if (!phone) {
    alert('El cliente no tiene número de teléfono registrado');
    return;
  }

  // Eliminar caracteres no numéricos
  const phoneNumber = phone.replace(/\D/g, '');
  
  // Si el número ya tiene código de país, no lo agregues
  let formattedPhone;
  if (phoneNumber.startsWith('52') && phoneNumber.length > 10) {
    // Ya tiene código de México (52)
    formattedPhone = phoneNumber;
  } else if (phoneNumber.length === 10) {
    // Número de 10 dígitos sin código de país
    formattedPhone = countryCode.replace('+', '') + phoneNumber;
  } else {
    // Otro formato, usar tal cual
    formattedPhone = phoneNumber;
  }
  
  // Determinar el tipo de programa
  const tipoPrograma = businessType === 'P' ? 'puntos' : 'sellos';
  
  // Mensaje según el contexto
  let defaultMessage;
  
  if (context === 'abono') {
    defaultMessage = `Hola ${clientName}, este es un mensaje de ${businessName}. Te informamos que se han abonado ${balance} ${tipoPrograma} a tu cuenta. ¡Gracias por tu compra!`;
  } else {
    defaultMessage = `Hola ${clientName}, este es un mensaje de ${businessName}. Solo para recordarte que tu saldo actual es: ${balance || '0'} ${tipoPrograma}.`;
  }
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(defaultMessage);
  
  // Crear URL de WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Abrir en nueva pestaña
  window.open(whatsappUrl, '_blank');
};

// Componente de botón de WhatsApp
export const WhatsAppButton = ({ 
  phone, 
  clientName, 
  balance, 
  businessName, 
  businessType, 
  context = 'balance',
  countryCode = '+52', // Código de país por defecto (México)
  className = '' 
}) => {
  const handleClick = () => {
    sendWhatsApp(phone, clientName, balance, businessName, businessType, context, countryCode);
  };

  if (!phone) return null;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
      </svg>
      Enviar WhatsApp
    </button>
  );
};
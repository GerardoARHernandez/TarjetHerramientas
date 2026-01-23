// src/apps/points/utils/qrPromoScanner.js

/**
 * Procesa un código QR de promoción y extrae la información
 * @param {string} qrData - Datos del QR escaneado
 * @returns {Object|null} - Objeto con información de la promoción o null si no es válido
 */
export const parsePromoQR = (qrData) => {
    if (!qrData) return null;
    
    // Verificar si es un QR de promoción
    if (qrData.startsWith('PROMO:')) {
        const parts = qrData.split(':');
        if (parts.length >= 3) {
            return {
                type: 'promo',
                campaignId: parts[1],
                phoneNumber: parts[2],
                rawData: qrData
            };
        }
    }
    
    // Si no es promoción, verificar si es solo teléfono
    const cleanPhone = qrData.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
        return {
            type: 'phone',
            phoneNumber: cleanPhone,
            rawData: qrData
        };
    }
    
    return null;
};

/**
 * Encuentra cliente por teléfono en la lista de clientes
 * @param {Array} clients - Lista de clientes
 * @param {string} phoneNumber - Número de teléfono a buscar
 * @returns {Object|null} - Cliente encontrado o null
 */
export const findClientByPhone = (clients, phoneNumber) => {
    const cleanSearchPhone = phoneNumber.replace(/\D/g, '');
    
    return clients.find(client => {
        const clientPhone = client.phone?.replace(/\D/g, '') || '';
        return clientPhone.includes(cleanSearchPhone) || cleanSearchPhone.includes(clientPhone);
    });
};

/**
 * Encuentra campaña por ID en la lista de campañas
 * @param {Array} campaigns - Lista de campañas
 * @param {string} campaignId - ID de la campaña
 * @returns {Object|null} - Campaña encontrada o null
 */
export const findCampaignById = (campaigns, campaignId) => {
    return campaigns.find(campaign => campaign.CampaId === campaignId);
};
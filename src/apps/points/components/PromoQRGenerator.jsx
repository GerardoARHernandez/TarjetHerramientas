// src/apps/points/components/shared/PromoQRGenerator.jsx
import { QrCode, Copy, Check, X, Share2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const PromoQRGenerator = ({
  isOpen,
  onClose,
  campaign,
  phoneNumber,
  clientName,
  business,
  color1,
  color2,
  detallesColor
}) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generar el código QR con formato: PROMO:{CampaId}:{Teléfono}
  const generateQR = async () => {
    if (!campaign || !phoneNumber) return;
    
    setIsGenerating(true);
    try {
      // Formato: PROMO:CampaId:PhoneNumber
      const qrContent = `PROMO:${campaign.CampaId}:${phoneNumber}`;
      
      const url = await QRCode.toDataURL(qrContent, {
        width: 400,
        margin: 2,
        color: {
          dark: detallesColor || '#000000',
          light: "#FFFFFF"
        },
        errorCorrectionLevel: 'H' // Alta corrección de errores
      });
      
      setQrDataUrl(url);
      setQrGenerated(true);
    } catch (err) {
      console.error('Error generando QR:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Efecto para generar QR cuando se abre el modal
  useEffect(() => {
    if (isOpen && campaign && phoneNumber && !qrGenerated) {
      generateQR();
    }
  }, [isOpen, campaign, phoneNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${detallesColor}15` }}>
              <QrCode className="w-6 h-6" style={{ color: detallesColor }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Código QR de Promoción</h3>
              <p className="text-sm text-gray-600">Para canje en caja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {/* Información de la promoción */}
          <div className="mb-6 p-4 rounded-xl border" style={{ 
            backgroundColor: `${detallesColor}08`,
            borderColor: `${detallesColor}30`
          }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{campaign.CampaNombre}</h4>
                <p className="text-sm text-gray-600">{campaign.CampaDesc}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: `${detallesColor}20`,
                color: detallesColor
              }}>
                ID: {campaign.CampaId}
              </span>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Recompensa:</span>
                <span className="font-bold" style={{ color: detallesColor }}>
                  {campaign.CampaRecompensa}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-2xl bg-white border-2" style={{ 
              borderColor: `${detallesColor}30`,
              boxShadow: `0 4px 20px ${detallesColor}15`
            }}>
              {isGenerating ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin mx-auto mb-3"
                      style={{ borderTopColor: detallesColor }}
                    ></div>
                    <p className="text-gray-500">Generando QR...</p>
                  </div>
                </div>
              ) : qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Código QR de promoción"
                  className="w-64 h-64 mx-auto"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <p className="text-gray-500">Error generando QR</p>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              Contiene: Campaña ID y teléfono del cliente
            </p>
          </div>

          {/* Información del teléfono */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Teléfono del cliente:
              </label>
            </div>
            <div 
              className="p-4 rounded-xl border text-center font-mono text-lg font-semibold"
              style={{
                backgroundColor: `${detallesColor}08`,
                borderColor: `${detallesColor}30`,
                color: detallesColor
              }}
            >
              {phoneNumber}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-3">                       
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PromoQRGenerator;
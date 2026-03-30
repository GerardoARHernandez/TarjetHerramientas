// src/components/QRModal.jsx
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react';

const QRModal = ({ isOpen, onClose, phoneNumber, usuarioId }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Color para el QR (usando el mismo indigo del tema)
  const qrColor = '#4f46e5'; // indigo-600
  const lightColor = '#FFFFFF';

  // Formatear el número de teléfono con ID
  const formatPhoneWithId = () => {
    if (!phoneNumber) return '';
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (usuarioId) {
      return `${usuarioId}-${cleanPhone}`;
    }
    // Si no hay ID, formatear solo el teléfono
    if (cleanPhone.length === 10) {
      return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
    }
    return phoneNumber;
  };

  // Formatear el número de teléfono para mostrar (con guiones)
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return '';
    const clean = phone.toString().trim();
    
    return clean;
  };

  // Generar el código QR
  const generateQR = async () => {
    if (!phoneNumber) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Crear contenido del QR con formato: ID-NÚMERO_TELÉFONO
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      let qrContent;
      
      if (usuarioId) {
        qrContent = `${usuarioId}-${cleanPhone}`;
      } else {
        qrContent = `tel:${cleanPhone}`;
      }
      
      // Generar QR como Data URL
      const url = await QRCode.toDataURL(qrContent, {
        width: 400,
        margin: 2,
        color: {
          dark: qrColor,
          light: lightColor
        }
      });
      
      setQrDataUrl(url);
      setQrGenerated(true);
    } catch (err) {
      console.error('Error generando QR:', err);
      setError('Error al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  // Generar QR cuando se abre el modal
  useEffect(() => {
    if (isOpen && !qrGenerated && !loading) {
      generateQR();
    }
  }, [isOpen]);

  // Resetear estado cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setQrGenerated(false);
      setQrDataUrl('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Mi Código QR</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Muestre este código para realizar pagos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                {loading && (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-500 dark:text-gray-400">Generando QR...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="text-center text-red-500">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {qrDataUrl && !loading && !error && (
                  <img 
                    src={qrDataUrl} 
                    alt="Código QR del usuario"
                    className="w-64 h-64 mx-auto"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Información del identificador */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">
              Identificador para pago:
            </label>
            <div className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-center">
              {usuarioId ? (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400">ID: </span>
                  <span className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    {usuarioId}
                  </span>
                  <span className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300 mx-1">-</span>
                  <span className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300">
                    {formatPhoneForDisplay(phoneNumber)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {formatPhoneForDisplay(phoneNumber)}
                </span>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>

          {/* Nota adicional */}
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
            {usuarioId 
              ? "Este código QR contiene tu ID y número de teléfono para realizar pagos de forma segura"
              : "Este código QR contiene tu número de teléfono para realizar pagos de forma segura"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
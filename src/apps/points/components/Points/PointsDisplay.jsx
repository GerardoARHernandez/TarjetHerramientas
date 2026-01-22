//src/apps/points/components/Points/PointsDisplay.jsx
import { TrendingUp, QrCode, Copy, Check, X } from 'lucide-react';
import { useState, useRef } from 'react';
import QRCode from 'qrcode';

const PointsDisplay = ({ userPoints, accountData, color1, color2, detallesColor, business }) => {
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrGenerated, setQrGenerated] = useState(false);
    const [copied, setCopied] = useState(false);
    const phoneNumber = accountData.Telefono;
    const businessName = business?.NegocioDesc;
    
    // Generar el código QR
    const generateQR = async () => {
        try {
            // Crear contenido del QR (formato tel: para teléfonos)
            const qrContent = `tel:${phoneNumber}`;
            
            // Generar QR como Data URL
            const url = await QRCode.toDataURL(qrContent, {
                width: 400,
                margin: 2,
                color: {
                    dark: detallesColor,
                    light: "#FFFFFF"
                }
            });
            
            setQrDataUrl(url);
            setQrGenerated(true);
        } catch (err) {
            console.error('Error generando QR:', err);
            alert('Error al generar el código QR');
        }
    };

    // Abrir modal y generar QR
    const openQrModal = () => {
        setShowQrModal(true);
        if (!qrGenerated) {
            generateQR();
        }
    };

    return (
        <div 
            className="rounded-3xl p-8 shadow-lg border"
            style={{
                backgroundColor: 'white',
                borderColor: `${detallesColor}30`
            }}
        >
            <div className="text-center">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
                    <TrendingUp className="w-6 h-6" style={{ color: detallesColor }}/>
                    MIS PUNTOS OBTENIDOS
                </h3>
                
                {/* Botón para generar QR */}
                {business.NegocioModo == 'BS' && (
                    <div className="mb-6">
                        <button
                            onClick={openQrModal}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${color1}, ${color2})`,
                                color: 'white'
                            }}
                        >
                            <QrCode className="w-5 h-5" />
                            Generar Mi Código QR
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                            Muestre este QR al personal para acumular puntos rápidamente
                        </p>
                    </div>
                )}

                <div
                    style={{
                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`
                    }}
                    className="text-white rounded-3xl p-10 mb-6 shadow-xl"
                >
                    <div className="text-6xl font-bold mb-3">{userPoints}</div>
                    <div className="text-xl opacity-90">Puntos disponibles</div>
                </div>
                {accountData && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div 
                            className="rounded-xl p-4 text-center"
                            style={{
                                backgroundColor: `${detallesColor}15`,
                                color: detallesColor
                            }}
                        >
                            <div className="text-2xl font-bold">{userPoints}</div>
                            <div className="text-sm">Puntos disponibles</div>
                        </div>
                        <div 
                            className="rounded-xl p-4 text-center"
                            style={{
                                backgroundColor: `${color1}15`,
                                color: color1
                            }}
                        >
                            <div className="text-2xl font-bold">
                                {accountData.puntosRedimidos || 0}
                            </div>
                            <div className="text-sm">Puntos redimidos</div>
                        </div>
                    </div>
                )}
                <div 
                    className="rounded-2xl p-4 inline-block mt-4"
                    style={{
                        backgroundColor: `${detallesColor}15`,
                        color: detallesColor
                    }}
                >
                    <p className="text-sm font-medium">
                        Sistema de puntos de {businessName}
                    </p>
                </div>
            </div>

            {/* Modal del QR */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2">
                    <div className="bg-blue-50 rounded-4xl w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${detallesColor}15` }}>
                                    <QrCode className="w-6 h-6" style={{ color: detallesColor }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Mi Código QR</h3>
                                    <p className="text-sm text-gray-600">Muestre este código al personal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-2">
                            <div className="text-center mb-2">
                                <div className="inline-block p-1 rounded-2xl" style={{ backgroundColor: `${detallesColor}15` }}>
                                    <div className="bg-white p-1 rounded-xl shadow-inner">
                                        {qrDataUrl ? (
                                            <img 
                                                src={qrDataUrl} 
                                                alt="Código QR del cliente"
                                                className="w-52 h-52 mx-auto"
                                            />
                                        ) : (
                                            <div className="w-64 h-64 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                                                    <p className="text-gray-500">Generando QR...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Información del número */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-center font-medium text-gray-700">
                                        Número de teléfono asociado:
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
                            <div className="flex gap-3 mb-2">
                                <button
                                    onClick={() => setShowQrModal(false)}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium hover:cursor-pointer"
                                >
                                    Cerrar
                                </button>                                
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default PointsDisplay;
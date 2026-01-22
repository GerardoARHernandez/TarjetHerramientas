import { TrendingUp, QrCode, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'qrcode';

const StampsDisplay = ({ userStamps, accountData, color1, color2, detallesColor, business }) => {
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrGenerated, setQrGenerated] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Proteger contra accountData null
    const phoneNumber = accountData?.Telefono || '';
    const businessName = business?.NegocioDesc || '';
        
    // Si accountData es null, mostrar un estado de carga o mensaje
    if (!accountData) {
        return (
            <div 
                className="rounded-3xl p-8 shadow-lg border animate-pulse"
                style={{
                    backgroundColor: 'white',
                    borderColor: `${detallesColor}30`
                }}
            >
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
                        <TrendingUp className="w-6 h-6" style={{ color: detallesColor }}/>
                        MIS SELLOS OBTENIDOS
                    </h3>
                    <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
                </div>
            </div>
        );
    }
    
    // Obtener el ícono de sellos personalizado
    const stampIconUrl = business?.NegocioIconoSellosUrl;
    
    // Generar el código QR
    const generateQR = async () => {
        try {
            const qrContent = `tel:${phoneNumber}`;
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
        }
    };

    // Abrir modal y generar QR
    const openQrModal = () => {
        // Verificar que tenemos phoneNumber antes de abrir
        if (!phoneNumber) {
            console.error('No hay número de teléfono disponible');
            return;
        }
        setShowQrModal(true);
        if (!qrGenerated) {
            generateQR();
        }
    };    

    // Calcular sellos para mostrar (máximo 10)
    const totalCircles = 10;
    const filledCircles = Math.min(userStamps, totalCircles);
    const progressPercentage = (filledCircles / totalCircles) * 100;

    // Función para renderizar el ícono de sello
    const renderStampIcon = () => {
        // Si hay un ícono personalizado
        if (stampIconUrl) {
            return (
                <img 
                    src={stampIconUrl} 
                    alt="Sello" 
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    onError={(e) => {
                        // Si falla la imagen, mostrar un ícono por defecto
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                            <div class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2" style="border-color: white"></div>
                            </div>
                        `;
                    }}
                />
            );
        }
        
        // Si no hay ícono personalizado, mostrar un círculo con borde
        return (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"></div>
        );
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
                    MIS SELLOS OBTENIDOS
                </h3>
                
                {/* Botón para generar QR */}
                {business.NegocioModo == 'BS' && (
                    <div className="mb-6">
                        <button
                            onClick={openQrModal}
                            disabled={!phoneNumber}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg ${
                                !phoneNumber ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{
                                background: `linear-gradient(135deg, ${color1}, ${color2})`,
                                color: 'white'
                            }}
                        >
                            <QrCode className="w-5 h-5" />
                            Generar Mi Código QR
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                            Muestre este QR al personal para acumular sellos rápidamente
                        </p>
                    </div>
                )}                

                <div
                    style={{
                        backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`
                    }}
                    className="text-white rounded-3xl p-10 mb-6 shadow-xl"
                >
                    <div className="text-6xl font-bold mb-3">{userStamps}</div>
                    <div className="text-xl opacity-90">Sellos obtenidos</div>
                </div>

                {/* Cuadrícula de sellos - SIEMPRE 10 círculos */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 text-center">Mis Sellos</h4>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                        <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercentage}%`,
                                backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                            }}
                        ></div>
                    </div>
                    
                    {/* Grid de 10 sellos (5x2 en móvil, 10x1 en desktop) */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-6">
                        {Array.from({ length: totalCircles }, (_, index) => (
                            <div
                                key={index}
                                className={`aspect-square rounded-full border-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105
                                    ${index < filledCircles
                                    ? 'border-transparent text-white shadow-lg'
                                    : 'hover:bg-opacity-20'
                                    }`}
                                style={index < filledCircles ? {
                                    backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                                } : {
                                    backgroundColor: `${detallesColor}15`,
                                    borderColor: `${detallesColor}30`,
                                    color: detallesColor
                                }}
                            >
                                {index < filledCircles && renderStampIcon()}
                            </div>
                        ))}
                    </div>
                    
                    <div 
                        className="rounded-2xl p-4 text-sm border"
                        style={{ 
                            backgroundColor: `${detallesColor}15`,
                            color: detallesColor,
                            borderColor: `${detallesColor}30`
                        }}
                    >
                        <p>✨ ¡Obtén más sellos comprando en {businessName}!</p>
                    </div>
                </div>

                {/* Modal del QR */}
                {showQrModal && phoneNumber && (
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
                                    <div className="flex items-center justify-center mb-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Número de teléfono asociado:
                                        </label>
                                    </div>
                                    <div 
                                        className="p-4 rounded-xl border text-center font-mono text-lg font-semibold"
                                        style={{
                                            backgroundColor: `${detallesColor}08`,
                                            borderColor: `${detallesColor}95`,
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
                                        className="flex-1 py-3 px-4 border border-gray-700 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium hover:cursor-pointer"
                                    >
                                        Cerrar
                                    </button>                                    
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StampsDisplay;
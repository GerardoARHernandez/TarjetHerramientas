import { X, Copy, Gift } from 'lucide-react';

const RedeemCodeModal = ({ 
    isOpen, 
    onClose, 
    redeemData, 
    business, 
    color1, 
    color2, 
    detallesColor,
    onCopyCode 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div 
                className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-in-up"
                style={{
                    backgroundColor: 'white',
                    border: `2px solid ${detallesColor}50`,
                }}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Icono y título */}
                <div className="text-center mb-6">
                    <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                            backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})`,
                        }}
                    >
                        <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        ¡Canje Exitoso!
                    </h3>
                    <p className="text-gray-600">
                        Tu código de canje ha sido generado
                    </p>
                </div>

                {/* Código de canje */}
                <div 
                    className="rounded-2xl p-6 mb-6 text-center border-2"
                    style={{
                        backgroundColor: `${detallesColor}10`,
                        borderColor: detallesColor,
                    }}
                >
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Presenta este código en {business?.NegocioDesc || 'el establecimiento'}:
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <code 
                            className="text-2xl font-bold tracking-wider select-all"
                            style={{ color: detallesColor }}
                        >
                            {redeemData.code}
                        </code>
                        <button
                            onClick={onCopyCode}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Copiar código"
                        >
                            <Copy className={`w-5 h-5 ${redeemData.copied ? 'text-green-500' : 'text-gray-500'}`} />
                        </button>
                    </div>
                    {redeemData.copied && (
                        <p className="text-sm text-green-600 mt-2 animate-fade-in">
                            ✓ Código copiado al portapapeles
                        </p>
                    )}
                </div>

                {/* Instrucciones */}
                <div 
                    className="rounded-xl p-4 mb-6"
                    style={{
                        backgroundColor: `${detallesColor}15`,
                    }}
                > 
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-lg">📋</span> Instrucciones:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Presenta este código al cajero</li>
                        <li>• El código es válido por única vez</li>
                        <li>• Debes acudir al establecimiento físicamente</li>
                    </ul>
                </div>

                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                    }}
                >
                    Entendido
                </button>

                {/* Nota */}
                <p className="text-xs text-center text-gray-500 mt-4">
                    Guarda una captura de pantalla o copia este código
                </p>
            </div>
        </div>
    );
};

export default RedeemCodeModal;
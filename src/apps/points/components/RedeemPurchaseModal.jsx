import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    CreditCard,
    DollarSign,
    CheckCircle,
    Gift,
    FileText,
    Store,
    Check,
    AlertCircle,
    Camera,
    XCircle
} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import { useBusiness } from '../../../contexts/BusinessContext';
import { useAuth } from '../../../contexts/AuthContext';

const RedeemPurchaseModal = ({ isOpen, onClose, businessName }) => {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    
    const [formData, setFormData] = useState({
        webId: '',
        importe: '',
        folio: '',
        sucursal: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pointsAwarded, setPointsAwarded] = useState(0);
    const [showRouletteQuestion, setShowRouletteQuestion] = useState(false);
    const [showNonRouletteMessage, setShowNonRouletteMessage] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [ticketValidation, setTicketValidation] = useState(null);
    const [businessRules, setBusinessRules] = useState(null);
    const [loadingRules, setLoadingRules] = useState(false);

    // Scanner states
    const [showScanner, setShowScanner] = useState(false);
    const [scannerInstance, setScannerInstance] = useState(null);
    const [scanError, setScanError] = useState('');

    const { user } = useAuth();
    const { business } = useBusiness();

    const color1 = business?.NegocioColor1 || '#ffb900';
    const color2 = business?.NegocioColor2 || '#fe9a00';
    const detallesColor = business?.NegocioColor2 || '#FF9800';

    // ===============================
    // CARGAR REGLAS
    // ===============================
    useEffect(() => {
        if (isOpen && business?.NegocioId) {
            fetchBusinessRules();
        }
        // Limpiar scanner al cerrar
        return () => {
            if (scannerInstance) {
                stopScanner();
            }
        };
    }, [isOpen, business?.NegocioId]);

    const fetchBusinessRules = async () => {
        if (!business?.NegocioId) return;
        setLoadingRules(true);
        try {
            const response = await fetch(
                `https://souvenir-site.com/WebPuntos/API1/GetReglasNegocio?Negocioid=${business.NegocioId}`
            );
            const data = await response.json();
            if (!data.error) {
                setBusinessRules(data);
            }
        } catch (error) {
            console.error('Error al cargar reglas:', error);
        } finally {
            setLoadingRules(false);
        }
    };

    const calculatePoints = (amount) => {
        if (!businessRules?.ReglasPorcentaje) {
            return Math.floor(parseFloat(amount) * 0.10);
        }
        const percentage = parseFloat(businessRules.ReglasPorcentaje) / 100;
        return Math.floor(parseFloat(amount) * percentage);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'webId') {
            setTicketValidation(null);
        }
    };

    // ===============================
    // SCANNER FUNCIONES
    // ===============================
    const startScanner = async () => {
        setScanError('');
        
        // Asegurar que el elemento existe
        if (!document.getElementById('reader')) {
            setScanError('Error al inicializar el escáner');
            return;
        }

        // Limpiar instancia anterior si existe
        if (scannerInstance) {
            await stopScanner();
        }

        const html5QrCode = new Html5Qrcode("reader");

        try {
            await html5QrCode.start(
                { 
                    facingMode: "environment" // Usa cámara trasera
                },
                {
                    fps: 10,
                    qrbox: { width: 280, height: 120 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    // Éxito al escanear
                    setFormData(prev => ({
                        ...prev,
                        webId: decodedText.trim()
                    }));
                    
                    // Limpiar validación anterior
                    setTicketValidation(null);
                    
                    // Cerrar scanner
                    stopScanner();
                },
                (errorMessage) => {
                    // Error de escaneo (ignorar errores de no detección)
                    if (!errorMessage.includes('NotFoundException')) {
                        console.debug('Error de escaneo:', errorMessage);
                    }
                }
            ).catch((err) => {
                console.error('Error al iniciar escáner:', err);
                setScanError('No se pudo acceder a la cámara. Verifica los permisos.');
            });

            setScannerInstance(html5QrCode);
            setShowScanner(true);
            
        } catch (err) {
            console.error("Error al iniciar cámara:", err);
            setScanError('Error al iniciar la cámara. Intenta de nuevo.');
        }
    };

    const stopScanner = async () => {
        if (scannerInstance) {
            try {
                await scannerInstance.stop();
                await scannerInstance.clear();
            } catch (error) {
                console.error('Error al detener scanner:', error);
            }
            setScannerInstance(null);
        }
        setShowScanner(false);
        setScanError('');
    };

    // ===============================
    // VALIDAR TICKET
    // ===============================
    const handleValidateTicket = async (e) => {
        e.preventDefault();

        if (!formData.webId.trim()) {
            setTicketValidation({
                error: true,
                Mensaje: 'Por favor ingresa el Web ID'
            });
            return;
        }

        if (!formData.importe.trim() || parseFloat(formData.importe) <= 0) {
            setTicketValidation({
                error: true,
                Mensaje: 'Por favor ingresa un importe válido'
            });
            return;
        }

        setIsValidating(true);
        setTicketValidation(null);

        try {
            const response = await fetch(
                'https://souvenir-site.com/WebPuntos/API1/Ticket/Validar',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        WebID: formData.webId,
                        Importe: parseFloat(formData.importe)
                    })
                }
            );

            const result = await response.json();
            if (!result.error) {
                result.Mensaje = "Ticket válido";
            }
            setTicketValidation(result);

        } catch (error) {
            setTicketValidation({
                error: true,
                Mensaje: 'Error de conexión al validar el ticket'
            });
        } finally {
            setIsValidating(false);
        }
    };

    // ===============================
    // SUBMIT
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ticketValidation || ticketValidation.error) {
            setTicketValidation({
                error: true,
                Mensaje: 'Por favor valida el ticket primero'
            });
            return;
        }

        if (!formData.webId.trim() || !formData.importe.trim() || !formData.folio.trim() || !formData.sucursal.trim()) {
            return;
        }

        if (!user?.clienteId) {
            setTicketValidation({
                error: true,
                Mensaje: 'Usuario no autenticado'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const points = calculatePoints(formData.importe);
            setPointsAwarded(points);

            const response = await fetch(
                'https://souvenir-site.com/WebPuntos/API1/AbonoPuntos',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ListTransaccion: {
                            UsuarioId: parseInt(user.clienteId),
                            TransaccionCant: points,
                            TransaccionImporte: parseFloat(formData.importe),
                            TransaccionNoReferen: formData.webId,
                            TransaccionFolioTick: formData.folio,
                            TransaccionSucursal: formData.sucursal
                        }
                    })
                }
            );

            const result = await response.json();

            if (!result.error && result.TransaccionId) {
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    if (business?.NegocioId == 3) {
                        setShowRouletteQuestion(true);
                    } else {
                        setShowNonRouletteMessage(true);
                    }
                }, 2000);
            } else {
                throw new Error(result.Mensaje || 'Error desconocido');
            }

        } catch (error) {
            setTicketValidation({
                error: true,
                Mensaje: `Error al registrar la compra: ${error.message}`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRouletteYes = () => {
        setShowRouletteQuestion(false);
        onClose();
        navigate('/points-loyalty/ruleta');
    };

    const handleRouletteNo = () => {
        setShowRouletteQuestion(false);
        onClose();
        resetForm();
    };

    const handleNonRouletteClose = () => {
        setShowNonRouletteMessage(false);
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({ webId: '', importe: '', folio: '', sucursal: '' });
        setPointsAwarded(0);
        setShowSuccess(false);
        setShowRouletteQuestion(false);
        setShowNonRouletteMessage(false);
        setTicketValidation(null);
        stopScanner();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        {/* HEADER */}
                        <div
                            className="p-6"
                            style={{ backgroundImage: `linear-gradient(to right, ${color1}, ${color2})` }}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Gift className="w-7 h-7 text-white" />
                                    <h2 className="text-xl font-bold text-white">Registrar Ticket</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            <p className="text-blue-100 text-sm mt-2">
                                Ingresa los datos de tu compra para acumular puntos
                            </p>
                        </div>

                        {/* BODY */}
                        <div className="p-6">
                            {/* Mensajes de éxito */}
                            {showSuccess && (
                                <div className="mb-6 animate-fade-in">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                                            ¡Puntos Abonados!
                                        </h3>
                                        <p className="text-emerald-700 mb-1">
                                            Se han abonado <span className="font-bold">{pointsAwarded} puntos</span> a tu cuenta.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Pregunta ruleta - Negocio 3 */}
                            {showRouletteQuestion && business?.NegocioId == 3 && (
                                <div className="mb-6 animate-fade-in">
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 text-center">
                                        <h3 className="text-lg font-semibold text-amber-800 mb-3">
                                            ¿Deseas participar en la ruleta?
                                        </h3>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleRouletteNo}
                                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                            >
                                                No, gracias
                                            </button>
                                            <button
                                                onClick={handleRouletteYes}
                                                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-lg"
                                            >
                                                ¡Sí, participar!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mensaje ticket registrado - Otros negocios */}
                            {showNonRouletteMessage && business?.NegocioId != 3 && (
                                <div className="mb-6 animate-fade-in">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            ¡Ticket Registrado!
                                        </h3>
                                        <p className="text-green-700 mb-5">
                                            Se han abonado <span className="font-bold">{pointsAwarded} puntos</span> a tu cuenta.
                                        </p>
                                        <button
                                            onClick={handleNonRouletteClose}
                                            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium rounded-lg"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Formulario principal */}
                            {!showSuccess && !showRouletteQuestion && !showNonRouletteMessage && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Campo Web ID con botón de escanear */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="w-4 h-4" />
                                            Web ID
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    name="webId"
                                                    value={formData.webId}
                                                    onChange={handleChange}
                                                    placeholder="Ingresa o escanea el Web ID"
                                                    className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    required
                                                />
                                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={startScanner}
                                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
                                                title="Escanear código de barras"
                                            >
                                                <Camera className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Encuentra el Web ID en tu recibo de compra o escanéalo
                                        </p>
                                    </div>

                                    {/* Campo Importe */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4" />
                                            Importe de la compra
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                name="importe"
                                                value={formData.importe}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.10"
                                                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {businessRules?.ReglasPorcentaje ? `${businessRules.ReglasPorcentaje}%` : '10%'} del importe se convertirá en puntos
                                        </p>
                                    </div>

                                    {/* Botón Validar Ticket */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={handleValidateTicket}
                                            disabled={isValidating || !formData.webId.trim() || !formData.importe.trim()}
                                            className="w-full py-3 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            style={{ backgroundImage: `linear-gradient(to right, ${color1}, ${color2})` }}
                                        >
                                            {isValidating ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Validando...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Validar Ticket
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Resultado de validación */}
                                    {ticketValidation && (
                                        <div className={`p-4 rounded-lg border ${
                                            ticketValidation.error 
                                                ? 'bg-red-50 border-red-200 text-red-800' 
                                                : 'bg-green-50 border-green-200 text-green-800'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                {ticketValidation.error ? (
                                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">{ticketValidation.Mensaje}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Campos adicionales solo si ticket válido */}
                                    {ticketValidation && !ticketValidation.error && (
                                        <>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                    <FileText className="w-4 h-4" />
                                                    Folio
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="folio"
                                                        value={formData.folio}
                                                        onChange={handleChange}
                                                        placeholder="Ingresa el folio del ticket"
                                                        className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        required
                                                    />
                                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                    <Store className="w-4 h-4" />
                                                    Sucursal
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="sucursal"
                                                        value={formData.sucursal}
                                                        onChange={handleChange}
                                                        placeholder="Ingresa el número de sucursal"
                                                        className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        required
                                                    />
                                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>

                                            {formData.importe && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm" style={{ color: detallesColor }}>
                                                            Puntos a ganar:
                                                        </span>
                                                        <span className="text-xl font-bold" style={{ color: color1 }}>
                                                            {calculatePoints(formData.importe)} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || !formData.folio.trim() || !formData.sucursal.trim()}
                                                    className="flex-1 py-3 px-4 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    style={{ backgroundImage: `linear-gradient(to right, ${color1}, ${color2})` }}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Gift className="w-5 h-5" />
                                                            Registrar Compra
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{businessName}</span>
                                {loadingRules ? (
                                    <span className="text-xs">Cargando reglas...</span>
                                ) : businessRules?.ReglasPorcentaje && (
                                    <span className="text-xs">Porcentaje: {businessRules.ReglasPorcentaje}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL SCANNER - Optimizado para móvil */}
            {showScanner && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/90" onClick={stopScanner} />
                    
                    <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header del scanner */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-900">Escanear Web ID</h3>
                            <button
                                onClick={stopScanner}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Contenedor del scanner */}
                        <div className="bg-black">
                            <div 
                                id="reader" 
                                className="w-full"
                                style={{ 
                                    minHeight: '300px',
                                    maxHeight: '400px'
                                }}
                            />
                        </div>

                        {/* Instrucciones y errores */}
                        <div className="p-4 bg-gray-50">
                            {scanError ? (
                                <div className="text-center">
                                    <p className="text-red-600 text-sm mb-2">{scanError}</p>
                                    <button
                                        onClick={startScanner}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-700 text-sm mb-1">
                                        Centra el código de barras en el recuadro
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        El escáner se cerrará automáticamente al leer el código
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RedeemPurchaseModal;
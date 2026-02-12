import { useState, useEffect } from 'react';
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
    Camera
} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import { useBusiness } from '../../../contexts/BusinessContext';
import { useAuth } from '../../../contexts/AuthContext';

const RedeemPurchaseModal = ({ isOpen, onClose, businessName }) => {
    const navigate = useNavigate();

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

    // 🔹 Scanner states
    const [showScanner, setShowScanner] = useState(false);
    const [scannerInstance, setScannerInstance] = useState(null);

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
    // 🔹 SCANNER FUNCIONES
    // ===============================

    const startScanner = async () => {
        const html5QrCode = new Html5Qrcode("reader");

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 120 }
                },
                (decodedText) => {
                    setFormData(prev => ({
                        ...prev,
                        webId: decodedText
                    }));

                    html5QrCode.stop();
                    setShowScanner(false);
                },
                () => {}
            );

            setScannerInstance(html5QrCode);
        } catch (err) {
            console.error("Error al iniciar cámara:", err);
        }
    };

    const stopScanner = async () => {
        if (scannerInstance) {
            await scannerInstance.stop();
            setScannerInstance(null);
        }
        setShowScanner(false);
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

    const resetForm = () => {
        setFormData({ webId: '', importe: '', folio: '', sucursal: '' });
        setPointsAwarded(0);
        setShowSuccess(false);
        setShowRouletteQuestion(false);
        setShowNonRouletteMessage(false);
        setTicketValidation(null);
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
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <Gift className="w-7 h-7 text-white" />
                                    <h2 className="text-xl font-bold text-white">Registrar Ticket</h2>
                                </div>
                                <button onClick={onClose}>
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-5">

                            {/* WEB ID CON SCANNER */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <CreditCard className="w-4 h-4" />
                                    Web ID
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="webId"
                                        value={formData.webId}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowScanner(true);
                                            setTimeout(() => startScanner(), 300);
                                        }}
                                        className="px-4 bg-gray-100 rounded-lg"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Formulario principal */}
                    {!showSuccess && !showRouletteQuestion && !showNonRouletteMessage && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Campo Web ID */}
                        <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4" />
                            Web ID
                        </label>
                        <div className="relative">
                            <input
                            type="text"
                            name="webId"
                            value={formData.webId}
                            onChange={handleChange}
                            placeholder="Ingresa el ID de la compra"
                            className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Encuentra el Web ID en tu recibo de compra
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
                                style={{backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,}}
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
                                        {!ticketValidation.error && (
                                            <p className="text-sm text-green-700 mt-1">
                                                Puedes proceder con el registro de la compra
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Campos Folio y Sucursal (solo se muestran si el ticket es válido) */}
                        {ticketValidation && !ticketValidation.error && (
                            <>
                                {/* Campo Folio */}
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

                                {/* Campo Sucursal */}
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

                                {/* Calculadora de puntos en tiempo real */}
                                {formData.importe && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                    <span className="text-sm" style={{color: `${detallesColor}`}}>Puntos a ganar:</span>
                                    <span className="text-xl font-bold" style={{color: `${color1}`}}>
                                        {calculatePoints(formData.importe)} pts
                                    </span>
                                    </div>
                                    <div className="mt-2 text-xs" style={{color: `${detallesColor}`}}>
                                    {businessRules?.ReglasPorcentaje ? `${businessRules.ReglasPorcentaje}%` : '10%'} de ${formData.importe} = {calculatePoints(formData.importe)} puntos
                                    </div>
                                </div>
                                )}

                                {/* Botones del formulario */}
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
                                    style={{backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,}}
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
                    </div>
                </div>
            </div>

            {/* MODAL SCANNER */}
            {showScanner && (
                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-xl w-full max-w-sm">
                        <div className="flex justify-between mb-3">
                            <h3 className="font-semibold">Escanear Web ID</h3>
                            <button onClick={stopScanner}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div id="reader" />
                    </div>
                </div>
            )}
        </>
    );
};

export default RedeemPurchaseModal;

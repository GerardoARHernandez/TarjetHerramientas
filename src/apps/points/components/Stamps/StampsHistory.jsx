// src/apps/points/components/Stamps/StampsHistory.jsx
import { useState } from 'react';
import { Clock, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StampsHistory = ({ accountData, detallesColor, onViewFullHistory, rules }) => {

    const navigate = useNavigate();

    const stampsHistory = accountData?.Movimientos ? accountData.Movimientos.map(mov => {
        const dateLocalString = `${mov.TransaccionFecha}T00:00:00`;
        return {
            id: mov.TransaccionId,
            date: new Date(dateLocalString).toLocaleDateString(),
            action: mov.TransaccionTipo === 'A' ? 'Acumulación de sellos' : 'Canje de sellos',
            points: mov.TransaccionTipo === 'A' ? `+${mov.TransaccionCant}` : `-${mov.TransaccionCant}`,
            type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
            details: `Referencia: ${mov.TransaccionNoReferen}`,
            importe: mov.TransaccionImporte
        };
    }).reverse() : [];

    return (
        <div 
            className="sticky top-8"
            style={{ zIndex: 10 }}
        >
            {/* Contenedor del Historial de Sellos */}
            <div 
                className="rounded-3xl p-6 shadow-lg border bg-white"
                style={{
                    borderColor: `${detallesColor}30`
                }}
            >
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Clock className="w-6 h-6" style={{ color: detallesColor }}/>
                    Historial de Sellos
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {stampsHistory.length > 0 ? (
                        stampsHistory.slice(0, 4).map((item) => (
                            <div
                                key={item.id}
                                className={`flex justify-between items-center py-3 px-4 rounded-xl border transition-colors duration-200
                                    ${item.type === 'gain'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.date}</span>
                                        <span className={`text-sm font-bold ${
                                            item.type === 'gain' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {item.points}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">{item.action}</p>
                                    <p className="text-xs text-gray-500">{item.details}</p>
                                    {item.importe && (
                                        <p className="text-xs text-gray-400">${item.importe}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No hay movimientos registrados</p>
                        </div>
                    )}
                </div>

                {stampsHistory.length > 0 && (
                    <div className="mt-6 text-center">
                        <button 
                            onClick={onViewFullHistory}
                            className="font-medium text-sm px-4 py-2 rounded-xl transition-colors duration-200 hover:bg-opacity-20 hover:cursor-pointer"
                            style={{
                                color: detallesColor,
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = `${detallesColor}15`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            Ver historial completo →
                        </button>
                    </div>
                )}

                {/* Sección de Reglas/Observaciones */}
                {(() => {
                    const reglasObservaciones = rules?.ReglasObservaciones;
                    if (!reglasObservaciones) return null;
                    
                    const [isExpanded, setIsExpanded] = useState(false);
                    const charLimit = 500;
                    const needsTruncation = reglasObservaciones.length > charLimit;
                    
                    return (
                        <div className="mt-4 pt-3 border-t-2 border-gray-600">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-5 h-5" style={{ color: detallesColor }} />
                                <h4 className="text-lg font-bold text-gray-900">Nota Importante</h4>
                            </div>
                            <div 
                                className="rounded-xl p-4 text-sm"
                                style={{
                                    backgroundColor: `${detallesColor}15`,
                                    borderColor: `${detallesColor}30`
                                }}
                            >
                                <p className="text-gray-800 font-semibold whitespace-pre-line">
                                    {needsTruncation && !isExpanded 
                                        ? `${reglasObservaciones.substring(0, charLimit)}...`
                                        : reglasObservaciones
                                    }
                                </p>
                                
                                {needsTruncation && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-3 text-sm font-medium hover:underline transition-colors flex items-center gap-1"
                                        style={{ color: detallesColor }}
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                Ver menos
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                Ver más...
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Separador visual (opcional) */}
            <div className="relative flex justify-center -my-2">
                <div className="bg-gray-300 w-10 h-1 rounded-full opacity-50"></div>
            </div>

            {/* Contenedor del Aviso de Privacidad - Visualmente separado */}
            <div 
                className="rounded-xl p-4 shadow-lg border bg-white mt-2"
                style={{
                    borderColor: `${detallesColor}20`
                }}
            >
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/points-loyalty/privacidad')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 mx-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ver aviso de privacidad
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StampsHistory;
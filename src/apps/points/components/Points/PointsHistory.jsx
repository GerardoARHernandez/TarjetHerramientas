//src/apps/points/components/Points/PointsHistory.jsx
import { Clock, Info } from 'lucide-react';

const PointsHistory = ({ accountData, detallesColor, onViewFullHistory, rules }) => {
    const pointsHistory = accountData?.Movimientos ? accountData.Movimientos.map(mov => {
        const dateLocalString = `${mov.TransaccionFecha}T00:00:00`;
        return {
            id: mov.TransaccionId,
            date: new Date(dateLocalString).toLocaleDateString(),
            action: mov.TransaccionTipo === 'A' ? 'Acumulación de puntos' : 'Canje de puntos',
            points: mov.TransaccionTipo === 'A' ? `+${mov.TransaccionCant}` : `-${mov.TransaccionCant}`,
            type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
            details: `Referencia: ${mov.TransaccionNoReferen}`,
            importe: mov.TransaccionImporte
        };
    }).reverse() : [];

    return (
        <div 
            className="rounded-3xl p-6 shadow-lg border sticky top-8"
            style={{
                backgroundColor: 'white',
                borderColor: `${detallesColor}30`
            }}
        >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6" style={{ color: detallesColor }}/>
                Historial de Puntos
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {pointsHistory.length > 0 ? (
                    pointsHistory.slice(0, 4).map((item) => (
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

            {pointsHistory.length > 0 && (
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
            {rules?.ReglasObservaciones && (
                <div className="mt-4 pt-3 border-t border-gray-200">
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
                        <p className="text-gray-800 font-semibold whitespace-pre-line">{rules.ReglasObservaciones}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointsHistory;
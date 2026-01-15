//src/apps/points/components/Points/PointsDisplay.jsx
import { TrendingUp } from 'lucide-react';

const PointsDisplay = ({ userPoints, accountData, businessName, color1, color2, detallesColor }) => {
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
        </div>
    );
};

export default PointsDisplay;
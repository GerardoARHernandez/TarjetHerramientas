import { Gift } from 'lucide-react';

const RedeemSection = ({ campaigns, businessName, detallesColor }) => {
    return (
        <div 
            className="rounded-3xl p-8 shadow-lg border"
            style={{
                backgroundColor: 'white',
                borderColor: `${detallesColor}30`
            }}
        >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Gift className="w-6 h-6" style={{ color: detallesColor }}/>
                Canjear mis Sellos
            </h3>

            <div className="space-y-6">
                {campaigns.length === 0 && (
                    <div className="text-center py-8">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay promociones de sellos activas en este momento</p>
                        <p className="text-sm text-gray-400 mt-2">Vuelve pronto para nuevas promociones</p>
                    </div>
                )}
            </div>

            <div 
                className="mt-6 rounded-2xl p-4 text-sm border"
                style={{ 
                    backgroundColor: `${detallesColor}15`,
                    color: detallesColor,
                    borderColor: `${detallesColor}30`
                }}
            >
                <p className="mb-2"><strong>Proceso de canje:</strong></p>
                <p className="mb-2">• Consulte los términos y condiciones vigentes con su vendedor.</p>
            </div>
        </div>
    );
};

export default RedeemSection;
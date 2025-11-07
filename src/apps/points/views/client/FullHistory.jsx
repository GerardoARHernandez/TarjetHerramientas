// src/apps/points-loyalty/views/client/FullHistory.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { useClientAccount } from '../../../../hooks/useClientAccount';
import ClientHeader from '../../components/ClientHeader';
import Footer from '../../components/Footer';

const FullHistory = () => {
    const { user } = useAuth();
    const { business } = useBusiness();
    const { accountData, isLoading } = useClientAccount();
    const navigate = useNavigate();

    const userName = user?.name || 'Usuario';
    const businessType = business?.NegocioTipoPS;
    const color1 = business?.NegocioColor1 || '#ffb900';

    // Transformar movimientos para historial completo
    const allMovements = accountData?.Movimientos ? accountData.Movimientos.map(mov => {
        const localDateString = `${mov.TransaccionFecha}T00:00:00`;
        const correctDate = new Date(localDateString);

        return {
            id: mov.TransaccionId,
            date: correctDate, 
            formattedDate: correctDate.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            action: mov.TransaccionTipo === 'A' ? 'Acumulación' : 'Canje',
            type: mov.TransaccionTipo === 'A' ? 'gain' : 'redeem',
            points: mov.TransaccionCant,
            reference: mov.TransaccionNoReferen,
            importe: mov.TransaccionImporte
        };
    }).reverse() : [];

    const totalPoints = allMovements.reduce((sum, mov) => 
        mov.type === 'gain' ? sum + mov.points : sum - mov.points, 0
    );

    const exportToCSV = () => {
        const headers = ['Fecha', 'Acción', 'Puntos/Sellos', 'Referencia', 'Importe'];
        const csvData = allMovements.map(mov => [
            mov.formattedDate,
            mov.action,
            mov.type === 'gain' ? `+${mov.points}` : `-${mov.points}`,
            mov.reference,
            `$${mov.importe || '0.00'}`
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial-${userName}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                        style={{ borderColor: color1 }}
                    ></div>
                    <p className="mt-4 text-gray-600">Cargando historial...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <ClientHeader
                title="Historial Completo"
                userName={userName}
                businessName={business?.NegocioDesc}
                showBackButton={true}
                onBack={() => navigate(-1)}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header del Historial */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-100 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Historial de {businessType === 'P' ? 'Puntos' : 'Sellos'}
                            </h1>
                            <p className="text-gray-600">
                                {userName} - {business?.NegocioDesc}
                            </p>
                        </div>
                        {/* <div className="flex gap-3">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Exportar CSV
                            </button>
                        </div> */}
                    </div>

                    {/* Resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{allMovements.length}</div>
                            <div className="text-sm text-blue-700">Total de movimientos</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {allMovements.filter(m => m.type === 'gain').reduce((sum, m) => sum + m.points, 0)}
                            </div>
                            <div className="text-sm text-green-700">{businessType === 'P' ? 'Puntos ganados' : 'Sellos obtenidos'}</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {allMovements.filter(m => m.type === 'redeem').reduce((sum, m) => sum + m.points, 0)}
                            </div>
                            <div className="text-sm text-red-700">{businessType === 'P' ? 'Puntos canjeados' : 'Sellos usados'}</div>
                        </div>
                    </div>
                </div>

                {/* Lista de Movimientos */}
                <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-orange-50">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acción
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {businessType === 'P' ? 'Puntos' : 'Sellos'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referencia
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Importe
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {allMovements.length > 0 ? (
                                    allMovements.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {movement.formattedDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    movement.type === 'gain' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {movement.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span className={movement.type === 'gain' ? 'text-green-600' : 'text-red-600'}>
                                                    {movement.type === 'gain' ? '+' : '-'}{movement.points}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {movement.reference}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${movement.importe || '0.00'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Filter className="w-12 h-12 text-gray-300 mb-4" />
                                                <p>No hay movimientos registrados</p>
                                                <p className="text-sm mt-1">Tu historial aparecerá aquí</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        
        </>
    );
};

export default FullHistory;
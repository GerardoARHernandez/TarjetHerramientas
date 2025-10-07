// src/apps/points-loyalty/views/admin/RegisterPromotion/components/admin/CampaignList.jsx
import { useState } from 'react';
import { Gift, AlertCircle, Edit, Trash2, Power, Loader } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner';
import EditCampaignModal from './EditCampaignModal';


    // Función utilitaria para formatear fechas para inputs (sin ajuste de zona horaria)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        // Si la fecha ya está en formato YYYY-MM-DD, devolverla directamente
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        
        // Para otros formatos, crear la fecha sin ajustar por zona horaria
        const date = new Date(dateString);
        
        // Usar los componentes de fecha locales (no UTC) para evitar desplazamiento
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    // Función utilitaria para mostrar fechas en formato legible
    const displayDate = (dateString) => {
        if (!dateString) return 'No definida';

        try {
            // 1. Verificar el formato 'YYYY-MM-DD'
            const parts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            
            if (!parts) {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return 'Fecha inválida';
                }
            } else {
                // 2. Si el formato es 'YYYY-MM-DD', crear la fecha en la ZONA HORARIA LOCAL
                const year = parseInt(parts[1], 10);
                const month = parseInt(parts[2], 10) - 1; // Restamos 1 al mes
                const day = parseInt(parts[3], 10);
                
                // Esto crea la fecha en la zona horaria local, a medianoche.
                const date = new Date(year, month, day); 

                if (isNaN(date.getTime())) {
                    return 'Fecha inválida';
                }
            
                // 3. Usar toLocaleDateString con opciones específicas
                return date.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            }
        } catch (error) {
            console.error('Error formateando fecha:', dateString, error);
            return 'Fecha inválida';
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };


// Función utilitaria para determinar si una campaña está activa
const isCampaignActive = (campaign) => {
    if (campaign.CampaActiva === 'N') return false;
    if (campaign.CampaActiva === 'S') return true;
    
    const today = new Date();
    const startDate = new Date(campaign.CampaVigeInico);
    const endDate = new Date(campaign.CampaVigeFin);
    return today >= startDate && today <= endDate;
};

const CampaignList = ({ campaigns, isLoading, error, business, onRefresh, onCampaignUpdated }) => {
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatingCampaignId, setUpdatingCampaignId] = useState(null);

    const handleEditClick = (campaign) => {
        setEditingCampaign({
            ...campaign,
            CampaVigeInico: formatDate(campaign.CampaVigeInico),
            CampaVigeFin: formatDate(campaign.CampaVigeFin),
            CampaCantPSCanje: parseInt(campaign.CampaCantPSCanje)
        });
        setIsEditModalOpen(true);
    };

    const handleToggleStatus = async (campaign) => {
        if (updatingCampaignId) return; // Evitar múltiples clics
        
        setUpdatingCampaignId(campaign.CampaId);
        
        try {
            const newStatus = campaign.CampaActiva !== 'S'; // Si está activa (S), desactivar, y viceversa
            const payload = {
                campaId: parseInt(campaign.CampaId),
                Activa: newStatus
            };

            const response = await fetch('https://souvenir-site.com/WebPuntos/API1/ActualizarEstatusCampana', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.Mensaje || 'Error al actualizar el estado');
            }

            if (data.error) {
                throw new Error(data.Mensaje || 'Error en la respuesta del servidor');
            }

            // Éxito - recargar la lista
            onCampaignUpdated();

        } catch (err) {
            console.error('Error updating campaign status:', err);
            alert(`Error al ${campaign.CampaActiva === 'S' ? 'desactivar' : 'activar'} la campaña: ${err.message}`);
        } finally {
            setUpdatingCampaignId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setIsEditModalOpen(false);
        setEditingCampaign(null);
        onCampaignUpdated();
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingCampaign(null);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
                <div className="flex justify-center py-8">
                    <LoadingSpinner message="Cargando campañas..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium">{error}</p>
                    </div>
                    <button
                        onClick={onRefresh}
                        className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Campañas Existentes</h2>
                    <span className="text-sm text-gray-500">
                        {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {campaigns.length === 0 ? (
                    <div className="text-center py-8">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay campañas creadas</p>
                        <p className="text-gray-400">Crea tu primera campaña usando el formulario superior</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {campaigns.map((campaign) => (
                            <CampaignCard 
                                key={campaign.CampaId} 
                                campaign={campaign} 
                                business={business} 
                                isActive={isCampaignActive(campaign)}
                                onEditClick={handleEditClick}
                                onToggleStatus={handleToggleStatus}
                                isUpdating={updatingCampaignId === campaign.CampaId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Edición */}
            {isEditModalOpen && editingCampaign && (
                <EditCampaignModal
                    campaign={editingCampaign}
                    business={business}
                    onClose={handleCloseModal}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </>
    );
};

const CampaignCard = ({ campaign, business, isActive, onEditClick, onToggleStatus, isUpdating }) => {
    const isCurrentlyActive = campaign.CampaActiva === 'S';
    
    return (
        <div className="border border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{campaign.CampaNombre || 'Sin nombre'}</h3>
                    <p className="text-gray-600 mt-1">{campaign.CampaDesc || 'Sin descripción'}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {campaign.CampaId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.CampaActiva === 'S' 
                            ? 'bg-blue-100 text-blue-800' 
                            : campaign.CampaActiva === 'N'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {campaign.CampaActiva === 'S' ? 'Activada' : campaign.CampaActiva === 'N' ? 'Desactivada' : 'Estado desconocido'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {isActive ? 'Vigente' : 'No vigente'}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Recompensa</p>
                    <p className="font-medium">{campaign.CampaRecompensa || 'No especificada'}</p>
                </div>
                <div>
                    <p className="text-gray-500">
                        {campaign.NegocioTipoPS === 'P' ? 'Puntos requeridos' : 'Sellos requeridos'}
                    </p>
                    <p className="font-medium">{campaign.CampaCantPSCanje || '0'}</p>
                </div>
                <div>
                    <p className="text-gray-500">Inicio</p>
                    <p className="font-medium">{displayDate(campaign.CampaVigeInico)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Fin</p>
                    <p className="font-medium">{displayDate(campaign.CampaVigeFin)}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Tipo de Programa</p>
                    <p className="font-medium">
                        {campaign.NegocioTipoPS === 'P' ? 'Puntos' : 'Sellos'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Estado Manual</p>
                    <p className="font-medium">
                        {campaign.CampaActiva === 'S' ? 'Activada' : campaign.CampaActiva === 'N' ? 'Desactivada' : 'No definido'}
                    </p>
                </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
                {/* Botón de Activar/Desactivar */}
                <button 
                    onClick={() => onToggleStatus(campaign)}
                    disabled={isUpdating}
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        isCurrentlyActive
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md'
                            : 'bg-green-100 text-green-600 hover:bg-green-200 hover:shadow-md'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isCurrentlyActive ? 'Desactivar campaña' : 'Activar campaña'}
                >
                    {isUpdating ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <Power className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">
                        {isCurrentlyActive ? 'Desactivar' : 'Activar'}
                    </span>
                </button>

                {/* Botón de Editar */}
                <button 
                    onClick={() => onEditClick(campaign)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    title="Editar campaña"
                >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs font-medium">Editar</span>
                </button>

                {/* Botón de Eliminar */}
                <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                    title="Eliminar campaña"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Eliminar</span>
                </button>
            </div>

            {/* Estado de actualización */}
            {isUpdating && (
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin" />
                    Actualizando estado...
                </div>
            )}
        </div>
    );
};

export default CampaignList;
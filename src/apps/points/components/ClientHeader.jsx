// src/apps/points/components/ClientHeader.jsx
import { useState } from 'react';
import { Store } from 'lucide-react';
import { useBusiness } from '../../../contexts/BusinessContext';

const ClientHeader = ({ title, userName, businessName, color1, color2 }) => {
  const { business } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determinar la imagen a mostrar
  const headerImage = business?.NegocioImagenUrl 
    ? business.NegocioImagenUrl 
    : "/images/header-client.jpeg";

  return (
    <>
      <div 
        className="text-white"
        style={{
          backgroundImage: `linear-gradient(to right, ${color1}, ${color1}, ${color2})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header con título y botón de redimir */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{title}</h1>
            </div>
          </div>
         
          {/* Contenedor principal responsive */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            {/* Imagen de la tarjeta - Izquierda en desktop */}
            <div className="w-full lg:w-1/2 max-w-md lg:max-w-none transform transition-transform duration-300 hover:scale-105">
              <div className="rounded-2xl overflow-hidden border-4 border-white/40 shadow-2xl">
                <img 
                  src={headerImage} 
                  alt="Tarjeta de fidelidad"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = "/images/header-client.jpeg";
                  }}
                />
              </div>
            </div>

            {/* Tarjeta de información del usuario - Derecha en desktop */}
            <div className="w-full lg:w-1/2 max-w-md lg:max-w-none lg:mt-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                  {/* Información del usuario */}
                  <div className="space-y-3 w-full">
                    <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                      {userName}
                    </h2>
                    
                    {businessName && (
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <Store className="w-4 h-4" />
                        <span className="font-medium text-sm">{businessName}</span>
                      </div>
                    )}
                  </div>
                </div>              
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientHeader;
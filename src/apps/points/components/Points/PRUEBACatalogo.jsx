// src/apps/points/components/Points/PRUEBACatalogo.jsx
import { useState } from 'react';
import { X, Gift } from 'lucide-react';

// Datos estáticos para el catálogo - TODOS valen 1200 pts
const PREMIOS_CATALOGO = [
  {
    id: 1,
    titulo: "Taza Personalizada",
    descripcion: "Taza de cerámica con diseño exclusivo de la tienda",
    imagen: "https://i5.walmartimages.com/asr/fb3bc9a8-93df-4f2f-a1e2-318980198544.db39210e623af7ac1a4d4ffd739113dd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
    puntos: 1200
  },
  {
    id: 2,
    titulo: "Camiseta Premium",
    descripcion: "Camiseta de algodón 100% con estampado de alta calidad",
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500",
    puntos: 1200
  },
  {
    id: 3,
    titulo: "Mochila Resistente",
    descripcion: "Mochila impermeable con múltiples compartimentos",
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500",
    puntos: 1200
  }
];

const PRUEBACatalogo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPoints] = useState(100); // Puntos del usuario 

  // Configuración de colores
  const color1 = '#667eea';
  const color2 = '#764ba2';
  const detallesColor = '#6b46c1';

  // Todos los premios valen lo mismo, así que usamos el primer premio como referencia
  const puntosNecesarios = PREMIOS_CATALOGO[0].puntos;
  const isCanjeable = userPoints >= puntosNecesarios;

  return (
    <>
      {/* Vista Principal */}
      <div 
        className="rounded-3xl p-8 shadow-lg border"
        style={{
          backgroundColor: 'white',
          borderColor: `${detallesColor}30`
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6" style={{ color: detallesColor }}/>
            PREMIOS VARIADOS
          </h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${detallesColor}15`,
              color: detallesColor
            }}>
            Todos valen {puntosNecesarios} pts
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-6">
            Puedes elegir alguno de nuestros premios variados
          </p>

          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tus puntos:</span>
              <span className="font-bold" style={{ color: color2 }}>{userPoints} pts</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((userPoints / puntosNecesarios) * 100, 100)}%`,
                  backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progreso</span>
              <span>{userPoints}/{puntosNecesarios} puntos</span>
            </div>
          </div>

          {/* Botón principal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer text-lg mb-4"
            style={{
              backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
            }}
          >
            Ver Catálogo
          </button>

          {/* Botón "Disponible para canjear" */}
          <button
            disabled={!isCanjeable}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 relative overflow-hidden
              ${isCanjeable
                ? 'text-white shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            style={isCanjeable ? {
              backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
            } : {}}
          >
            {isCanjeable ? 'Disponible para canjear' : `Necesitas ${puntosNecesarios - userPoints} puntos más`}
          </button>
        </div>
      </div>

      {/* Modal del Catálogo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{
              borderColor: `${detallesColor}30`,
              borderWidth: '2px'
            }}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 z-10 p-6 pb-4 bg-white rounded-t-3xl border-b"
              style={{
                borderColor: `${detallesColor}30`
              }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Gift className="w-6 h-6" style={{ color: detallesColor }}/>
                  Catálogo de Premios
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {PREMIOS_CATALOGO.length} premios disponibles
                </p>
                <span className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: `${detallesColor}15`,
                    color: detallesColor
                  }}>
                  Todos: {puntosNecesarios} pts
                </span>
              </div>
            </div>

            {/* Información de puntos del usuario en el modal */}
            <div className="px-6 pt-4">
              <div className="rounded-xl p-4 mb-4"
                style={{
                  backgroundColor: `${detallesColor}08`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Tus puntos disponibles:</span>
                    <span className="font-bold ml-2" style={{ color: color2 }}>{userPoints}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Necesarios: <span style={{ color: color2 }}>{puntosNecesarios}</span>
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((userPoints / puntosNecesarios) * 100, 100)}%`,
                      backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {userPoints >= puntosNecesarios 
                    ? '¡Tienes suficientes puntos para canjear cualquier premio!' 
                    : `Te faltan ${puntosNecesarios - userPoints} puntos para canjear`}
                </p>
              </div>
            </div>

            {/* Lista de Premios */}
            <div className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PREMIOS_CATALOGO.map((premio) => (
                  <div 
                    key={premio.id}
                    className="rounded-xl border transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundColor: `${detallesColor}08`,
                      borderColor: `${detallesColor}30`
                    }}
                  >
                    {/* Imagen */}
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                      <img
                        src={premio.imagen}
                        alt={premio.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, ${detallesColor}20, ${detallesColor}10)">
                              <Gift class="w-12 h-12" style="color: ${detallesColor}60" />
                            </div>
                          `;
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                        <span className="text-xs font-bold" style={{ color: detallesColor }}>
                          {premio.puntos} pts
                        </span>
                      </div>
                    </div>

                    {/* Información */}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-2">{premio.titulo}</h4>
                      <p className="text-sm text-gray-600 mb-4">{premio.descripcion}</p>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="sticky bottom-0 p-6 pt-4 bg-white rounded-b-3xl border-t"
              style={{
                borderColor: `${detallesColor}30`
              }}>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer text-gray-700 border-2"
                style={{
                  borderColor: detallesColor
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PRUEBACatalogo;
import { useState, useRef, useEffect } from 'react';

const Ruleta = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const spinTimeoutRef = useRef(null);
  const startAngleRef = useRef(0);
  
  // Opciones de la ruleta (2 son "sigue participando")
  const options = [
    "Doble de puntos",
    "-50% de descuento",
    "Sigue participando",
    "Doble de puntos",
    "-20% de descuento",
    "Sigue participando"
  ];
  
  // Colores para cada segmento
  const colors = [
    '#23b836', '#ffcf32', '#23b836', '#ffcf32', '#23b836', '#ffcf32'
  ];
  
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const arc = (2 * Math.PI) / options.length;
    
    // Fondo del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sombra exterior de la ruleta (efecto 3D)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.restore();
    
    // Aplicar rotación
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);
    
    // Dibujar cada segmento con efectos 3D
    for (let i = 0; i < options.length; i++) {
      const angle = startAngleRef.current + i * arc;
      
      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
      ctx.closePath();
      
      // Gradiente radial para efecto 3D
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, colors[i]);
      gradient.addColorStop(0.7, colors[i]);
      gradient.addColorStop(1, shadeColor(colors[i], -30));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Borde con efecto de profundidad
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Línea interna para más profundidad
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 10, angle, angle + arc, false);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Texto del segmento con sombra
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(options[i], radius - 25, 6);
      ctx.restore();
    }
    
    // Anillo decorativo exterior
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Centro con efecto 3D mejorado
    const centerGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, 30);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.5, '#FFA500');
    centerGradient.addColorStop(1, '#D4AF37');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Brillo en el centro
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY - 8, 12, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    
    // Borde del centro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.strokeStyle = '#8B7500';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
    
    // Dibujar puntero
    drawPointer(ctx, centerX, centerY, radius);
  };
  
  // Función auxiliar para oscurecer/aclarar colores
  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + ((R << 16) + (G << 8) + B).toString(16).padStart(6, '0');
  };
  
  const drawPointer = (ctx, centerX, centerY, radius) => {
    // Puntero arriba del círculo
    const pointerY = 20;
    
    ctx.beginPath();
    ctx.moveTo(centerX - 10, pointerY);
    ctx.lineTo(centerX + 10, pointerY);
    ctx.lineTo(centerX, pointerY + 20);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Línea del puntero
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + 20);
    ctx.lineTo(centerX, pointerY + 40);
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    ctx.stroke();
  };
  
  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    // Reproducir sonido
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Error reproduciendo audio:", e));
    }
    
    // Configurar animación
    const spinDuration = 3000; // 3 segundos
    const startTime = Date.now();
    const startRotation = rotation;
    const spinRotations = 8 + Math.random() * 4; // 8-12 rotaciones completas
    const finalRotation = startRotation + (spinRotations * 2 * Math.PI);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (finalRotation * easeOut);
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        spinTimeoutRef.current = setTimeout(animate, 16); // ~60fps
      } else {
        finishSpin();
      }
    };
    
    animate();
  };
  
  const finishSpin = () => {
    // Calcular resultado
    const normalizedRotation = ((rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const segmentAngle = (2 * Math.PI) / options.length;
    const offsetAngle = (normalizedRotation + segmentAngle / 2) % (2 * Math.PI);
    const segmentIndex = Math.floor(offsetAngle / segmentAngle);
    const winningOption = options[(options.length - segmentIndex - 1 + options.length) % options.length];
    
    setResult(winningOption);
    setSpinning(false);
    
    // Efecto de confeti para ganadores (excepto "sigue participando")
    if (winningOption !== "Sigue participando") {
      triggerConfetti();
    }
  };
  
  const triggerConfetti = () => {
    // Efecto de confeti simple
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Limpiar después de un tiempo
        setTimeout(() => {
          drawWheel();
        }, 1000);
      }, i * 20);
    }
  };
  
  // Redibujar cuando cambia la rotación
  useEffect(() => {
    drawWheel();
  }, [rotation]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-yellow-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Ruleta de la Fortuna</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="relative mb-8">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-auto rounded-lg bg-gray-200 border-4 border-yellow-500 shadow-lg"
          />
          
          {result && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-80 rounded-lg p-6 max-w-xs w-full text-center animate-pulse">
                {result !== "Sigue participando" ? (
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">¡Felicidades!</h3>
                ) : (
                  <h3 className="text-2xl font-bold text-red-400 mb-2">¡Mejor Suerte la próxima!</h3>
                )}
                <p className={`text-3xl font-bold ${result === "Sigue participando" ? "text-red-400" : "text-green-400"}`}>
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={spin}
            disabled={spinning}
            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
              spinning
                ? 'bg-amber-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105'
            } shadow-lg`}
          >
            {spinning ? (
              <span className="flex items-center justify-center text-white">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Girando...
              </span>
            ) : (
              'GIRAR RULETA 🎡'
            )}
          </button>
          
          <div className="text-center text-gray-300 text-sm">
            <p className="mt-1">¡Prueba tu suerte!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruleta;
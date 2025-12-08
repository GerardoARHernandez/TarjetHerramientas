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
    "Camisa Gratis",
    "-20%",
    "Sigue participando",
    "Gaseosa",
    "-10%",
    "Sigue participando"
  ];
  
  // Colores para cada segmento
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
  ];
  
  // Configuración del audio
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-casino-roulette-spin-1036.mp3");
    audioRef.current.volume = 0.9;
    
    // Dibujar la ruleta inicial
    drawWheel();
    
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);
  
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const arc = (2 * Math.PI) / options.length;
    
    // Fondo del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aplicar rotación
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);
    
    // Dibujar cada segmento
    for (let i = 0; i < options.length; i++) {
      const angle = startAngleRef.current + i * arc;
      
      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
      ctx.closePath();
      
      // Color del segmento
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Texto del segmento
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(options[i], radius - 20, 5);
      ctx.restore();
    }
    
    // Dibujar centro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
    
    // Dibujar puntero
    drawPointer(ctx, centerX, centerY, radius);
  };
  
  const drawPointer = (ctx, centerX, centerY, radius) => {
    ctx.beginPath();
    ctx.moveTo(centerX - 10, 20);
    ctx.lineTo(centerX + 10, 20);
    ctx.lineTo(centerX, 40);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Línea del puntero
    ctx.beginPath();
    ctx.moveTo(centerX, 40);
    ctx.lineTo(centerX, 60);
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
      audioRef.current.play();
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
    const winningOption = options[(options.length - segmentIndex) % options.length];
    
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
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gold-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Ruleta de la Fortuna</h2>
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
            className="w-full h-auto rounded-lg bg-gray-800 border-4 border-gold-500 shadow-lg"
          />
          
          {result && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-80 rounded-lg p-6 max-w-xs w-full text-center animate-pulse">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">¡Resultado!</h3>
                <p className={`text-3xl font-bold ${result === "Sigue participando" ? "text-red-400" : "text-green-400"}`}>
                  {result}
                </p>
                {result !== "Sigue participando" && (
                  <p className="text-yellow-300 mt-2">¡Felicidades! 🎉</p>
                )}
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
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105'
            } shadow-lg`}
          >
            {spinning ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Girando...
              </span>
            ) : (
              'GIRAR RUELETA 🎡'
            )}
          </button>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Premios disponibles:</h4>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded"
                  style={{ backgroundColor: `${colors[index]}20` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-white">{option}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>2 de las opciones son "Sigue participando"</p>
            <p className="mt-1">¡Prueba tu suerte!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruleta;
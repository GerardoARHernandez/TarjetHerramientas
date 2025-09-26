// src/apps/points-loyalty/components/LoadingSpinner.jsx
const LoadingSpinner = ({ message = "Cargando...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className={`${sizeClasses[size]} border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin`}></div>
      <span className="text-gray-600 font-medium">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
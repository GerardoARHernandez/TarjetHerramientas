// src/components/ProductCard.jsx

const ProductCard = ({ product, onEdit, isAdmin = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 relative">
      {isAdmin && (
        <button
          onClick={() => onEdit(product)}
          className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 z-10"
          title="Editar producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
        </div>
        {product.description && (
          <p className="text-gray-600 text-sm">{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
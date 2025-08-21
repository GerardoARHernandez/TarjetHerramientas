// src/menus/components/ProductCard.jsx
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductCard = ({ product, onEdit, onDelete, isAdmin = false }) => {
  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {product.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
        </div>
        
        {product.description && (
          <p className="text-gray-600 mb-4">{product.description}</p>
        )}
        
        {isAdmin && (
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              aria-label="Editar producto"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Eliminar producto"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
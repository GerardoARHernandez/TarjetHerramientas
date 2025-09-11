// src/menus/components/ItemCard.jsx
import { FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

const ItemCard = ({ item, onEdit, onDelete, isAdmin = false }) => {
  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}"?`)) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {item.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <span className="text-lg font-bold text-indigo-600">${item.price.toFixed(2)}</span>
        </div>
        
        {item.duration && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiClock className="mr-1" size={14} />
            <span className="text-sm">{item.duration} min aprox.</span>
          </div>
        )}
        
        {item.description && (
          <p className="text-gray-600 mb-4">{item.description}</p>
        )}
        
        {isAdmin && (
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={handleEdit}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              aria-label="Editar elemento"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Eliminar elemento"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
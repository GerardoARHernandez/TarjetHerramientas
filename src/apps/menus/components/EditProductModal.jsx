// src/menus/components/EditProductModal.jsx
import { useState, useEffect } from 'react';

const EditProductModal = ({ product, categories, isOpen, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        image: product.image || null
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProduct({
          ...editedProduct,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedProduct.name.trim() && editedProduct.price && editedProduct.categoryId) {
      onSave({
        ...editedProduct,
        id: product.id,
        price: parseFloat(editedProduct.price)
      });
      onClose();
    }
  };

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold">Editar Producto</h2>
        </div>
        
        {/* Contenido con scroll */}
        <div className="overflow-y-auto px-6 py-4 flex-grow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Nombre del producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="price">
                Precio *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={editedProduct.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="categoryId">
                Categoría *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={editedProduct.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="image">
                Imagen (opcional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {editedProduct.image && (
              <div>
                <p className="text-gray-700 mb-2">Imagen actual:</p>
                <img 
                  src={editedProduct.image} 
                  alt="Vista previa" 
                  className="h-32 object-cover rounded-md mx-auto"
                />
              </div>
            )}
          </form>
        </div>
        
        {/* Botones fijos en la parte inferior */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
// src/menus/components/EditProductModal.jsx
import { useState, useEffect } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';

const EditProductModal = ({ product, categories, isOpen, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setEditedProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        image: product.image || null
      });
      setImagePreview(product.image || null);
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
        setImagePreview(reader.result);
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Editar Producto</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
            aria-label="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Contenido con scroll */}
        <div className="overflow-y-auto px-6 py-4 flex-grow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="price">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryId">
                  Categoría *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={editedProduct.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="image">
                  Imagen (opcional)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiUploadCloud className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">
                    {imagePreview ? 'Cambiar imagen' : 'Haz clic o arrastra una imagen aquí'}
                  </p>
                </div>
              </div>
            </div>

            {imagePreview && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Vista previa:</p>
                <div className="flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="h-40 w-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Botones fijos en la parte inferior */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:cursor-pointer"
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
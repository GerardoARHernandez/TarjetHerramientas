// src/menus/components/ProductForm.jsx
import { useState } from 'react';
import { FiPlus, FiUploadCloud } from 'react-icons/fi';

const ProductForm = ({ categories, onAddProduct }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData({
          ...productData,
          image: reader.result
        });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productData.name.trim() && productData.price && productData.categoryId) {
      onAddProduct({
        ...productData,
        price: parseFloat(productData.price)
      });
      
      // Reiniciar el formulario
      setProductData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: null
      });
      setImagePreview(null);
      
      // Limpiar el input de archivo
      document.getElementById('image').value = '';
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Crear Nuevo Producto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">
              Nombre del producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
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
                value={productData.price}
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
            value={productData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Describe el producto de manera atractiva..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryId">
              Categoría *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={productData.categoryId}
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
                {imagePreview ? 'Imagen seleccionada' : 'Haz clic o arrastra una imagen aquí'}
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

        <button
          type="submit"
          className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg hover:cursor-pointer"
        >
          <FiPlus className="mr-2" />
          Crear Producto
        </button>
      </form>

      {showSuccess && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            Producto agregado correctamente
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
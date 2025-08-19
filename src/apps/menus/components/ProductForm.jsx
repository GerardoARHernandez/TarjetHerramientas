// src/menus/components/ProductForm.jsx
import { useState } from 'react';

const ProductForm = ({ categories, onAddProduct }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null
  });
  const [showSuccess, setShowSuccess] = useState(false)

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
      // Limpiar el input de archivo
      document.getElementById('image').value = '';
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false)
    }, 3000);

  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Nombre del producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="price">
              Precio *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="categoryId">
              Categoría *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={productData.categoryId}
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

          <div className="mb-4">
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
        </div>

        {productData.image && (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Vista previa:</p>
            <img 
              src={productData.image} 
              alt="Vista previa" 
              className="h-32 object-cover rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Crear Producto
        </button>
      </form>

      {showSuccess && (
        <h1 className='bg-green-500 font-semibold text-white py-6'>Producto Agregado Correctamente</h1>
      )}

    </div>
  );
};

export default ProductForm;
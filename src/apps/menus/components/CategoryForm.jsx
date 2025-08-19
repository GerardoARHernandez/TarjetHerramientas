import { useState } from 'react';

const CategoryForm = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName);
      setCategoryName('');
    }

    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Crear Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="categoryName">
            Nombre de la categoría
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Entradas, Platos Principales, Postres..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Crear Categoría
        </button>
      </form>
      
      {showSuccess && (
        <div className="mt-4">
          <h1 className='bg-green-500 font-semibold text-white p-3 rounded-md'>
            Categoría creada con éxito
          </h1>
        </div>
      )}
    </div>
  );
};

export default CategoryForm;
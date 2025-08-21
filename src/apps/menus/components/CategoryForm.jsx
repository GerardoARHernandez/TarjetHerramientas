// src/menus/components/CategoryForm.jsx
import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const CategoryForm = ({ onAddCategory, categories, onDeleteCategory, onEditCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      if (editingCategory) {
        // Modo edición
        onEditCategory(editingCategory.id, categoryName);
        setEditingCategory(null);
        setSuccessMessage('Categoría actualizada con éxito');
      } else {
        // Modo creación
        onAddCategory(categoryName);
        setSuccessMessage('Categoría creada con éxito');
      }
      
      setCategoryName('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryName('');
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Todos los productos asociados también se eliminarán.')) {
      onDeleteCategory(categoryId);
      setSuccessMessage('Categoría eliminada con éxito');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Gestión de Categorías</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario para añadir/editar categorías */}
        <div className="bg-blue-50 p-5 rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-blue-800">
            {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryName">
                Nombre de la categoría
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ej: Entradas, Platos Principales, Postres..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:cursor-pointer"
              >
                {editingCategory ? (
                  <>
                    <FiSave className="mr-2" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" />
                    Crear Categoría
                  </>
                )}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors hover:cursor-pointer"
                >
                  <FiX className="mr-2" />
                  Cancelar
                </button>
              )}
            </div>
          </form>
          
          {showSuccess && (
            <div className="mt-4 animate-fade-in">
              <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                {successMessage}
              </div>
            </div>
          )}
        </div>

        {/* Lista de categorías existentes */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-800">Categorías Existentes</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 italic py-4">No hay categorías creadas todavía.</p>
          ) : (
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id} className={`bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow ${editingCategory?.id === category.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors hover:cursor-pointer"
                      disabled={editingCategory?.id === category.id}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors hover:cursor-pointer"
                      disabled={!!editingCategory}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
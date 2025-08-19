// src/menus/views/AdminPanel.jsx
import { useState } from 'react';
import CategoryForm from '../components/CategoryForm';
import ProductForm from '../components/ProductForm';
import MenuView from '../components/MenuView';
import EditProductModal from '../components/EditProductModal';

const AdminPanel = ({ categories, products, addCategory, addProduct, editProduct }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    editProduct(updatedProduct);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeTab === 'categories'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeTab === 'products'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeTab === 'preview'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vista Previa
          </button>
        </nav>
      </div>
      
      <div className="bg-white rounded-b-lg rounded-r-lg shadow-md p-4">
        {activeTab === 'categories' && (
          <CategoryForm onAddCategory={addCategory} />
        )}
        
        {activeTab === 'products' && (
          <ProductForm 
            categories={categories} 
            onAddProduct={addProduct} 
          />
        )}
        
        {activeTab === 'preview' && (
          <MenuView 
            categories={categories} 
            products={products} 
            onEditProduct={handleEditProduct}
            isAdmin={true}
          />
        )}
      </div>

      <EditProductModal
        product={editingProduct}
        categories={categories}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default AdminPanel;
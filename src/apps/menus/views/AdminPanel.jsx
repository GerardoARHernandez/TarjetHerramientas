// src/menus/views/AdminPanel.jsx
import { useState } from 'react';
import CategoryForm from '../components/CategoryForm';
import ProductForm from '../components/ProductForm';
import MenuView from '../components/MenuView';
import EditProductModal from '../components/EditProductModal';
import { FiGrid, FiBox, FiEye, FiSettings, FiLogOut } from 'react-icons/fi';

const AdminPanel = ({ categories, products, addCategory, addProduct, editProduct, deleteProduct, deleteCategory, editCategory, onLogout }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-blue-700"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
              >
                <FiGrid className="mr-3" />
                Categorías
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
              >
                <FiBox className="mr-3" />
                Productos
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
              >
                <FiEye className="mr-3" />
                Vista Previa
              </button>
            </li>
            <li className="pt-8 mt-8 border-t border-blue-700">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors"
              >
                <FiLogOut className="mr-3" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="bg-white shadow-sm p-4 flex items-center lg:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 mr-4 rounded-md hover:bg-gray-100"
          >
            <FiSettings className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
        </header>

        <main className="p-6">
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Gestiona tu menú de manera eficiente</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {activeTab === 'categories' && (
              <CategoryForm 
                onAddCategory={addCategory} 
                categories={categories}
                onDeleteCategory={deleteCategory}
                onEditCategory={editCategory}
              />
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
                onDeleteProduct={deleteProduct}
                isAdmin={true}
              />
            )}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

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
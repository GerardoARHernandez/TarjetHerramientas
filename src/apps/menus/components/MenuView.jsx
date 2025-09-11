// src/menus/components/MenuView.jsx
import ItemCard from './ItemCard';
import { FiPrinter, FiDownload } from 'react-icons/fi';

const MenuView = ({ categories, items, onEditItem, onDeleteItem, isAdmin = false }) => {
  // Agrupar elementos por categoría
  const itemsByCategory = {};
  
  categories.forEach(category => {
    itemsByCategory[category.id] = items.filter(
      item => String(item.categoryId) === String(category.id)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const menuData = {
      categories: categories,
      items: items
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(menuData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "catalogo_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Nuestro Catálogo</h1>
          <p className="text-gray-600 mt-1">Explora nuestra selección de productos y servicios</p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={handlePrint}
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FiPrinter className="mr-2" />
              Imprimir
            </button>
            <button
              onClick={handleExport}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <FiDownload className="mr-2" />
              Exportar
            </button>
          </div>
        )}
      </div>
      
      {categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">No hay categorías en el catálogo todavía.</p>
        </div>
      ) : (
        categories.map(category => (
          <div key={category.id} className="mb-12">
            <div className="flex items-baseline mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                {category.name}
              </h2>
              <span className="ml-3 text-sm text-gray-500">
                ({itemsByCategory[category.id]?.length || 0} elementos)
              </span>
            </div>
            
            {itemsByCategory[category.id] && itemsByCategory[category.id].length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500 italic">No hay elementos en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsByCategory[category.id] && 
                 itemsByCategory[category.id].map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MenuView;

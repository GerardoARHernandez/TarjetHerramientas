// src/components/MenuView.jsx

import ProductCard from './ProductCard';

const MenuView = ({ categories, products, onEditProduct, isAdmin = false }) => {
  // Agrupar productos por categoría
  const productsByCategory = {};
  
  categories.forEach(category => {
    // Convertir ambos IDs a string para comparación consistente
    productsByCategory[category.id] = products.filter(
      product => String(product.categoryId) === String(category.id)
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestro Menú</h1>
      
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No hay categorías en el menú todavía.</p>
      ) : (
        categories.map(category => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-200 pb-2">
              {category.name}
            </h2>
            
            {productsByCategory[category.id] && productsByCategory[category.id].length === 0 ? (
              <p className="text-gray-500 italic">No hay productos en esta categoría.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productsByCategory[category.id] && 
                 productsByCategory[category.id].map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={onEditProduct}
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
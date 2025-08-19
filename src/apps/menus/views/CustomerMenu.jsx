// src/views/CustomerMenu.jsx

import MenuView from '../components/MenuView';

const CustomerMenu = ({ categories, products }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Menú Digital</h1>
        </div>
      </div>
      <MenuView categories={categories} products={products} />
    </div>
  );
};

export default CustomerMenu;
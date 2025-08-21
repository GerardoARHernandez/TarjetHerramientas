import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPanel from './views/AdminPanel';
import CustomerMenu from './views/CustomerMenu';

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const addCategory = (categoryName) => {
    const newCategory = {
      id: Date.now(),
      name: categoryName
    };
    setCategories([...categories, newCategory]);
  };

  const editCategory = (categoryId, newName) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, name: newName } : category
    ));
  };

  const deleteCategory = (categoryId) => {
    // Primero eliminamos los productos de esa categoría
    setProducts(products.filter(product => String(product.categoryId) !== String(categoryId)));
    // Luego eliminamos la categoría
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData
    };
    setProducts([...products, newProduct]);
    console.log("Producto agregado:", newProduct); // Para depuración
  };

  const editProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    console.log("Producto actualizado:", updatedProduct);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/admin/*" element={
          <>
            <Navbar />
            <AdminPanel 
              categories={categories} 
              products={products}
              addCategory={addCategory}
              editCategory={editCategory}
              deleteCategory={deleteCategory}
              addProduct={addProduct}
              editProduct={editProduct}
            />
          </>
        } />
        <Route path="/menu" element={<CustomerMenu categories={categories} products={products} />} />
        <Route path="/" element={<CustomerMenu categories={categories} products={products} />} />
      </Routes>
    </div>
  );
}

export default App;
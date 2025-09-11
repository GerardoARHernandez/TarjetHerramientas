import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPanel from './views/AdminPanel';
import CustomerMenu from './views/CustomerMenu';

function DigitalMenusRoutes() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [businessInfo, setBusinessInfo] = useState({
    name: "Mi Negocio",
    description: "Descubre nuestra selección de productos y servicios de calidad",
    phone: "+1 (555) 123-4567",
    address: "Av. Principal #123, Ciudad",
    hours: "Lun-Dom: 9:00 AM - 8:00 PM",
    footerDescription: "Ofreciendo productos y servicios de calidad con atención personalizada."
  });

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
    // Primero eliminamos los elementos de esa categoría
    setItems(items.filter(item => String(item.categoryId) !== String(categoryId)));
    // Luego eliminamos la categoría
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  const addItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData
    };
    setItems([...items, newItem]);
    console.log("Elemento agregado:", newItem);
  };

  const editItem = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    console.log("Elemento actualizado:", updatedItem);
  };

  const deleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/admin/*" element={
          <>
            <Navbar />
            <AdminPanel 
              categories={categories} 
              items={items}
              addCategory={addCategory}
              editCategory={editCategory}
              deleteCategory={deleteCategory}
              addItem={addItem}
              editItem={editItem}
              deleteItem={deleteItem}
            />
          </>
        } />
        <Route path="/menu" element={
          <>
            <Navbar />
            <CustomerMenu categories={categories} items={items} businessInfo={businessInfo} />
          </>
        } />
        <Route path="/" element={
          <>
            <Navbar />
            <CustomerMenu categories={categories} items={items} businessInfo={businessInfo} />
          </>
        } />
      </Routes>
    </div>
  );
}

export default DigitalMenusRoutes;
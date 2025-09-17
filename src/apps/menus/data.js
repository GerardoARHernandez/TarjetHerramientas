export const menuData = {
  categories: [
    {
      id: 1,
      name: "Hamburguesas",
      items: [
        {
          id: 1,
          name: "Clasica",
          description: "Arrachera (150 grs), Jamón / Queso Oaxaca / Queso Amarillo",
          price: 75.00,
          categoryId: 1
        },
        {
          id: 2,
          name: "Hawaiana",
          description: "Arrachera (150 grs), Jamón, Queso Oaxaca, Queso Amarillo, Piña",
          price: 80.00,
          categoryId: 1
        },
        {
          id: 3,
          name: "Italiana",
          description: "Arrachera (150 grs), Peperoni / Salchicha / Queso Mozarella",
          price: 90.00,
          categoryId: 1
        },
        {
          id: 4,
          name: "Suprema",
          description: "Arrachera (150 grs), Tocino / Queso Mozarella",
          price: 90.00,
          categoryId: 1
        },
        {
          id: 5,
          name: "Sensacional",
          description: "Arrachera (150 grs), Chorizo argentino / Queso Mozarella",
          price: 90.00,
          categoryId: 1
        },
        {
          id: 6,
          name: "Suculenta",
          description: "Arrachera (150 grs), Chistorra / Queso Mozarella",
          price: 90.00,
          categoryId: 1
        }
      ]
    },
    {
      id: 2,
      name: "Papas",
      items: [
        {
          id: 7,
          name: "A la Francesa",
          description: "Papas a la francesa",
          price: 40.00,
          categoryId: 2
        },
        {
          id: 8,
          name: "Gajo",
          description: "Papas de Gajo con especias",
          price: 55.00,
          categoryId: 2
        }
      ]
    },
    {
      id: 3,
      name: "Hot Dog",
      items: [
        {
          id: 9,
          name: "Sencillo",
          description: "Hot Dog Sencillo",
          price: 20.00,
          categoryId: 3
        },
        {
          id: 10,
          name: "Tocino",
          description: "Hot Dog con Tocino",
          price: 28.00,
          categoryId: 3
        },
        {
          id: 11,
          name: "Italiano",
          description: "Peperoni / Queso Mozarella",
          price: 28.00,
          categoryId: 3
        }
      ]
    },
    {
      id: 4,
      name: "Alitas",
      items: [
        {
          id: 12,
          name: "BBQ",
          description: "Alitas con Salsa BBQ",
          price: 75.00,
          categoryId: 4
        },
        {
          id: 13,
          name: "BBQ Picante",
          description: "Alitas con salsa BBQ Picante",
          price: 75.00,
          categoryId: 4
        },
        {
          id: 14,
          name: "Mango Habanero",
          description: "Alitas con Salsa Mango-Habanero",
          price: 75.00,
          categoryId: 4
        },
        {
          id: 15,
          name: "Bravas",
          description: "Alitas con Salsa Brava",
          price: 75.00,
          categoryId: 4
        }
      ]
    },
    {
      id: 5,
      name: "Bebidas",
      items: [
        {
          id: 16,
          name: "Refresco",
          description: "Refresco de Sabor",
          price: 20.00,
          categoryId: 5
        },
        {
          id: 17,
          name: "Boing",
          description: "Boing Varios Sabores",
          price: 20.00,
          categoryId: 5
        },
        {
          id: 18,
          name: "Arizona",
          description: "Arizona Varios Sabores",
          price: 20.00,
          categoryId: 5
        }
      ]
    },
    {
      id: 6,
      name: "Combos",
      items: [
        {
          id: 19,
          name: "PQT Llenes",
          description: "Hamburguesa clásica + alitas + papas + refresco",
          price: 160.00,
          categoryId: 6
        },
        {
          id: 20,
          name: "PQT Antojes",
          description: "Hamburguesa clásica + papas + refresco",
          price: 130.00,
          categoryId: 6
        }
      ]
    }
  ]
};

// Funciones auxiliares para facilitar el uso de los datos
export const getAllCategories = () => menuData.categories;

export const getAllItems = () => menuData.categories.flatMap(category => category.items);

export const getItemsByCategory = (categoryId) => {
  const category = menuData.categories.find(cat => cat.id === categoryId);
  return category ? category.items : [];
};

export const getCategoryById = (categoryId) => {
  return menuData.categories.find(category => category.id === categoryId);
};

export const getItemById = (itemId) => {
  for (const category of menuData.categories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) return item;
  }
  return null;
};

export default menuData;
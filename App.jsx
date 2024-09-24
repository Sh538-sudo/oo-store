import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products'); // Replace with your API URL
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          description: newProductDescription,
          price: parseFloat(newProductPrice), // Ensure price is a number
          quantity: parseInt(newProductQuantity, 10) // Ensure quantity is an integer
        })
      });
      if (response.ok) {
        fetchProducts(); // Refresh the product list after adding
        setNewProductName('');
        setNewProductDescription('');
        setNewProductPrice('');
        setNewProductQuantity('');
      } else {
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        fetchProducts(); // Refresh the product list after updating
      } else {
        console.error('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchProducts(); // Refresh the product list after deleting
      } else {
        console.error('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h1>Inventory App</h1>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Quantity: {product.quantity}</p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
            <button onClick={() => updateProduct(product.id, {
              name: product.name, 
              description: product.description,
              price: product.price,
              quantity: product.quantity
            })}>Edit</button>
          </li>
        ))}
      </ul>
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={newProductDescription}
        onChange={(e) => setNewProductDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newProductQuantity}
        onChange={(e) => setNewProductQuantity(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default App;
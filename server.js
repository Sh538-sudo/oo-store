const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors'); // For handling cross-origin requests
const bodyParser = require('body-parser'); // For parsing JSON data in requests

const app = express();
const db = new sqlite3.Database('./db.sqlite'); 

// Enable CORS for all origins
app.use(cors()); 

// Parse JSON data from request bodies
app.use(bodyParser.json()); 

// Define the tables when the server starts
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            quantity INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            quantity INTEGER,
            customer_name TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);
});

// Products API Routes
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Error retrieving products:', err);
      res.status(500).send('Error retrieving products'); 
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, quantity } = req.body;
  db.run(
    'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)',
    [name, description, price, quantity], // Missing comma here
    (err) => {
      if (err) {
        res.status(500).send('Error adding product');
      } else {
        res.json({ message: 'Product added successfully' });
      }
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?',
    [name, description, price, quantity, id], // Missing comma here
    (err) => {
      if (err) {
        res.status(500).send('Error updating product');
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).send('Error deleting product');
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// Orders API Routes (similar to products)
app.get('/api/orders', (req, res) => {
  // ... code for getting orders
});

app.post('/api/orders', (req, res) => {
  // ... code for adding orders
});

app.put('/api/orders/:id', (req, res) => {
  // ... code for updating orders
});

app.delete('/api/orders/:id', (req, res) => {
  // ... code for deleting orders
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
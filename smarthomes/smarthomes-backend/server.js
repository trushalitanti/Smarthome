require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // MongoDB connection
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const xml2js = require('xml2js');
const cliProgress = require('cli-progress');
const runSync = require('./generateData'); // Import the generateData.js script

const app = express(); // Initialize app first

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;


// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Connect to MySQL
db.connect(async (err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');

  try {
    // // Step 1: Generate products and reviews
    console.log('Starting data generation...');
    await runSync();
    console.log('Data generation completed successfully.');

    // Step 2: Generate embeddings for products
    console.log('Generating embeddings for products...');
    await fetch("http://localhost:3001/generate-embeddings", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log("Embeddings updated:", data))
      .catch((error) => {
        throw new Error("Error generating embeddings: " + error.message);
      });

    // Step 3: Generate embeddings for reviews
    console.log('Generating embeddings for reviews...');
    await fetch("http://localhost:3001/generate-review-embeddings", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log("Review embeddings updated:", data))
      .catch((error) => {
        throw new Error("Error generating review embeddings: " + error.message);
      });

    // Step 4: Run the remaining synchronization steps
    console.log('Starting synchronization processes...');
    loadProductsFromXMLToHashMap();
    syncHashMapWithMySQL();
    syncProductsToElasticSearch();
    syncReviewsToElasticSearch();
    console.log('Synchronization processes completed.');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
});



// Initialize in-memory hashmap for products
const productHashMap = new Map();

// Function to fetch products from MySQL and upload to ElasticSearch
const syncProductsToElasticSearch = async () => {
  try {
    console.log('Fetching products from MySQL...');

    // Query to fetch products with embeddings
    const query = 'SELECT id, name, description, embedding FROM PRODUCTS WHERE embedding IS NOT NULL';
    db.query(query, async (err, results) => {
      if (err) {
        console.error('Error fetching products from MySQL:', err.message);
        return;
      }

      console.log(`Fetched ${results.length} products. Syncing to ElasticSearch...`);

      const elasticsearchConfig = {
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json'
        }
      };

      for (const product of results) {
        try {
          // Upload each product to ElasticSearch
          const { id, name, description, embedding } = product;
          const embeddingArray = embedding ? embedding.split(',').map(Number) : []; // Convert embedding string to array with null check

          const payload = {
            id,
            name,
            description,
            embedding: embeddingArray,
          };

          await axios.post(
            `${process.env.ELASTICSEARCH_URL}/products/_doc/${id}`, // Use product ID as document ID
            payload,
            elasticsearchConfig
          );
          console.log(`Synced product ID ${id} to ElasticSearch`);
        } catch (uploadError) {
          console.error(
            `Error syncing product ID ${product.id} to ElasticSearch:`, 
            uploadError.response?.data || uploadError.message
          );
        }
      }

      console.log('Syncing to ElasticSearch completed.');
    });
  } catch (error) {
    console.error('Error during sync:', error.response?.data || error.message);
  }
};

// Load products from ProductCatalog.xml into hashmap
function loadProductsFromXMLToHashMap() {
  fs.readFile('./ProductCatalog.xml', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return;
    }

    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }

      const products = result.ProductCatalog.Product;
      products.forEach((product) => {
        const productObj = {
          name: product.name[0],
          price: parseFloat(product.price[0]),
          description: product.description[0],
          category: product.category[0],
          accessories: product.accessories[0],
          image: product.image[0],
          discount: parseFloat(product.discount[0]) || 0,
          rebate: parseFloat(product.rebate[0]) || 0,
          warranty: product.warranty[0] === 'true' ? 1 : 0,
          stock: parseInt(product.stock[0])
        };

        // Insert product into the hashmap
        productHashMap.set(productObj.name, productObj);
      });
      console.log('Products loaded from XML to in-memory hashmap.');
    });
  });
}

// Sync hashmap with MySQL database
function syncHashMapWithMySQL() {
  const query = 'INSERT INTO products (name, price, description, category, accessories, image, discount, rebate, warranty, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), description=VALUES(description), category=VALUES(category), accessories=VALUES(accessories), image=VALUES(image), discount=VALUES(discount), rebate=VALUES(rebate), warranty=VALUES(warranty), stock=VALUES(stock)';

  productHashMap.forEach((product) => {
    db.query(query, [product.name, product.price, product.description, product.category, product.accessories, product.image, product.discount, product.rebate, product.warranty, product.stock], (err) => {
      if (err) {
        console.error('Error syncing hashmap with MySQL:', err);
      }
    });
  });
}

// Write products from hashmap to ProductCatalog.xml
function writeProductsToXML() {
  const xmlBuilder = new xml2js.Builder();
  const productCatalog = {
    ProductCatalog: {
      Product: Array.from(productHashMap.values()).map(product => ({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        accessories: product.accessories,
        image: product.image,
        discount: product.discount.toString(),
        rebate: product.rebate.toString(),
        warranty: product.warranty === 1 ? 'true' : 'false',
        stock: product.stock.toString()
      }))
    }
  };

  const xml = xmlBuilder.buildObject(productCatalog);

  fs.writeFile('./ProductCatalog.xml', xml, (err) => {
    if (err) {
      console.error('Error writing to ProductCatalog.xml:', err);
      return;
    }
    // console.log('ProductCatalog.xml updated successfully.');
  });
}



// CRUD operations

// Fetch products
app.get('/products', (req, res) => {
  const category = req.query.category;
  let query = 'SELECT * FROM products';
  if (category) {
    query += ' WHERE category = ?';
  }

  db.query(query, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products', error: err });
    }
    return res.status(200).json(results);
  });
});

// Add product
app.post('/products', (req, res) => {
  const { name, price, description, category, accessories, image, discount, rebate, warranty } = req.body;

  const productObj = { name, price, description, category, accessories, image, discount, rebate, warranty, stock: 0 };
  productHashMap.set(name, productObj);

  const query = `INSERT INTO products (name, price, description, category, accessories, image, discount, rebate, warranty, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, price, description, category, accessories, image, discount, rebate, warranty, 0], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Error adding product' });
    }
    writeProductsToXML();
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  });
});

// Update product
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, accessories, image, discount, rebate, warranty, stock } = req.body;

  if (productHashMap.has(name)) {
    const updatedProduct = { name, price, description, category, accessories, image, discount, rebate, warranty, stock };
    productHashMap.set(name, updatedProduct);
  }

  const query = `
        UPDATE products 
        SET name = ?, price = ?, description = ?, category = ?, accessories = ?, image = ?, discount = ?, rebate = ?, warranty = ?, stock = ? 
        WHERE id = ?
    `;
  db.query(query, [name, price, description, category, accessories, image, discount, rebate, warranty, stock, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    writeProductsToXML();
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Delete product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  const queryToGetName = 'SELECT name FROM products WHERE id = ?';
  db.query(queryToGetName, [id], (err, result) => {
    if (err) {
      console.error('Error fetching product name:', err);
      return res.status(500).json({ message: 'Error fetching product name' });
    }

    const productName = result[0]?.name;
    if (!productName) {
      return res.status(404).json({ message: 'Product not found' });
    }

    productHashMap.delete(productName);

    const query = `DELETE FROM products WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ message: 'Error deleting product' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      writeProductsToXML();
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  });
});



// Register a new user
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  db.query(query, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err });
    }
    return res.status(200).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Query to find the user by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If no user is found with the provided email
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Assuming you're using bcrypt to hash passwords (adjust this if you're using plain text)
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Login is successful, return the user id and role
      res.status(200).json({
        message: ' successful',
        id: user.id,   // Include the user id in the response
        role: user.role,
        email: user.email,
        name: user.name
      });
    });
  });
});

app.post('/place-order', (req, res) => {
  const { userId, totalPrice, deliveryMethod, storeLocation, deliveryDate, cartItems, address, creditCard } = req.body;

  // Log the incoming request body to check for missing fields
  console.log('Request Body:', req.body);

  // Validate required fields
  if (!userId || !totalPrice || !deliveryMethod || !cartItems || !address || !creditCard) {
    return res.status(400).json({ message: 'Missing required order information' });
  }

  // Log that data validation has passed
  console.log('Validation passed, proceeding with database operations');

  // Insert into the orders table
  const orderQuery = `
      INSERT INTO orders (user_id, total_price, delivery_method, store_location, status, delivery_date, product_id, quantity)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
  `;

  cartItems.forEach((item) => {
    // Log each item to track the insertion process
    console.log('Inserting order for product ID:', item.product_id);

    // Insert each cart item as a separate order with its respective product_id and quantity
    db.query(orderQuery, [userId, totalPrice, deliveryMethod, storeLocation, deliveryDate, item.product_id, item.quantity], (err, result) => {
      if (err) {
        console.error('Error inserting into orders table:', err);  // Log the specific error
        return res.status(500).json({ message: 'Error placing order', error: err.message });
      }

      const orderId = result.insertId;
      console.log('Order inserted with ID:', orderId);

      // Deduct stock by 1 for each product in the cart
      const stockUpdateQuery = `
            UPDATE products
            SET stock = stock - ?
            WHERE id = ?
        `;

      db.query(stockUpdateQuery, [item.quantity, item.product_id], (err) => {
        if (err) {
          console.error('Error updating product stock:', err);  // Log the specific error
          return res.status(500).json({ message: 'Error updating product stock', error: err.message });
        }

        console.log(`Stock updated for product ID: ${item.product_id}`);
      });

      // Insert each item into the CustomerOrder table
      const customerOrderQuery = `
            INSERT INTO CustomerOrder (userName, orderName, orderPrice, userAddress, creditCardNo)
            VALUES ?
        `;
      const orderItems = [[
        userId,  // Assuming userId as userName, adjust this based on your schema
        item.name,
        item.price,
        address,
        creditCard
      ]];

      console.log('Order items to be inserted:', orderItems);

      db.query(customerOrderQuery, [orderItems], (err) => {
        if (err) {
          console.error('Error inserting order items into CustomerOrder table:', err);  // Log the specific error
          return res.status(500).json({ message: 'Error inserting order items', error: err.message });
        }

        console.log('Order items inserted successfully');
      });
    });
  });

  res.status(200).json({ message: 'Order placed successfully' });
});


// Route to get past orders for a specific user
app.get('/past-orders/:userId', (req, res) => {
  const userId = req.params.userId;  // Extract userId from request parameters

  const query = `
    SELECT id, total_price, delivery_method, status, delivery_date
    FROM orders
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching past orders:', err);
      return res.status(500).json({ message: 'Error fetching past orders' });
    }

    res.status(200).json(results);  // Send the orders back as a JSON response
  });
});

app.delete('/cancel-order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  console.log('Deleting order with ID:', orderId); // Log the orderId for debugging

  const query = `
    DELETE FROM orders
    WHERE id = ?
  `;

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ message: 'Error deleting order' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  });
});


// API: Add a customer
app.post('/customers', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database with the hashed password
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "customer")';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ message: 'Error creating customer' });
      }
      res.status(201).json({ message: 'Customer created successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ message: 'Error hashing password' });
  }
});

// API: Fetch all customers
app.get('/customers', (req, res) => {
  const query = 'SELECT * FROM users WHERE role = "customer"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ message: 'Error fetching customers' });
    }
    res.status(200).json(results);
  });
});

// API: Add an order
app.post('/orders', (req, res) => {
  const { user_id, total_price, delivery_method, store_location, delivery_date } = req.body;
  const query = 'INSERT INTO orders (user_id, total_price, delivery_method, store_location, delivery_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, total_price, delivery_method, store_location, delivery_date], (err, result) => {
    if (err) {
      console.error('Error adding order:', err);
      return res.status(500).json({ message: 'Error adding order' });
    }
    res.status(201).json({ message: 'Order added successfully' });
  });
});

// API: Fetch all orders
app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.status(200).json(results);
  });
});

// API: Update an order
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { total_price, delivery_method, store_location, delivery_date } = req.body;
  const query = 'UPDATE orders SET total_price = ?, delivery_method = ?, store_location = ?, delivery_date = ? WHERE id = ?';
  db.query(query, [total_price, delivery_method, store_location, delivery_date, id], (err, result) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ message: 'Error updating order' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  });
});

// API: Delete an order
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ message: 'Error deleting order' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  });
});

// Add this route to handle individual product details
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching product details', error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(result[0]);  // Send the product details as a response
  });
});

// Top five zip codes with maximum product sales
app.get('/trending/top-zipcodes', async (req, res) => {
  try {
    const query = `
      SELECT store_location, COUNT(store_location) AS totalOrders 
      FROM orders 
      GROUP BY store_location 
      ORDER BY totalOrders DESC 
      LIMIT 5
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing top zip codes query:', err);
        return res.status(500).json({ message: 'Error fetching top zip codes', error: err.message });
      }
      console.log('Top zip codes query results:', results);  // Add this log
      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Unexpected error:', err);  // Log any unexpected errors
    res.status(500).json({ message: 'Error fetching top zip codes', error: err.message });
  }
});

// Top five most sold products
app.get('/trending/most-sold', async (req, res) => {
  try {
    const query = `
      SELECT orderName, COUNT(orderName) AS totalSold 
      FROM CustomerOrder 
      GROUP BY orderName 
      ORDER BY totalSold DESC 
      LIMIT 5
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing most sold query:', err);
        return res.status(500).json({ message: 'Error fetching most sold products', error: err.message });
      }
      console.log('Most sold products query results:', results);  // Add this log
      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Unexpected error:', err);  // Log any unexpected errors
    res.status(500).json({ message: 'Error fetching most sold products', error: err.message });
  }
});

// Route to fetch store locations
app.get('/store-locations', (req, res) => {
  const query = 'SELECT * FROM store_locations';  // Replace with your actual store locations table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching store locations:', err);
      return res.status(500).json({ message: 'Error fetching store locations' });
    }
    res.status(200).json(results);
  });
});


app.get('/accessories', (req, res) => {
  const productId = req.query.productId;  // Get productId from query parameters
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const query = 'SELECT * FROM accessories WHERE product_id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching accessories:', err);
      return res.status(500).json({ message: 'Error fetching accessories' });
    }
    res.status(200).json(results);
  });
});

// 1. API to get a table of all products and available stock
app.get('/inventory/products', (req, res) => {
  const query = `
    SELECT name, price, stock 
    FROM products
    ORDER BY name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ message: 'Error fetching inventory', error: err });
    }
    return res.status(200).json(results);
  });
});

// 2. API to get data for Bar Chart (product names and stock levels)
app.get('/inventory/products/bar-chart', (req, res) => {
  const query = `
    SELECT name, stock 
    FROM products
    ORDER BY name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bar chart data:', err);
      return res.status(500).json({ message: 'Error fetching bar chart data', error: err });
    }
    return res.status(200).json(results);
  });
});

// 3. API to get all products currently on sale (with a discount)
app.get('/inventory/products/sale', (req, res) => {
  const query = `
    SELECT name, price, discount
    FROM products
    WHERE discount IS NOT NULL
    ORDER BY name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products on sale:', err);
      return res.status(500).json({ message: 'Error fetching products on sale', error: err });
    }
    return res.status(200).json(results);
  });
});

// 4. API to get all products with manufacturer rebates
app.get('/inventory/products/rebates', (req, res) => {
  const query = `
    SELECT name, price, rebate
    FROM products
    WHERE rebate IS NOT NULL
    ORDER BY name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products with rebates:', err);
      return res.status(500).json({ message: 'Error fetching products with rebates', error: err });
    }
    return res.status(200).json(results);
  });
});

// API: Fetch product sales (name, price, total sales)
app.get('/sales-report/products-sold', (req, res) => {
  const query = `
    SELECT p.name, p.price, COUNT(o.id) AS items_sold, 
           SUM(o.total_price) AS total_sales
    FROM orders o
    JOIN products p ON o.product_id = p.id
    GROUP BY p.name, p.price
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sold products:', err);
      return res.status(500).json({ message: 'Error fetching sold products', error: err });
    }
    res.status(200).json(results);
  });
});

// API: Fetch product sales chart (product names and total sales)
app.get('/sales-report/products-sales-chart', (req, res) => {
  const query = `
    SELECT p.name, SUM(o.total_price) AS total_sales
    FROM orders o
    JOIN products p ON o.product_id = p.id
    GROUP BY p.name
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sales chart data:', err);
      return res.status(500).json({ message: 'Error fetching sales chart data', error: err });
    }
    res.status(200).json(results);
  });
});

// API: Fetch total daily sales transactions
app.get('/sales-report/daily-sales', (req, res) => {
  const query = `
    SELECT DATE(o.order_date) AS date, SUM(o.total_price) AS total_sales
    FROM orders o
    GROUP BY DATE(o.order_date)
    ORDER BY date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching daily sales:', err);
      return res.status(500).json({ message: 'Error fetching daily sales', error: err });
    }
    res.status(200).json(results);
  });
});

app.get('/autocomplete', (req, res) => {
  const searchTerm = req.query.q;  // Get the search term from the query

  // Check if the search term is provided
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  // Convert search term to lowercase for case-insensitive search
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Search products in the in-memory hashmap
  const matchedProducts = Array.from(productHashMap.values())
    .filter(product => product.name.toLowerCase().includes(lowerCaseSearchTerm))
    .slice(0, 10);  // Limit the results to the first 10 matches

  if (matchedProducts.length === 0) {
    return res.status(404).json({ message: 'No matching products found' });
  }

  // Return matched product names and IDs (if you have product ID)
  const response = matchedProducts.map(product => ({
    id: product.id,  // Assuming you have product IDs in the hashmap
    name: product.name
  }));

  res.json(response);  // Return both id and name
});


const multer = require('multer');
const { v4: uuidv4 } = require('uuid');  // For ticket number generation
const path = require('path');
// const fs = require('fs');
const axios = require('axios');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);  // Create the upload directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);  // Generate unique filename with original extension
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Helper function to encode an image to base64
function encodeImage(imagePath) {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
}



// POST route to create a new ticket
app.post('/tickets', upload.single('image'), async (req, res) => {
  const { name, email, category, description, orderId } = req.body;
  const image = req.file;

  const ticketNumber = 'TICKET-' + uuidv4();

  // Validate required fields
  if (!name || !email || !category || !description || !orderId) {
    return res.status(400).json({ message: 'All fields are required, including an order ID' });
  }

  // Validate image upload
  if (!image) {
    return res.status(400).json({ message: 'An image is required' });
  }

  // Validate orderId existence in the `orders` table
  try {
    const [order] = await db.promise().query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order ID not found' });
    }
  } catch (err) {
    console.error('Error validating orderId:', err);
    return res.status(500).json({ message: 'Error validating order ID' });
  }

  // Store the file path in the database instead of binary data
  const imagePath = path.join('uploads', image.filename);

  // Step 1: Generate image description using OpenAI
  const base64Image = encodeImage(imagePath);

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe the image.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  
        'Content-Type': 'application/json'
      }
    });

    const imageDescription = response.data.choices[0].message.content.trim();
    console.log('Image Description:', imageDescription);

    // Step 2: Make a decision based on the image description
    const decisionPrompt = `
   Based on the following image description: "${imageDescription}", decide which action should be taken:

   1. If the product or the package is totally damaged and not repairable, then Refund Order.
   2. If the product or the package is damaged but repairable, then Replace Order.
   3. If the product or the package looks good, then Escalate to Human Agent.

   Respond with only one of the following options: "Refund Order", "Replace Order", or "Escalate to Human Agent".
   `;

    const decisionResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: decisionPrompt }
      ],
      max_tokens: 50,
      temperature: 0.5,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
        'Content-Type': 'application/json'
      }
    });

    const decision = decisionResponse.data.choices[0].message.content.trim();
    console.log('Decision:', decision);

    // Determine the status based on the decision
    let status = 'Undetermined';
    if (decision.includes('Refund Order')) {
      status = 'Refund Order';
    } else if (decision.includes('Replace Order')) {
      status = 'Replace Order';
    } else if (decision.includes('Escalate to Human Agent')) {
      status = 'Escalate to Human Agent';
    }

    // Insert ticket data into the database, including the status and orderId
    const query = `INSERT INTO tickets (order_id, name, email, category, description, image, ticket_number, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [orderId, name, email, category, description, imagePath, ticketNumber, status], (err, result) => {
      if (err) {
        console.error('Error creating ticket:', err);
        return res.status(500).json({ message: 'Error creating ticket' });
      }
      res.status(201).json({
        message: 'Ticket created successfully',
        ticketNumber: ticketNumber,
        status: status
      });
    });
  } catch (error) {
    console.error('Error processing image with OpenAI:', error);
    res.status(500).json({ message: 'Error processing the image or decision' });
  }
});

app.get('/tickets/status/:ticketNumber', (req, res) => {
  const ticketNumber = req.params.ticketNumber;

  const query = 'SELECT * FROM tickets WHERE ticket_number = ?';

  db.query(query, [ticketNumber], (err, results) => {
    if (err) {
      console.error('Error fetching ticket:', err);
      return res.status(500).json({ message: 'Error fetching ticket' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = results[0]; // Extract the ticket details from the database
    const status = ticket.status; // Assuming 'status' is a field in your DB

    // Log the status and ticket details
    // console.log('Ticket Details:', ticket);
    // console.log('Status:', status);

    // Respond with the ticket details and status
    res.status(200).json({
      message: 'Ticket details retrieved successfully',
      Name:  ticket.name,
      Email: ticket.email,
      Description:  ticket.description,
      Decision: status,
      ticketDetails: ticket,
    });
  });
});

// Generate embeddings for products
app.post("/generate-embeddings", async (req, res) => {
  try {
    // Query to fetch products without embeddings
    const query = `SELECT id, name, description FROM PRODUCTS WHERE embedding IS NULL`;
    db.query(query, async (err, products) => {
      if (err) return res.status(500).json({ error: "Database query failed." });

      const embeddings = [];
      for (const product of products) {
        const { id, name, description } = product;
        const textToEmbed = `${name}. ${description}`;

        try {
          // Call OpenAI API using axios
          const response = await axios.post(
            "https://api.openai.com/v1/embeddings",
            {
              input: textToEmbed,
              model: "text-embedding-3-small",
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          const embedding = response.data.data[0].embedding;
          const embeddingString = embedding.join(",");

          // Update product with the embedding
          db.query(
            `UPDATE PRODUCTS SET embedding = ? WHERE id = ?`,
            [embeddingString, id],
            (err) => {
              if (err) console.error(`Failed to update embedding for product ID: ${id}`);
            }
          );

          embeddings.push({ productId: id, embedding });
        } catch (error) {
          console.error(`Error generating embedding for product ID: ${id}`, error.message);
        }
      }

      res.status(200).json({ message: "Embeddings generated.", embeddings });
    });
  } catch (error) {
    console.error("Failed to generate embeddings:", error.message);
    res.status(500).json({ error: "Failed to generate embeddings." });
  }
});


app.post("/recommend-products", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required." });

  try {
    // Generate embedding for the user's query
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: query,
        model: "text-embedding-3-small"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const queryEmbedding = response.data.data[0].embedding;

    // Enhanced Elasticsearch query with collapse and better scoring
    const esResponse = await axios.post("http://localhost:9200/products/_search", {
      size: 10,
      query: {
        bool: {
          must: [
            {
              script_score: {
                query: { match_all: {} },
                script: {
                  source: "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                  params: { query_vector: queryEmbedding }
                }
              }
            }
          ],
          should: [
            {
              match: {
                name: {
                  query: query,
                  boost: 2.0
                }
              }
            },
            {
              match: {
                description: {
                  query: query,
                  boost: 1.5
                }
              }
            }
          ]
        }
      },
      collapse: {
        field: "id"  // Ensure unique products by ID
      },
      sort: [
        { "_score": "desc" }
      ],
      _source: ["id", "name", "description"]
    },
    {
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Process results and ensure uniqueness
    const seen = new Set();
    const recommendations = esResponse.data.hits.hits
      .map(hit => ({
        id: hit._source.id,
        name: hit._source.name,
        description: hit._source.description,
        score: hit._score
      }))
      .filter(item => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });

    res.status(200).json({ 
      recommendations,
      total: recommendations.length,
      query: query
    });

  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to generate recommendations",
      details: error.response?.data || error.message
    });
  }
});



// MongoDB setup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
})
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Review Schema
const reviewSchema = new mongoose.Schema({
  productId: Number,
  productModelName: String,
  productCategory: String,
  productPrice: Number,
  storeID: String,
  storeZip: String,
  storeCity: String,
  storeState: String,
  productOnSale: Boolean,
  manufacturerName: String,
  manufacturerRebate: Boolean,
  userID: String,
  userAge: Number,
  userGender: String,
  userOccupation: String,
  reviewRating: Number,
  reviewDate: Date,
  reviewText: String,
  embedding: { type: [Number], default: null } // Store embeddings as an array of numbers
});

const Review = mongoose.model('Review', reviewSchema);

const syncReviewsToElasticSearch = async () => {
  try {
    console.log("Starting review synchronization...");

    // Fetch reviews from MongoDB that are not yet synced
    const reviews = await Review.find({ synced: { $ne: true } });

    for (const review of reviews) {
      try {
        const {
          reviewText,
          productId,
          productModelName,
          productCategory,
          productPrice,
          storeID,
          storeZip,
          storeCity,
          storeState,
          productOnSale,
          manufacturerName,
          manufacturerRebate,
          userID,
          userAge,
          userGender,
          userOccupation,
          reviewRating,
          reviewDate,
        } = review;

        // Check if reviewText exists before generating embedding
        let embedding = [];
        if (reviewText) {
          const embeddingResponse = await axios.post(
            "https://api.openai.com/v1/embeddings",
            {
              model: "text-embedding-ada-002",
              input: reviewText,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
            }
          );
          embedding = embeddingResponse.data.data[0].embedding;
        }

        // Prepare the document for ElasticSearch
        const reviewDocument = {
          productId: productId || null,
          productModelName: productModelName || null,
          productCategory: productCategory || null,
          productPrice: productPrice || null,
          storeID: storeID || null,
          storeZip: storeZip || null,
          storeCity: storeCity || null,
          storeState: storeState || null,
          productOnSale: productOnSale || null,
          manufacturerName: manufacturerName || null,
          manufacturerRebate: manufacturerRebate || null,
          userID: userID || null,
          userAge: userAge || null,
          userGender: userGender || null,
          userOccupation: userOccupation || null,
          reviewRating: reviewRating || null,
          reviewDate: reviewDate || null,
          reviewText: reviewText || null,
          embedding,
        };

        const elasticResponse = await axios.post(
          `${process.env.ELASTICSEARCH_URL}/reviews/_doc/${review._id}`,
          reviewDocument,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(
                 `${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}`
              ).toString("base64")}`,
            },
            httpsAgent: new require("https").Agent({ rejectUnauthorized: false }),
          },
          {
            auth: {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (elasticResponse.status === 201 || elasticResponse.status === 200) {
          // Mark the review as synced in MongoDB
          await Review.updateOne({ _id: review._id }, { $set: { synced: true } });
          console.log(`Successfully synced review ID: ${review._id}`);
        }
      } catch (error) {
        console.error(`Failed to sync review ID: ${review._id}`, error.message);
      }
    }

    console.log("Review synchronization complete.");
  } catch (error) {
    console.error("Error syncing reviews to ElasticSearch:", error.message);
  }
};

// Route for searching reviews using similarity
app.post("/search-reviews", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    // Generate embedding for the query
    const embeddingResponse = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: "text-embedding-ada-002",
        input: query,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const queryEmbedding = embeddingResponse.data.data[0].embedding;

    // Query Elasticsearch for similar reviews
    const elasticResponse = await axios.post(
      `${process.env.ELASTICSEARCH_URL}/reviews/_search`,  // Use environment variable instead of hardcoded URL
      {
        knn: {
          field: "embedding",
          query_vector: queryEmbedding,
          k: 5, // Number of similar reviews to return
          num_candidates: 100, // Candidate pool size
        },
        _source: [
          "productId",
          "productModelName",
          "productCategory",
          "productPrice",
          "storeID",
          "storeZip",
          "storeCity",
          "storeState",
          "productOnSale",
          "manufacturerName",
          "manufacturerRebate",
          "userID",
          "userAge",
          "userGender",
          "userOccupation",
          "reviewRating",
          "reviewDate",
          "reviewText",
          "embedding"
        ]
      },
      {
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json'
        },
        // Add this if you're using self-signed certificates
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      }
    );

    // Extract and format the results
    const results = elasticResponse.data.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source, // Include all source fields
    }));

    res.status(200).json({ 
      results,
      total: results.length,
      query: query 
    });
  } catch (error) {
    console.error("Error searching reviews:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Error searching reviews",
      details: error.response?.data || error.message
    });
  }
});

// Generate embeddings for reviews
app.post('/generate-review-embeddings', async (req, res) => {
  try {
    // Fetch reviews without embeddings
    const reviewsWithoutEmbedding = await Review.find({ embedding: null });

    if (reviewsWithoutEmbedding.length === 0) {
      return res.status(200).json({ message: 'All reviews already have embeddings.' });
    }

    for (const review of reviewsWithoutEmbedding) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/embeddings',
          {
            input: review.reviewText,
            model: 'text-embedding-3-small',
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const embedding = response.data.data[0].embedding;

        // Update the review with the embedding
        review.embedding = embedding;
        await review.save();
      } catch (error) {
        console.error(`Failed to generate embedding for review ID: ${review._id}`, error.message);
      }
    }

    res.status(200).json({ message: 'Embeddings generated for reviews.' });
  } catch (error) {
    console.error('Error generating review embeddings:', error.message);
    res.status(500).json({ message: 'Error generating embeddings', error: error.message });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const reviewData = req.body;

    // Ensure boolean fields default to false if not provided
    reviewData.productOnSale = reviewData.productOnSale || false;
    reviewData.manufacturerRebate = reviewData.manufacturerRebate || false;

    // Generate embedding for the review text
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: reviewData.reviewText,
        model: 'text-embedding-3-small',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const embedding = response.data.data[0].embedding;

    // Add embedding to the review data
    reviewData.embedding = embedding;

    // Create a new review instance
    const newReview = new Review(reviewData);

    // Save the review
    const savedReview = await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully', review: savedReview });
  } catch (err) {
    console.error('Error saving review:', err.message);
    res.status(500).json({ message: 'Error saving review', error: err.message });
  }
});


// API to fetch reviews for a specific product (if productId is stored as a number)
app.get('/reviews', async (req, res) => {
  const productId = Number(req.query.productId); // Convert productId to a number

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid productId provided' });
  }

  try {
    const reviews = await Review.find({ productId: productId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});


// Top five most liked products
app.get('/trending/most-liked', async (req, res) => {
  try {
    const topLikedProducts = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$reviewRating" }
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(topLikedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching most liked products', error });
  }
});





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


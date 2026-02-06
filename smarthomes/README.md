

## Setup Instructions

Update your details in .env file.

### 1. Prerequisites

- Node.js (>= v16)
- MySQL (>= v8.0)
- MongoDB (>= v4.0)
- MongoDB Compass (for viewing and managing MongoDB data)
- Git
- npm (or yarn)

### 2. Installation

#### Step 1: Clone the repository
```bash
git clone <repository-url>
cd smarthomes
```

#### Step 2: Backend Setup

1. **Install dependencies** for the backend:
   ```bash
   cd smarthomes-backend
   npm install
   ```

2. **Configure MySQL**:
   - Create a MySQL database named `smarthomes`.
   - Ensure the MySQL tables `users`, `products`, `CustomerOrder`, `orders`, `store_locations`, `accessories`, and `tickets` are created. (Schema provided below.)

3. **Configure MongoDB**:
   - Ensure that MongoDB is running and use the `reviews` collection to store product reviews.

4. **Add `.env` file** in `smarthomes-backend/` directory with the following configurations:
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=<your_mysql_password>
   MYSQL_DATABASE=smarthomes
   MONGO_URI=mongodb://localhost:27017/smartHome
   PORT=3001
   ```

5. **Start the backend server**:
   ```bash
   node server.js
   ```

#### Step 3: Frontend Setup

1. **Install dependencies** for the frontend:
   ```bash
   cd ../smarthomes-frontend
   npm install
   ```

2. **Start the frontend server**:
   ```bash
   npm start
   ```

   The frontend will run at `http://localhost:3000`.

### 3. Database Setup

#### MySQL Setup

1. **Create MySQL tables**:

   Execute the following commands in your MySQL shell:

   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       role ENUM('customer', 'salesman', 'storeManager') NOT NULL
   );

   CREATE TABLE products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       description TEXT,
       category ENUM('smart doorbell', 'smart doorlock', 'smart lighting', 'smart speaker', 'smart thermostat') NOT NULL,
       accessories TEXT,
       image VARCHAR(255),
       discount DECIMAL(10, 2),
       rebate DECIMAL(10, 2),
       warranty TINYINT(1) DEFAULT 0,
       stock INT DEFAULT 0,
       embeddings TEXT
   );

   CREATE TABLE CustomerOrder (
       orderid INT AUTO_INCREMENT,
       userName VARCHAR(255) NOT NULL,
       orderName VARCHAR(255) NOT NULL,
       orderPrice DECIMAL(10, 2) NOT NULL,
       userAddress TEXT NOT NULL,
       creditCardNo VARCHAR(16) NOT NULL,
       PRIMARY KEY (orderid, userName, orderName)
   );

   CREATE TABLE orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       product_id INT NOT NULL,
       total_price DECIMAL(10, 2) NOT NULL,
       delivery_method ENUM('homeDelivery', 'inStorePickup') NOT NULL,
       store_location VARCHAR(255),
       status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
       order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       delivery_date DATE NOT NULL,
       store_id INT,
       quantity INT DEFAULT 1,
       CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
       CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
   );

   CREATE TABLE store_locations (
       storeID INT AUTO_INCREMENT PRIMARY KEY,
       street VARCHAR(255) NOT NULL,
       city VARCHAR(255) NOT NULL,
       state VARCHAR(255) NOT NULL,
       zipcode VARCHAR(10) NOT NULL
   );

   CREATE TABLE accessories (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10, 2) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES products(id)
   );

   CREATE TABLE tickets (
    ticket_number INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    issue_description TEXT,
    image LONGBLOB,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

2. **Insert sample data**:

   - Populate `users`, `products`, `CustomerOrder`, and `orders` tables with at least 20 entries each.

#### MongoDB Setup

1. **Insert sample reviews**:

   Use MongoDB Compass or the `mongo` shell to insert review data into the `reviews` collection.

   ```json
   {
     "productId": 1,
     "productModelName": "Ring Video Doorbell 3",
     "productCategory": "smart doorbell",
     "productPrice": 199.99,
     "storeID": "Store#1",
     "storeZip": "60616",
     "storeCity": "Chicago",
     "storeState": "IL",
     "productOnSale": true,
     "manufacturerName": "Ring",
     "manufacturerRebate": false,
     "userID": "user001",
     "userAge": 32,
     "userGender": "Male",
     "userOccupation": "Engineer",
     "reviewRating": 5,
     "reviewDate": "2024-09-28T00:00:00Z",
     "reviewText": "Great product, easy to install and use.",
     "embedding": { "type": ["Number"], "default": null }

   }
   ```

### 4. Usage

#### Frontend:


#### Backend:
- Don't forget to replace the YOUR_API_KEY_HERE with your actual api key



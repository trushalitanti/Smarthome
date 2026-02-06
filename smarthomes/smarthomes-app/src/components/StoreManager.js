import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'smart doorbell',
    accessories: '',
    image: '',
    discount: '',
    rebate: '',
    warranty: 0,
    stock: 0
  });
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    axios.get('http://localhost:3001/products')
      .then(response => {
        setProducts(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/products', newProduct)
      .then(response => {
        alert('Product added successfully');
        fetchProducts();
        setNewProduct({
          name: '',
          price: '',
          description: '',
          category: 'smart doorbell',
          accessories: '',
          image: '',
          discount: '',
          rebate: '',
          warranty: 0,
          stock: 0
        });
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product');
      });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/products/${editProduct.id}`, editProduct)
      .then(response => {
        alert('Product updated successfully');
        fetchProducts();
        setEditProduct(null);
      })
      .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product');
      });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:3001/products/${id}`)
        .then(response => {
          alert('Product deleted successfully');
          fetchProducts();
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        });
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'rgba(22, 24, 29, 0.95)',
      color: '#fff',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginBottom: '1rem',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1.1rem',
    },
    section: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#00ff88',
      marginBottom: '1.5rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#fff',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#00ff88',
        boxShadow: '0 0 0 2px rgba(0, 255, 136, 0.2)',
      },
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: '#00ff88',
      color: '#16181d',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
    },
    deleteButton: {
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#ff3b30',
      border: '1px solid rgba(255, 59, 48, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginLeft: '0.5rem',
      '&:hover': {
        background: '#ff3b30',
        color: '#fff',
        boxShadow: '0 0 15px rgba(255, 59, 48, 0.4)',
      },
    },
    editButton: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#00ff88',
        color: '#16181d',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
      },
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 0.5rem',
    },
    tableHeader: {
      textAlign: 'left',
      padding: '1rem',
      color: '#00ff88',
      fontSize: '1rem',
      fontWeight: '600',
      background: 'rgba(0, 255, 136, 0.1)',
      borderRadius: '10px',
    },
    tableRow: {
      background: 'rgba(255, 255, 255, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        background: 'rgba(255, 255, 255, 0.08)',
      },
    },
    tableCell: {
      padding: '1rem',
      color: '#fff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    loading: {
      textAlign: 'center',
      color: '#00ff88',
      fontSize: '1.2rem',
      padding: '2rem',
    },
    error: {
      textAlign: 'center',
      color: '#ff3b30',
      padding: '1rem',
      background: 'rgba(255, 59, 48, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 59, 48, 0.2)',
      margin: '1rem 0',
    },
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Store Manager Dashboard</h1>
        <p style={styles.subtitle}>Manage your product inventory</p>
      </header>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter product name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter price"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Enter product description"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
              style={styles.select}
            >
              <option value="smart doorbell">Smart Doorbell</option>
              <option value="smart doorlock">Smart Doorlock</option>
              <option value="smart lighting">Smart Lighting</option>
              <option value="smart speaker">Smart Speaker</option>
              <option value="smart thermostat">Smart Thermostat</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Accessories</label>
            <textarea
              name="accessories"
              value={newProduct.accessories}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Enter accessories"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter image URL"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Discount</label>
            <input
              type="number"
              name="discount"
              value={newProduct.discount}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter discount amount"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Rebate</label>
            <input
              type="number"
              name="rebate"
              value={newProduct.rebate}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter rebate amount"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Warranty</label>
            <select
              name="warranty"
              value={newProduct.warranty}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="0">No Warranty</option>
              <option value="1">Warranty Included</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter stock quantity"
            />
          </div>

          <button type="submit" style={styles.button}>Add Product</button>
        </form>
      </div>

      {editProduct && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Update Product</h2>
          <form onSubmit={handleUpdateProduct}>
            {/* Same form fields as Add Product, but with editProduct values */}
            {/* ... */}
            <button type="submit" style={styles.button}>Update Product</button>
          </form>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Product List</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Price</th>
                <th style={styles.tableHeader}>Category</th>
                <th style={styles.tableHeader}>Stock</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>${product.price}</td>
                  <td style={styles.tableCell}>{product.category}</td>
                  <td style={styles.tableCell}>{product.stock}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.editButton}
                      onClick={() => setEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreManager;

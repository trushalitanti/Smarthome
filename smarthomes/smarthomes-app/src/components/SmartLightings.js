import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SmartLightings = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/products?category=smart lighting')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} has been added to your cart successfully!`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '3rem 2rem',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover::before': {
        opacity: 1,
      },
    },
    cardContent: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      color: 'inherit',
    },
    productName: {
      fontSize: '1.5rem',
      color: '#00ff88',
      marginBottom: '1rem',
      fontWeight: '600',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    },
    description: {
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.6',
      marginBottom: '1.5rem',
      flex: 1,
    },
    price: {
      fontSize: '1.3rem',
      color: '#00ff88',
      marginBottom: '1.5rem',
      fontWeight: '500',
    },
    buyButton: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.3)',
      padding: '1rem',
      borderRadius: '25px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      '&:hover': {
        background: '#00ff88',
        color: '#16181d',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
      },
    },
    icon: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#00ff88',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Smart Lightings</h1>
      </header>

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <div style={styles.icon}>💡</div>
            <Link 
              to={`/products/${product.id}`} 
              style={styles.cardContent}
            >
              <h2 style={styles.productName}>{product.name}</h2>
              <p style={styles.description}>{product.description}</p>
              <div style={styles.price}>${product.price}</div>
            </Link>
            <button 
              onClick={() => handleAddToCart(product)}
              style={styles.buyButton}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartLightings;

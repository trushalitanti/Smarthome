import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SmartDoorbells = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/products?category=smart doorbell')
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
      padding: '2rem',
      background: 'rgba(22, 24, 29, 0.95)',
      color: '#fff',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      position: 'relative',
    },
    title: {
      fontSize: '2.5rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginBottom: '1rem',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
      },
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
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
        transform: 'translateY(-5px) scale(1.02)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
      },
    },
    cardContent: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      color: 'inherit',
      position: 'relative',
      zIndex: 1,
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
      fontSize: '1.5rem',
      color: '#00ff88',
      marginBottom: '1.5rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '&::before': {
        content: '"$"',
        fontSize: '1rem',
        opacity: 0.8,
      },
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
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        background: '#00ff88',
        color: '#16181d',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        transform: 'scale(0)',
        transition: 'transform 0.5s ease',
      },
      '&:hover::before': {
        transform: 'scale(1)',
      },
    },
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(0,255,136,0.05) 0%, transparent 100%)',
      pointerEvents: 'none',
    },
    icon: {
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: '#00ff88',
      textShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
      animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
      '0%': { opacity: 0.8, transform: 'scale(1)' },
      '50%': { opacity: 1, transform: 'scale(1.1)' },
      '100%': { opacity: 0.8, transform: 'scale(1)' },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Smart Doorbells</h1>
      </header>

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <div style={styles.cardOverlay} />
            <div style={styles.icon}>🚪</div>
            <Link 
              to={`/products/${product.id}`} 
              style={styles.cardContent}
            >
              <h2 style={styles.productName}>{product.name}</h2>
              <p style={styles.description}>{product.description}</p>
              <div style={styles.price}>{product.price}</div>
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

export default SmartDoorbells;

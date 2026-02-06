import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';

const CustomerDashboard = ({ products, addToCart }) => {
  const userName = localStorage.getItem('userName') || 'Customer';

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'rgba(22, 24, 29, 0.95)',
      color: '#fff',
    },
    header: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginBottom: '1rem',
    },
    welcome: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '2rem',
    },
    quickLinks: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      maxWidth: '800px',
      margin: '0 auto 2rem',
    },
    linkCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#fff',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
      },
    },
    linkIcon: {
      fontSize: '2rem',
      color: '#00ff88',
      marginBottom: '1rem',
    },
    linkText: {
      fontSize: '1.1rem',
      color: '#fff',
    },
    content: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>SMARTHOMES</h1>
        <p style={styles.welcome}>Welcome back, {userName}!</p>
        
        <div style={styles.quickLinks}>
          <Link to="/cart" style={styles.linkCard}>
            <div style={styles.linkIcon}>🛒</div>
            <div style={styles.linkText}>View Cart</div>
          </Link>
          <Link to="/past-orders" style={styles.linkCard}>
            <div style={styles.linkIcon}>📦</div>
            <div style={styles.linkText}>Past Orders</div>
          </Link>
          <Link to="/recommendations" style={styles.linkCard}>
            <div style={styles.linkIcon}>⭐</div>
            <div style={styles.linkText}>Recommendations</div>
          </Link>
          <Link to="/customer-service" style={styles.linkCard}>
            <div style={styles.linkIcon}>💬</div>
            <div style={styles.linkText}>Customer Service</div>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default CustomerDashboard;

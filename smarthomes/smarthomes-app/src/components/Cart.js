import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      navigate('/checkout');
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
      position: 'relative',
    },
    title: {
      fontSize: '2.5rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginBottom: '1rem',
    },
    checkoutButton: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.3)',
      padding: '1rem 2rem',
      borderRadius: '25px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '2rem',
      '&:hover': {
        background: '#00ff88',
        color: '#16181d',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
        transform: 'translateY(-2px)',
      },
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
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
      },
    },
    cardTitle: {
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
    },
    price: {
      fontSize: '1.3rem',
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
    removeButton: {
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#ff3b30',
      border: '1px solid rgba(255, 59, 48, 0.3)',
      padding: '0.8rem 1.5rem',
      borderRadius: '15px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      '&:hover': {
        background: '#ff3b30',
        color: '#fff',
        boxShadow: '0 0 15px rgba(255, 59, 48, 0.4)',
      },
    },
    emptyCart: {
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1.2rem',
      marginTop: '3rem',
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
    bottomCheckout: {
      display: 'flex',
      justifyContent: 'flex-end',
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Your Cart</h1>
        {cartItems.length > 0 && (
          <button style={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        )}
      </header>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          Your cart is empty.
        </div>
      ) : (
        <div style={styles.grid}>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardOverlay} />
              <h2 style={styles.cardTitle}>{item.name}</h2>
              <p style={styles.description}>{item.description}</p>
              <div style={styles.price}>{item.price}</div>
              <button 
                style={styles.removeButton}
                onClick={() => removeFromCart(item.id)}
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div style={styles.bottomCheckout}>
          <button style={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

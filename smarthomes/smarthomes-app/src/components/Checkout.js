import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [creditCard, setCreditCard] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('homeDelivery');
  const [storeLocation, setStoreLocation] = useState('');
  const [storeLocations, setStoreLocations] = useState([]);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/store-locations')
      .then(response => response.json())
      .then(data => setStoreLocations(data))
      .catch(error => console.error('Error fetching store locations:', error));
  }, []);

  const generateConfirmationNumber = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };

  const generateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 14));
    return deliveryDate.toDateString();
  };

  const subtotal = cartItems.reduce((total, item) => total + Number(item.price), 0);
  const taxRate = 0.12;
  const estimatedTax = subtotal * taxRate;
  const totalPrice = subtotal + estimatedTax;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    const confirmationNum = generateConfirmationNumber();
    const deliveryDate = generateDeliveryDate();
    const formattedDeliveryDate = new Date(deliveryDate).toISOString().split('T')[0];

    const updatedCartItems = cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));

    const orderDetails = {
      userId,
      totalPrice: totalPrice.toFixed(2),
      deliveryMethod,
      storeLocation: deliveryMethod === 'inStorePickup' ? storeLocation : null,
      deliveryDate: formattedDeliveryDate,
      cartItems: updatedCartItems,
      address: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      creditCard
    };

    fetch('http://localhost:3001/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Order placed successfully') {
          alert(`Order confirmed! Your confirmation number is ${confirmationNum}`);
          navigate('/');
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error placing order');
      });
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
      marginBottom: '2rem',
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
    cartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    cartItem: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    },
    itemTitle: {
      fontSize: '1.2rem',
      color: '#00ff88',
      marginBottom: '1rem',
    },
    itemPrice: {
      color: '#00ff88',
      fontSize: '1.1rem',
      fontWeight: '500',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#fff',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
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
    radioGroup: {
      display: 'flex',
      gap: '2rem',
      marginTop: '0.5rem',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    radioInput: {
      appearance: 'none',
      width: '20px',
      height: '20px',
      border: '2px solid rgba(0, 255, 136, 0.5)',
      borderRadius: '50%',
      position: 'relative',
      cursor: 'pointer',
      '&:checked': {
        backgroundColor: '#00ff88',
        boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      },
    },
    summary: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '1rem',
      paddingTop: '1rem',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      fontSize: '1.1rem',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '1.3rem',
      color: '#00ff88',
      fontWeight: '600',
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      background: '#00ff88',
      color: '#16181d',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '2rem',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Checkout</h1>
      </header>

      <div style={styles.section}>
        <h2 style={styles.itemTitle}>Cart Items</h2>
        <div style={styles.cartGrid}>
          {cartItems.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <h3 style={styles.itemTitle}>{item.name}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item.description}</p>
              <p style={styles.itemPrice}>${item.price}</p>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Estimated Tax (12%)</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckout}>
        <div style={styles.section}>
          <h2 style={styles.itemTitle}>Personal Information</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
              style={styles.input}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Zip Code</label>
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                required
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.itemTitle}>Payment Information</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Credit Card Number</label>
            <input
              type="text"
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.itemTitle}>Delivery Method</h2>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="deliveryMethod"
                value="homeDelivery"
                checked={deliveryMethod === 'homeDelivery'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                style={styles.radioInput}
              />
              Home Delivery
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="deliveryMethod"
                value="inStorePickup"
                checked={deliveryMethod === 'inStorePickup'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                style={styles.radioInput}
              />
              In-Store Pickup
            </label>
          </div>

          {deliveryMethod === 'inStorePickup' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Store Location</label>
              <select
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">Select a store</option>
                {storeLocations.map((store) => (
                  <option key={store.StoreID} value={store.street}>
                    {store.street}, {store.city}, {store.state} - {store.zip_code}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button type="submit" style={styles.submitButton}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;

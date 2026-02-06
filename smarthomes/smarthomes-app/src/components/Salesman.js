import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Salesman = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    total_price: '',
    delivery_method: 'homeDelivery',
    store_location: '',
    delivery_date: ''
  });
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:3001/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  const fetchOrders = () => {
    axios.get('http://localhost:3001/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/customers', newCustomer)
      .then(response => {
        alert('Customer created successfully');
        fetchCustomers();
        setNewCustomer({
          name: '',
          email: '',
          password: '',
          role: 'customer'
        });
      })
      .catch(error => {
        console.error('Error creating customer:', error);
      });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/orders', newOrder)
      .then(response => {
        alert('Order added successfully');
        fetchOrders();
        setNewOrder({
          user_id: '',
          total_price: '',
          delivery_method: 'homeDelivery',
          store_location: '',
          delivery_date: ''
        });
      })
      .catch(error => {
        console.error('Error adding order:', error);
      });
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/orders/${editOrder.id}`, editOrder)
      .then(response => {
        alert('Order updated successfully');
        fetchOrders();
        setEditOrder(null);
      })
      .catch(error => {
        console.error('Error updating order:', error);
      });
  };

  const handleDeleteOrder = (orderId) => {
    axios.delete(`http://localhost:3001/orders/${orderId}`)
      .then(response => {
        alert('Order deleted successfully');
        fetchOrders();
      })
      .catch(error => {
        console.error('Error deleting order:', error);
      });
  };

  const handleInputChange = (e, isOrderEdit = false, isCustomer = false) => {
    const { name, value } = e.target;

    if (isOrderEdit && editOrder) {
      setEditOrder({ ...editOrder, [name]: value });
    } else if (isCustomer) {
      setNewCustomer({ ...newCustomer, [name]: value });
    } else {
      setNewOrder({ ...newOrder, [name]: value });
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
    button: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(45deg, #00ff88, #00cc6f)',
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
    status: {
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      display: 'inline-block',
    },
    statusPending: {
      background: 'rgba(255, 196, 0, 0.1)',
      color: '#ffc400',
      border: '1px solid rgba(255, 196, 0, 0.2)',
    },
    statusDelivered: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Salesman Dashboard</h1>
      </header>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add New Customer</h2>
        <form onSubmit={handleAddCustomer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={(e) => handleInputChange(e, false, true)}
              required
              style={styles.input}
              placeholder="Enter customer name"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Email</label>
            <input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={(e) => handleInputChange(e, false, true)}
              required
              style={styles.input}
              placeholder="Enter customer email"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={newCustomer.password}
              onChange={(e) => handleInputChange(e, false, true)}
              required
              style={styles.input}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" style={styles.button}>Add Customer</button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add New Order</h2>
        <form onSubmit={handleAddOrder}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Customer</label>
            <select
              name="user_id"
              value={newOrder.user_id}
              onChange={(e) => handleInputChange(e)}
              required
              style={styles.select}
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} (ID: {customer.id})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Total Price</label>
            <input
              type="number"
              name="total_price"
              value={newOrder.total_price}
              onChange={(e) => handleInputChange(e)}
              required
              style={styles.input}
              placeholder="Enter total price"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Method</label>
            <select
              name="delivery_method"
              value={newOrder.delivery_method}
              onChange={handleInputChange}
              required
              style={styles.select}
            >
              <option value="homeDelivery">Home Delivery</option>
              <option value="inStorePickup">In-store Pickup</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Store Location</label>
            <input
              type="text"
              name="store_location"
              value={newOrder.store_location}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Store location (for in-store pickup)"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Date</label>
            <input
              type="date"
              name="delivery_date"
              value={newOrder.delivery_date}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Add Order</button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Order List</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Order ID</th>
                <th style={styles.tableHeader}>Customer</th>
                <th style={styles.tableHeader}>Total Price</th>
                <th style={styles.tableHeader}>Delivery Method</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{order.id}</td>
                  <td style={styles.tableCell}>{order.user_id}</td>
                  <td style={styles.tableCell}>${order.total_price}</td>
                  <td style={styles.tableCell}>{order.delivery_method}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.status,
                      ...(order.status === 'delivered' ? styles.statusDelivered : styles.statusPending)
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.editButton}
                      onClick={() => setEditOrder(order)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteOrder(order.id)}
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

      {editOrder && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Update Order</h2>
          <form onSubmit={handleUpdateOrder}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Price</label>
              <input
                type="number"
                name="total_price"
                value={editOrder.total_price}
                onChange={(e) => handleInputChange(e, true)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Method</label>
              <select
                name="delivery_method"
                value={editOrder.delivery_method}
                onChange={(e) => handleInputChange(e, true)}
                required
                style={styles.select}
              >
                <option value="homeDelivery">Home Delivery</option>
                <option value="inStorePickup">In-store Pickup</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Date</label>
              <input
                type="date"
                name="delivery_date"
                value={editOrder.delivery_date}
                onChange={(e) => handleInputChange(e, true)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>Update Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Salesman;

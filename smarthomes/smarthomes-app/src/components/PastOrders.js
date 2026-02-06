import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:3001/past-orders/${userId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching past orders:', error);
      });
  }, [userId]);

  const handleCancelOrder = (orderId) => {
    axios.delete(`http://localhost:3001/cancel-order/${orderId}`)
      .then(response => {
        alert('Order canceled successfully');
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'cancelled' } : order));
      })
      .catch(error => {
        console.error('Error canceling order:', error);
        alert('Error canceling order');
      });
  };

  const handleUpdateOrder = (orderId) => {
    if (updateStatus === '') {
      alert('Please enter a new status');
      return;
    }

    axios.put(`http://localhost:3001/update-order/${orderId}`, { status: updateStatus })
      .then(response => {
        alert('Order updated successfully');
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: updateStatus } : order));
        setIsUpdating(null);
      })
      .catch(error => {
        console.error('Error updating order:', error);
        alert('Error updating order');
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
      marginBottom: '1rem',
    },
    content: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateY(-2px)',
      },
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    price: {
      color: '#00ff88',
      fontWeight: '500',
    },
    status: {
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      textAlign: 'center',
      display: 'inline-block',
    },
    statusPending: {
      background: 'rgba(255, 196, 0, 0.1)',
      color: '#ffc400',
      border: '1px solid rgba(255, 196, 0, 0.2)',
    },
    statusCancelled: {
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#ff3b30',
      border: '1px solid rgba(255, 59, 48, 0.2)',
    },
    statusDelivered: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.2)',
    },
    cancelButton: {
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#ff3b30',
      border: '1px solid rgba(255, 59, 48, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#ff3b30',
        color: '#fff',
        boxShadow: '0 0 15px rgba(255, 59, 48, 0.4)',
      },
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1.2rem',
    },
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'cancelled':
        return styles.statusCancelled;
      case 'delivered':
        return styles.statusDelivered;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Past Orders</h1>
      </header>

      <div style={styles.content}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            No orders placed yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Order ID</th>
                  <th style={styles.tableHeader}>Total Price</th>
                  <th style={styles.tableHeader}>Delivery Method</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Delivery Date</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{order.id}</td>
                    <td style={{...styles.tableCell, ...styles.price}}>${order.total_price}</td>
                    <td style={styles.tableCell}>{order.delivery_method}</td>
                    <td style={styles.tableCell}>
                      <span style={{...styles.status, ...getStatusStyle(order.status)}}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </td>
                    <td style={styles.tableCell}>
                      {order.status !== 'cancelled' && (
                        <button
                          style={styles.cancelButton}
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastOrders;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const OpenTicket = () => {
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    category: 'smart doorbell',
    description: '',
    orderId: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:3001/past-orders/${userId}`)
        .then(response => {
          setPastOrders(response.data);
        })
        .catch(error => {
          console.error('Error fetching past orders:', error);
          setPastOrders([]);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 16 * 1024 * 1024) {
      setMessage('File size exceeds the 16MB limit');
      setMessageType('error');
      return;
    }
    setFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', ticketData.name);
    formData.append('email', ticketData.email);
    formData.append('category', ticketData.category);
    formData.append('description', ticketData.description);
    formData.append('orderId', ticketData.orderId);
  
    if (file) {
      formData.append('image', file);
    }
  
    axios.post('http://localhost:3001/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const { ticketNumber } = response.data;
      setMessage('Ticket submitted successfully!');
      setMessageType('success');
      setTicketNumber(ticketNumber);
      setShowModal(true);
    })
    .catch(error => {
      console.error('There was an error submitting the ticket!', error);
      setMessage('Failed to submit ticket');
      setMessageType('error');
    });
  };

  const handleCloseModal = () => setShowModal(false);

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
    formCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
      minHeight: '150px',
      resize: 'vertical',
    },
    fileInput: {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
    },
    fileLabel: {
      display: 'block',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
      },
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
      marginTop: '1rem',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
    },
    message: {
      padding: '1rem',
      borderRadius: '10px',
      marginTop: '1rem',
      textAlign: 'center',
    },
    successMessage: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.2)',
    },
    errorMessage: {
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#ff3b30',
      border: '1px solid rgba(255, 59, 48, 0.2)',
    },
    modalContent: {
      background: 'rgba(22, 24, 29, 0.95)',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      borderRadius: '20px',
      color: '#fff',
    },
    modalHeader: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
    },
    modalTitle: {
      color: '#00ff88',
      margin: 0,
    },
    modalBody: {
      padding: '1.5rem',
    },
    modalFooter: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
    },
    modalButton: {
      background: '#00ff88',
      color: '#16181d',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Open a Support Ticket</h1>
      </header>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              name="name"
              value={ticketData.name}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={ticketData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Category</label>
            <select
              name="category"
              value={ticketData.category}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="smart doorbell">Smart Doorbell</option>
              <option value="smart speaker">Smart Speaker</option>
              <option value="smart lighting">Smart Lighting</option>
              <option value="smart thermostat">Smart Thermostat</option>
              <option value="smart doorlock">Smart Doorlock</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Order ID</label>
            <select
              name="orderId"
              value={ticketData.orderId}
              onChange={handleInputChange}
              required
              style={styles.select}
            >
              <option value="">Select an Order</option>
              {pastOrders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.status}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Issue Description</label>
            <textarea
              name="description"
              value={ticketData.description}
              onChange={handleInputChange}
              required
              style={styles.textarea}
              placeholder="Describe your issue in detail"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Image</label>
            <div style={styles.fileInput}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={styles.fileLabel}>
                {file ? file.name : 'Choose a file'}
              </label>
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Submit Ticket
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            ...(messageType === 'success' ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <div style={styles.modalContent}>
          <Modal.Header closeButton style={styles.modalHeader}>
            <Modal.Title style={styles.modalTitle}>Ticket Created</Modal.Title>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <p>Your ticket has been submitted successfully!</p>
            <p>Your Ticket Number: <strong>{ticketNumber}</strong></p>
            <p>Please save this number to check your ticket status later.</p>
          </Modal.Body>
          <Modal.Footer style={styles.modalFooter}>
            <button onClick={handleCloseModal} style={styles.modalButton}>
              OK
            </button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default OpenTicket;

import React, { useState } from 'react';
import axios from 'axios';

const TicketStatus = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [decision, setDecision] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setTicketNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.get(`http://localhost:3001/tickets/status/${ticketNumber}`)
      .then(response => {
        setTicketDetails(response.data.ticketDetails);
        setDecision(response.data.decision);
        setError('');
      })
      .catch(error => {
        console.error('There was an error fetching the ticket status!', error);
        setError('Failed to fetch the ticket status. Please try again.');
        setTicketDetails(null);
        setDecision('');
      })
      .finally(() => {
        setIsLoading(false);
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
    formCard: {
      maxWidth: '600px',
      margin: '0 auto 2rem',
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
      marginBottom: '1rem',
    },
    button: {
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
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
    },
    error: {
      color: '#ff3b30',
      textAlign: 'center',
      marginTop: '1rem',
      padding: '0.75rem',
      background: 'rgba(255, 59, 48, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 59, 48, 0.2)',
    },
    detailsCard: {
      maxWidth: '600px',
      margin: '2rem auto',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      animation: 'fadeIn 0.5s ease',
    },
    detailsTitle: {
      fontSize: '1.5rem',
      color: '#00ff88',
      marginBottom: '1.5rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    },
    detailsRow: {
      marginBottom: '1rem',
      padding: '0.75rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '10px',
    },
    detailsLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '0.25rem',
      fontSize: '0.9rem',
    },
    detailsValue: {
      color: '#fff',
      fontSize: '1rem',
    },
    status: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    statusPending: {
      background: 'rgba(255, 196, 0, 0.1)',
      color: '#ffc400',
      border: '1px solid rgba(255, 196, 0, 0.2)',
    },
    statusResolved: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      border: '1px solid rgba(0, 255, 136, 0.2)',
    },
    loading: {
      textAlign: 'center',
      color: '#00ff88',
      marginTop: '1rem',
    },
  };

  const getStatusStyle = (status) => {
    return status?.toLowerCase().includes('resolved') ? styles.statusResolved : styles.statusPending;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Check Ticket Status</h1>
      </header>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ticket Number</label>
            <input
              type="text"
              value={ticketNumber}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Enter your ticket number"
            />
          </div>
          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}
      </div>

      {ticketDetails && (
        <div style={styles.detailsCard}>
          <h2 style={styles.detailsTitle}>Ticket Details</h2>
          
          <div style={styles.detailsRow}>
            <div style={styles.detailsLabel}>Name</div>
            <div style={styles.detailsValue}>{ticketDetails.name}</div>
          </div>
          
          <div style={styles.detailsRow}>
            <div style={styles.detailsLabel}>Email</div>
            <div style={styles.detailsValue}>{ticketDetails.email}</div>
          </div>
          
          <div style={styles.detailsRow}>
            <div style={styles.detailsLabel}>Description</div>
            <div style={styles.detailsValue}>{ticketDetails.description}</div>
          </div>
          
          <div style={styles.detailsRow}>
            <div style={styles.detailsLabel}>Status</div>
            <div style={styles.detailsValue}>
              <span style={{
                ...styles.status,
                ...getStatusStyle(ticketDetails.status)
              }}>
                {ticketDetails.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketStatus;

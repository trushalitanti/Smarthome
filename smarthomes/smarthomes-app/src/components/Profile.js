import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    id: '',
    name: '',
    email: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    setUserDetails({
      id: userId,
      name: userName,
      email: userEmail,
      role: userRole
    });
  }, []);

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
    card: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    },
    avatarSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
      position: 'relative',
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '60px',
      background: 'linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      marginBottom: '1rem',
      border: '2px solid rgba(0, 255, 136, 0.3)',
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
    },
    userName: {
      fontSize: '1.5rem',
      color: '#fff',
      marginBottom: '0.5rem',
    },
    roleBadge: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      border: '1px solid rgba(0, 255, 136, 0.3)',
    },
    infoSection: {
      marginTop: '2rem',
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      '&:last-child': {
        borderBottom: 'none',
        marginBottom: 0,
      },
    },
    infoLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      width: '120px',
      fontSize: '0.9rem',
    },
    infoValue: {
      color: '#fff',
      flex: 1,
      fontSize: '1rem',
    },
    icon: {
      marginRight: '1rem',
      color: '#00ff88',
      fontSize: '1.2rem',
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
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
      </header>

      <div style={styles.card}>
        <div style={styles.cardOverlay} />
        
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {userDetails.name ? userDetails.name[0].toUpperCase() : '?'}
          </div>
          <h2 style={styles.userName}>{userDetails.name}</h2>
          <span style={styles.roleBadge}>
            {userDetails.role?.charAt(0).toUpperCase() + userDetails.role?.slice(1)}
          </span>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <span style={styles.icon}>🆔</span>
            <span style={styles.infoLabel}>User ID</span>
            <span style={styles.infoValue}>{userDetails.id}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.icon}>📧</span>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{userDetails.email}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.icon}>👤</span>
            <span style={styles.infoLabel}>Role</span>
            <span style={styles.infoValue}>
              {userDetails.role?.charAt(0).toUpperCase() + userDetails.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { email, password })
      .then((response) => {
        console.log(response)
        if (response.status === 200 && response.data.role) {
          const userRole = response.data.role;
          const userEmail = response.data.email;
          const userName = response.data.name;
          console.log(response)

          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userName', userName);

          if (userRole === 'storeManager') {
            navigate('/store-manager');
          } else if (userRole === 'salesman') {
            navigate('/salesman');
          } else {
            navigate('/customer');
          }
        } else {
          alert('Login failed: Missing role');
        }
      })
      .catch((error) => {
        alert('Login failed');
        console.error(error);
      });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'rgba(22, 24, 29, 0.95)',
    },
    formCard: {
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontSize: '2rem',
      color: '#00ff88',
      textAlign: 'center',
      marginBottom: '2rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
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
      '&:focus': {
        outline: 'none',
        borderColor: '#00ff88',
      },
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      background: '#00ff88',
      color: '#16181d',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
    },
    signupText: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#fff',
    },
    signupLink: {
      color: '#00ff88',
      textDecoration: 'none',
      marginLeft: '0.5rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      },
    },
    formOverlay: {
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
      <div style={styles.formCard}>
        <div style={styles.formOverlay} />
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
              style={styles.select}
            >
              <option value="customer">Customer</option>
              <option value="salesman">Salesman</option>
              <option value="storeManager">Store Manager</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton}>
            Login
          </button>
        </form>
        <div style={styles.signupText}>
          Don't have an account?
          <Link to="/signup" style={styles.signupLink}>
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    axios.post('http://localhost:3001/signup', { name, email, password, role })
      .then((response) => {
        alert('Signup successful');
        console.log(response.data);
      })
      .catch((error) => {
        alert('Error signing up');
        console.error(error);
      });
  };

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
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
      maxWidth: '450px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2.5rem',
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
      '&:focus': {
        outline: 'none',
        borderColor: '#00ff88',
      },
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(45deg, #00ff88, #00cc6f)',
      color: '#16181d',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        transform: 'scale(0)',
        transition: 'transform 0.5s ease',
      },
      '&:hover::before': {
        transform: 'scale(1)',
      },
    },
    loginText: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#fff',
    },
    loginLink: {
      color: '#00ff88',
      textDecoration: 'none',
      marginLeft: '0.5rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      },
    },
    passwordStrength: {
      height: '3px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      marginTop: '0.5rem',
      overflow: 'hidden',
    },
    strengthIndicator: {
      height: '100%',
      width: '0%',
      background: '#00ff88',
      transition: 'all 0.3s ease',
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
        <h1 style={styles.title}>Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <div style={styles.passwordStrength}>
              <div 
                style={{
                  ...styles.strengthIndicator,
                  width: `${getPasswordStrength(password)}%`,
                  background: `hsl(${getPasswordStrength(password)}, 100%, 50%)`,
                }}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </button>
        </form>

        <div style={styles.loginText}>
          Already have an account?
          <Link to="/login" style={styles.loginLink}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255, 255, 255, 0.7)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    searchContainer: {
      maxWidth: '800px',
      margin: '0 auto 2rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    searchInput: {
      width: '100%',
      padding: '1.2rem 1.5rem',
      fontSize: '1.1rem',
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      outline: 'none',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    searchButton: {
      width: '100%',
      marginTop: '1rem',
      padding: '1rem',
      fontSize: '1.1rem',
      color: '#16181d',
      background: '#00ff88',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
      },
    },
    recommendationsList: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem',
    },
    recommendationCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
      },
    },
    productName: {
      fontSize: '1.2rem',
      color: '#00ff88',
      marginBottom: '0.5rem',
      fontWeight: '600',
    },
    productDescription: {
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.6',
    },
    noResults: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: '2rem',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#00ff88',
      marginTop: '2rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    }
  };

  const handleRecommend = async () => {
    if (!query.trim()) {
      alert('Please enter a product description.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/recommend-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Product Recommendations</h1>
        <p style={styles.subtitle}>
          Describe what you're looking for, and we'll find the perfect products for you
        </p>
      </header>

      <div style={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your ideal product..."
          style={styles.searchInput}
        />
        <button
          onClick={handleRecommend}
          disabled={loading}
          style={styles.searchButton}
        >
          {loading ? 'Finding Products...' : 'Get Recommendations'}
        </button>
      </div>

      {loading && (
        <div style={styles.loadingText}>
          Searching for perfect matches...
        </div>
      )}

      {!loading && recommendations.length === 0 && query && (
        <div style={styles.noResults}>
          No recommendations found for your description.
        </div>
      )}

      {!loading && recommendations.length === 0 && !query && (
        <div style={styles.noResults}>
          Start by describing what you're looking for above.
        </div>
      )}

      <div style={styles.recommendationsList}>
        {recommendations.map((product, index) => (
          <div
            key={index}
            onClick={() => handleProductClick(product.id)}
            style={styles.recommendationCard}
          >
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productDescription}>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;

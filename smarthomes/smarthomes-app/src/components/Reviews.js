import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  const [query, setQuery] = useState('');
  const [reviews, setReviews] = useState([]);
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
      padding: '1rem 1.5rem',
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
    reviewsList: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    reviewCard: {
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
      },
    },
    rating: {
      fontSize: '1.2rem',
      color: '#00ff88',
      marginBottom: '0.5rem',
    },
    reviewText: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '1rem',
    },
    productInfo: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      padding: '0.5rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '0.8rem',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    noReviews: {
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
    }
  };

  const handleSearchReviews = async () => {
    if (!query.trim()) {
      alert('Please enter a review query.');
      return;
    }

    setLoading(true);

    try {
      console.log('Fetching reviews for query:', query);
      const response = await axios.post('http://localhost:3001/search-reviews', { query });
      console.log('Fetched reviews:', response.data.results);
      setReviews(response.data.results);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Search Reviews</h1>
      </header>

      <div style={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter review search query..."
          style={styles.searchInput}
        />
        <button
          onClick={handleSearchReviews}
          disabled={loading}
          style={styles.searchButton}
        >
          {loading ? 'Searching...' : 'Search Reviews'}
        </button>
      </div>

      <div style={styles.reviewsList}>
        {loading && (
          <div style={styles.loadingText}>Searching for reviews...</div>
        )}

        {!loading && reviews.length === 0 && query && (
          <div style={styles.noReviews}>
            No reviews found for your query.
          </div>
        )}

        {!loading && reviews.length === 0 && !query && (
          <div style={styles.noReviews}>
            Search for reviews by entering a query above.
          </div>
        )}

        {reviews.map((review, index) => (
          <div
            key={index}
            onClick={() => handleRedirect(review.productId)}
            style={styles.reviewCard}
          >
            <div style={styles.rating}>
              Rating: {review.reviewRating}/5 ★
            </div>
            <div style={styles.reviewText}>
              {review.reviewText}
            </div>
            <div style={styles.productInfo}>
              <strong>{review.productModelName}</strong> - {review.productCategory}
            </div>
            <div style={styles.metadata}>
              <span>Store: {review.storeCity}, {review.storeState}</span>
              <span>Date: {new Date(review.reviewDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;

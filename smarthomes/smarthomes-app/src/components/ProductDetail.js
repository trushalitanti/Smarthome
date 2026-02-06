import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });

    axios.get(`http://localhost:3001/accessories?productId=${parseInt(id)}`)
      .then((response) => {
        setAccessories(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error('Error fetching accessories:', error);
      });

    axios.get(`http://localhost:3001/reviews?productId=${parseInt(id)}`)
      .then((response) => {
        setReviews(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, [id]);

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'rgba(22, 24, 29, 0.95)',
      color: '#fff',
    },
    productHero: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    productTitle: {
      fontSize: '2.5rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginBottom: '1rem',
    },
    productDescription: {
      fontSize: '1.1rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    priceTag: {
      fontSize: '1.8rem',
      color: '#00ff88',
      marginBottom: '1rem',
    },
    badge: {
      background: 'rgba(0, 255, 136, 0.1)',
      color: '#00ff88',
      padding: '0.5rem 1rem',
      borderRadius: '15px',
      margin: '0.5rem 1rem 0.5rem 0',
      display: 'inline-block',
      border: '1px solid rgba(0, 255, 136, 0.3)',
    },
    button: {
      background: '#00ff88',
      color: '#16181d',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '25px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
      },
    },
    sectionTitle: {
      fontSize: '2rem',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
      marginBottom: '1.5rem',
      marginTop: '3rem',
    },
    accessoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0',
    },
    accessoryCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
      },
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0',
    },
    reviewCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
    },
    rating: {
      color: '#00ff88',
      fontSize: '1.2rem',
      marginBottom: '1rem',
    },
    reviewText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    reviewMeta: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.9rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '1rem',
      marginTop: '1rem',
    },
    loadingText: {
      fontSize: '1.5rem',
      color: '#00ff88',
      textAlign: 'center',
      marginTop: '3rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    },
  };

  const handleWriteReview = () => {
    navigate(`/write-review/${id}`, { state: { product, productId: id } });
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading...</div>;
  }

  if (!product) {
    return <div style={styles.loadingText}>Product not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.productHero}>
        <h1 style={styles.productTitle}>{product.name}</h1>
        <p style={styles.productDescription}>{product.description}</p>
        <div style={styles.priceTag}>${product.price}</div>
        
        {product.discount && (
          <span style={styles.badge}>Discount: ${product.discount}</span>
        )}
        {product.rebate && (
          <span style={styles.badge}>Rebate: ${product.rebate}</span>
        )}
        {product.warranty && (
          <span style={styles.badge}>Warranty Included</span>
        )}
        
        <button onClick={handleWriteReview} style={styles.button}>
          Write a Review
        </button>
      </div>

      {accessories.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>Recommended Accessories</h2>
          <div style={styles.accessoryGrid}>
            {accessories.map((accessory) => (
              <div key={accessory.id} style={styles.accessoryCard}>
                <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>{accessory.name}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
                  {accessory.description}
                </p>
                <div style={{ color: '#00ff88', fontSize: '1.2rem' }}>
                  ${accessory.price}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={styles.sectionTitle}>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
          No reviews yet. Be the first to write a review!
        </p>
      ) : (
        <div style={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              <div style={styles.rating}>
                Rating: {review.reviewRating}/5 ★
              </div>
              <p style={styles.reviewText}>{review.reviewText}</p>
              <div style={styles.reviewMeta}>
                <div>By {review.userOccupation}, {review.userAge} years old</div>
                <div>Reviewed on: {new Date(review.reviewDate).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

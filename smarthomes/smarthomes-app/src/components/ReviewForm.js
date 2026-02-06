import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const ReviewForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};

    const [review, setReview] = useState({
        productId: id,
        productModelName: product ? product.name : '',
        productCategory: product ? product.category : '',
        productPrice: product ? product.price : '',
        storeID: '',
        storeZip: '',
        storeCity: '',
        storeState: '',
        productOnSale: false,
        manufacturerName: '',
        manufacturerRebate: false,
        userID: '',
        userAge: '',
        userGender: '',
        userOccupation: '',
        reviewRating: '',
        reviewDate: '',
        reviewText: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setReview({ ...review, [name]: fieldValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalReview = {
            ...review,
            productOnSale: review.productOnSale || false,
            manufacturerRebate: review.manufacturerRebate || false
        };

        axios.post('http://localhost:3001/reviews', finalReview)
            .then(() => {
                alert('Review submitted successfully!');
                navigate(`/products/${id}`);
            })
            .catch((error) => {
                console.error('Error submitting review:', error);
            });
    };

    const handleCancel = () => {
        navigate(`/products/${id}`);
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
        subtitle: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.1rem',
        },
        form: {
            maxWidth: '800px',
            margin: '0 auto',
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
            fontSize: '1.3rem',
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
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
        },
        submitButton: {
            padding: '1rem 2rem',
            background: 'linear-gradient(45deg, #00ff88, #00cc6f)',
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
        cancelButton: {
            padding: '1rem 2rem',
            background: 'rgba(255, 59, 48, 0.1)',
            color: '#ff3b30',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginLeft: '1rem',
            '&:hover': {
                background: '#ff3b30',
                color: '#fff',
                transform: 'translateY(-2px)',
                boxShadow: '0 0 20px rgba(255, 59, 48, 0.4)',
            },
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
        },
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Write a Review</h1>
                <p style={styles.subtitle}>for {product ? product.name : 'Product'}</p>
            </header>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Product Information</h2>
                    <div style={styles.grid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Product Model Name</label>
                            <input
                                type="text"
                                name="productModelName"
                                value={review.productModelName}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Product Category</label>
                            <input
                                type="text"
                                name="productCategory"
                                value={review.productCategory}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Product Price</label>
                            <input
                                type="number"
                                name="productPrice"
                                value={review.productPrice}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Store Information</h2>
                    <div style={styles.grid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Store ID</label>
                            <input
                                type="text"
                                name="storeID"
                                value={review.storeID}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Store Zip</label>
                            <input
                                type="text"
                                name="storeZip"
                                value={review.storeZip}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Store City</label>
                            <input
                                type="text"
                                name="storeCity"
                                value={review.storeCity}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Store State</label>
                            <input
                                type="text"
                                name="storeState"
                                value={review.storeState}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Product Details</h2>
                    <div style={styles.grid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Product On Sale</label>
                            <select
                                name="productOnSale"
                                value={review.productOnSale}
                                onChange={handleInputChange}
                                required
                                style={styles.select}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Manufacturer Name</label>
                            <input
                                type="text"
                                name="manufacturerName"
                                value={review.manufacturerName}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Manufacturer Rebate</label>
                            <select
                                name="manufacturerRebate"
                                value={review.manufacturerRebate}
                                onChange={handleInputChange}
                                required
                                style={styles.select}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>User Information</h2>
                    <div style={styles.grid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>User ID</label>
                            <input
                                type="text"
                                name="userID"
                                value={review.userID}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>User Age</label>
                            <input
                                type="number"
                                name="userAge"
                                value={review.userAge}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>User Gender</label>
                            <select
                                name="userGender"
                                value={review.userGender}
                                onChange={handleInputChange}
                                required
                                style={styles.select}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>User Occupation</label>
                            <input
                                type="text"
                                name="userOccupation"
                                value={review.userOccupation}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Review Details</h2>
                    <div style={styles.grid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Review Rating (1-5)</label>
                            <input
                                type="number"
                                name="reviewRating"
                                value={review.reviewRating}
                                onChange={handleInputChange}
                                min="1"
                                max="5"
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Review Date</label>
                            <input
                                type="date"
                                name="reviewDate"
                                value={review.reviewDate}
                                onChange={handleInputChange}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Review Text</label>
                        <textarea
                            name="reviewText"
                            value={review.reviewText}
                            onChange={handleInputChange}
                            required
                            style={styles.textarea}
                            placeholder="Write your detailed review here..."
                        />
                    </div>
                </div>

                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.submitButton}>
                        Submit Review
                    </button>
                    <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;

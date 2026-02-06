import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';

const COLORS = ['#00ff88', '#00e6b8', '#00ccff', '#3399ff', '#6666ff'];

const Trending = () => {
  const [topZips, setTopZips] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const [topZipsRes, topSoldProductsRes, topRatedProductsRes] = await Promise.all([
          fetch('http://localhost:3001/trending/top-zipcodes'),
          fetch('http://localhost:3001/trending/most-sold'),
          fetch('http://localhost:3001/trending/most-liked')
        ]);

        if (topZipsRes.ok) {
          const topZipsData = await topZipsRes.json();
          setTopZips(topZipsData);
        }

        if (topSoldProductsRes.ok) {
          const topSoldProductsData = await topSoldProductsRes.json();
          setTopSoldProducts(topSoldProductsData);
        }

        if (topRatedProductsRes.ok) {
          const topRatedProductsData = await topRatedProductsRes.json();
          setTopRatedProducts(topRatedProductsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load trending data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  const pieData = topSoldProducts.map((product) => ({
    name: product.orderName,
    value: parseInt(product.totalSold, 10),
  }));

  const topRatedData = topRatedProducts.map((product) => ({
    name: product._id,
    value: parseFloat(product.averageRating),
  }));

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
      fontSize: '1.5rem',
      color: '#00ff88',
      marginBottom: '1.5rem',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    },
    chartContainer: {
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '15px',
      padding: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    loading: {
      textAlign: 'center',
      color: '#00ff88',
      fontSize: '1.2rem',
      padding: '2rem',
    },
    error: {
      textAlign: 'center',
      color: '#ff3b30',
      padding: '1rem',
      background: 'rgba(255, 59, 48, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 59, 48, 0.2)',
      margin: '1rem 0',
    },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(22, 24, 29, 0.95)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          padding: '1rem',
          borderRadius: '10px',
        }}>
          <p style={{ color: '#00ff88' }}>{`${label}`}</p>
          <p style={{ color: '#fff' }}>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading trending data...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Trending Analytics</h1>
      </header>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Top Products by Zip Code</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topZips}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="store_location" 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <YAxis 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalOrders" 
                fill="#00ff88"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Top 5 Most Sold Products</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#fff' }}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{
                  background: 'rgba(22, 24, 29, 0.95)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '10px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Top 5 Rated Products</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topRatedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#00ff88"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Trending;

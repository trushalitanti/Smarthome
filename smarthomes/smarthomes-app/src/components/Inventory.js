import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [rebateProducts, setRebateProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/inventory/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    axios.get('http://localhost:3001/inventory/products/bar-chart')
      .then(response => {
        setBarChartData(response.data);
      })
      .catch(error => {
        console.error('Error fetching bar chart data:', error);
      });

    axios.get('http://localhost:3001/inventory/products/sale')
      .then(response => {
        setSaleProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching sale products:', error);
      });

    axios.get('http://localhost:3001/inventory/products/rebates')
      .then(response => {
        setRebateProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching rebate products:', error);
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
      marginBottom: '2rem',
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
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 0.5rem',
    },
    tableHeader: {
      textAlign: 'left',
      padding: '1rem',
      color: '#00ff88',
      fontSize: '1rem',
      fontWeight: '600',
      background: 'rgba(0, 255, 136, 0.1)',
      borderRadius: '10px',
    },
    tableRow: {
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateY(-2px)',
      },
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    chartContainer: {
      marginTop: '2rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    highlight: {
      color: '#00ff88',
      fontWeight: '500',
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
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}>
          <p style={{ color: '#00ff88' }}>{`${label}`}</p>
          <p style={{ color: '#fff' }}>{`Stock: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Inventory Management</h1>
      </header>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Products and Stock</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Product Name</th>
                <th style={styles.tableHeader}>Price ($)</th>
                <th style={styles.tableHeader}>Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={{...styles.tableCell, ...styles.highlight}}>{product.price}</td>
                  <td style={styles.tableCell}>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Product Stock Chart</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <YAxis 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="stock" 
                fill="#00ff88"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Products on Sale</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Product Name</th>
                <th style={styles.tableHeader}>Price ($)</th>
                <th style={styles.tableHeader}>Discount ($)</th>
              </tr>
            </thead>
            <tbody>
              {saleProducts.map(product => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={{...styles.tableCell, ...styles.highlight}}>{product.price}</td>
                  <td style={{...styles.tableCell, color: '#ff3b30'}}>{product.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Products with Manufacturer Rebates</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Product Name</th>
                <th style={styles.tableHeader}>Price ($)</th>
                <th style={styles.tableHeader}>Rebate ($)</th>
              </tr>
            </thead>
            <tbody>
              {rebateProducts.map(product => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={{...styles.tableCell, ...styles.highlight}}>{product.price}</td>
                  <td style={{...styles.tableCell, color: '#00ff88'}}>{product.rebate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

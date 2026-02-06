import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const SalesReports = () => {
    const [soldProducts, setSoldProducts] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, chartRes, salesRes] = await Promise.all([
                    axios.get('http://localhost:3001/sales-report/products-sold'),
                    axios.get('http://localhost:3001/sales-report/products-sales-chart'),
                    axios.get('http://localhost:3001/sales-report/daily-sales')
                ]);

                setSoldProducts(productsRes.data);
                setBarChartData(chartRes.data);
                setDailySales(salesRes.data);
            } catch (err) {
                setError('Error fetching sales data');
                console.error('Error:', err);
            }
        };

        fetchData();
    }, []);

    const getMaxTotalSales = () => {
        if (barChartData.length === 0) return 0;
        return Math.max(...barChartData.map(item => item.total_sales)) + 500;
    };

    if (error) {
        return (
            <div className="container mt-4" style={{ color: '#ff3b30', textAlign: 'center' }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            background: 'rgba(22, 24, 29, 0.95)',
            color: '#fff'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#00ff88',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    marginBottom: '1rem'
                }}>Sales Reports</h1>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: '#00ff88',
                    marginBottom: '1.5rem'
                }}>Products Sold</h2>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Product Name</th>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Price ($)</th>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Items Sold</th>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Total Sales ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {soldProducts.map(product => (
                                <tr key={product.id} style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    transition: 'transform 0.2s',
                                    ':hover': { transform: 'translateY(-2px)' }
                                }}>
                                    <td style={{ padding: '1rem', color: '#fff' }}>{product.name}</td>
                                    <td style={{ padding: '1rem', color: '#fff' }}>${product.price}</td>
                                    <td style={{ padding: '1rem', color: '#fff' }}>{product.items_sold}</td>
                                    <td style={{ padding: '1rem', color: '#fff' }}>${product.total_sales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: '#00ff88',
                    marginBottom: '1.5rem'
                }}>Sales Chart</h2>
                
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '15px',
                    padding: '1rem'
                }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis domain={[0, getMaxTotalSales()]} stroke="#fff" />
                            <Tooltip 
                                contentStyle={{
                                    background: 'rgba(22, 24, 29, 0.95)',
                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                    borderRadius: '10px'
                                }}
                            />
                            <Bar dataKey="total_sales" fill="#00ff88" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: '#00ff88',
                    marginBottom: '1.5rem'
                }}>Daily Sales</h2>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Date</th>
                                <th style={{
                                    padding: '1rem',
                                    color: '#00ff88',
                                    textAlign: 'left',
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderRadius: '10px'
                                }}>Total Sales ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailySales.map(sale => (
                                <tr key={sale.date} style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    transition: 'transform 0.2s',
                                    ':hover': { transform: 'translateY(-2px)' }
                                }}>
                                    <td style={{ padding: '1rem', color: '#fff' }}>
                                        {new Date(sale.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#fff' }}>
                                        ${sale.total_sales}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesReports;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Nav } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [hasOrders, setHasOrders] = useState(false);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const [showPastOrders, setShowPastOrders] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3001/past-orders/${userId}`)
        .then(response => {
          if (response.data.length > 0) setShowPastOrders(true);
        })
        .catch(error => console.error('Error fetching past orders:', error));
    }
  }, [userId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      axios.get(`http://localhost:3001/autocomplete?q=${value}`)
        .then(response => setSuggestions(response.data))
        .catch(error => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    const productId = suggestion.id;
    navigate(`/products/${productId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const navStyles = {
    navbar: {
      background: 'rgba(22, 24, 29, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    brand: {
      color: '#00ff88',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
      marginRight: '2rem',
      textDecoration: 'none',
    },
    navLink: {
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      margin: '0 0.2rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      position: 'relative',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-2px)',
      }
    },
    searchBar: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '25px',
      padding: '10px 20px',
      color: '#fff',
      width: '300px',
      transition: 'all 0.3s ease',
      '&:focus': {
        background: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
      }
    },
    dropdown: {
      background: 'rgba(22, 24, 29, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '0.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    dropdownItem: {
      color: '#fff',
      padding: '0.7rem 1.2rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(0, 255, 136, 0.1)',
        color: '#00ff88',
      }
    },
    authButton: {
      background: 'transparent',
      border: '2px solid #00ff88',
      color: '#00ff88',
      padding: '8px 20px',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      '&:hover': {
        background: '#00ff88',
        color: '#16181d',
        boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
      }
    },
    suggestionsList: {
      background: 'rgba(22, 24, 29, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      marginTop: '5px',
      padding: '0.5rem',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    suggestionItem: {
      color: '#fff',
      padding: '0.7rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(0, 255, 136, 0.1)',
        color: '#00ff88',
      }
    }
  };

  return (
    <nav style={navStyles.navbar} className="navbar navbar-expand-lg">
      <Link to="/customer" style={navStyles.brand}>Smart-Home</Link>
      
      <div className="collapse navbar-collapse justify-content-between">
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <Link to="/customer" style={navStyles.navLink}>Home</Link>
          </li>

          {userRole === 'storeManager' && (
            <>
              <li className="nav-item">
                <Link to="/storemanager" style={navStyles.navLink}>Manage Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/inventory" style={navStyles.navLink}>Inventory</Link>
              </li>
              <li className="nav-item">
                <Link to="/sales-reports" style={navStyles.navLink}>Sales Reports</Link>
              </li>
            </>
          )}

          {userRole === 'salesman' && (
            <li className="nav-item">
              <Link to="/salesman" style={navStyles.navLink}>Manage Customers</Link>
            </li>
          )}

          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" style={navStyles.navLink}
               id="productsDropdown" role="button" data-bs-toggle="dropdown">
              Products
            </a>
            <ul className="dropdown-menu" style={navStyles.dropdown}>
              <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/products/doorbells">Smart Doorbells</Link></li>
              <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/products/doorlocks">Smart Doorlocks</Link></li>
              <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/products/speakers">Smart Speakers</Link></li>
              <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/products/lightings">Smart Lightings</Link></li>
              <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/products/thermostats">Smart Thermostats</Link></li>
            </ul>
          </li>

          {showPastOrders && (
            <li className="nav-item">
              <Link to="/past-orders" style={navStyles.navLink}>Past Orders</Link>
            </li>
          )}

          {userRole && (
            <Link to="/cart" style={navStyles.navLink}>Cart</Link>
          )}

          <li className="nav-item">
            <Link to="/trending" style={navStyles.navLink}>Trending</Link>
          </li>

          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle style={navStyles.navLink}>
              Customer Service
            </Dropdown.Toggle>
            <Dropdown.Menu style={navStyles.dropdown}>
              <Dropdown.Item as={Link} to="/open-ticket" style={navStyles.dropdownItem}>Open a Ticket</Dropdown.Item>
              <Dropdown.Item as={Link} to="/ticket-status" style={navStyles.dropdownItem}>Status of a Ticket</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <li className="nav-item">
            <Link to="/reviews" style={navStyles.navLink}>Reviews</Link>
          </li>
          <li className="nav-item">
            <Link to="/recommendations" style={navStyles.navLink}>Recommendations</Link>
          </li>

          <li className="nav-item position-relative">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search products..."
              style={navStyles.searchBar}
            />
            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100" style={navStyles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={navStyles.suggestionItem}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
          {userRole ? (
            <div className="btn-group">
              <button
                type="button"
                className="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                style={navStyles.authButton}
              >
                👤 {userName || 'Account'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={navStyles.dropdown}>
                <li><Link className="dropdown-item" style={navStyles.dropdownItem} to="/profile">Profile</Link></li>
                <li><button className="dropdown-item" style={navStyles.dropdownItem} onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" style={navStyles.authButton}>Login</Link>
              <Link to="/signup" style={{...navStyles.authButton, background: '#00ff88', color: '#16181d'}}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

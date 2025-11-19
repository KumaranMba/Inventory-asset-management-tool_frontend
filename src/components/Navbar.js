import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null); // State to store logged-in user
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Retrieve user info from session storage on mount
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Clears session and logs user out
  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MyShop</div> {/* Logo / Brand name */}
      <div style={styles.links}>
        {/* If user not logged in, show login/register/admin links */}
        {!user ? (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/admin-login" style={styles.link}>Admin Login</Link>
            <Link to="/employee-login" style={styles.link}>Employee Login</Link>
          </>
        ) : (
          <>
            {/* If user is logged in, show greeting and dashboard/cart/logout */}
            <span style={styles.user}>👋 {user.name}</span>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/userDashboard" style={styles.link}> Dashboard</Link>
            <Link to="/cart" style={styles.link}>🛒 View Cart</Link>
            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

// Inline styles used for navbar
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#007bff', // Bootstrap primary blue
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  link: {
    color: '#fff',
    textDecoration: 'none'
  },
  user: {
    color: '#fff',
    fontWeight: '500'
  },
  logout: {
    background: 'transparent',
    border: '1px solid white',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

// AuthForm component handles both login and registration form rendering
const AuthForm = ({ isLogin, onSubmit, onBack }) => {
  // Form state for all user inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gender: '',
  });

  // Handle input changes and update formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      {/* Optional Navbar can be enabled if needed */}
      {/* <Navbar /> */}

      {/* Hero section with title */}
      <section className="hero-section" style={{ height: '3vh' }}>
        <div className="hero-content">
          <h1 className="hero-title">Join Us Today!</h1>
          {/* <p className="hero-subtitle">Top tech, fashion, and more – curated for you!</p> */}
        </div>
      </section>

      {/* Form card container */}
      <div style={styles.card}>
        {/* User icon */}
        <div style={styles.iconContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="User Icon"
            style={styles.icon}
          />
        </div>

        {/* Form title and subtitle based on mode */}
        <h2 style={styles.title}>{isLogin ? 'Login to Portal' : 'Register Your Account'}</h2>
        <p style={styles.subtitle}>
          {isLogin
            ? 'Access your dashboard with your credentials.'
            : 'Join us to explore services personalized for you.'}
        </p>

        {/* Form begins here */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Fields only shown during registration */}
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}

          {/* Email and password fields (common for both login and register) */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Action buttons */}
          <div style={styles.actions}>
            <button type="submit" style={styles.primaryButton}>
              {isLogin ? 'Login' : 'Register'}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={onBack}>
              ⬅ Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline CSS styles for the component
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #dceefb, #e2eafc)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '480px',
    margin: 'auto',
  },
  iconContainer: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  icon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '12px 15px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border 0.2s',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  primaryButton: {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default AuthForm;

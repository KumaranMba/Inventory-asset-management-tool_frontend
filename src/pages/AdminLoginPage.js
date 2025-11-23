// AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';


const AdminLoginPage = () => {
  // State: Email and Password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Hook: React Router navigation
  const navigate = useNavigate();

  // Function: Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy validation (Replace with real API login later)
    if (email === 'admin@example.com' && password === 'admin123') {
      alert('Login Successful');
      navigate('/admin-dashboard');
    } else {
      alert('Invalid Email or Password');
    }
  };

  // Function: Navigate back to home page
  const handleBack = () => {
    navigate('/');
  };

  // JSX: Render Admin Login Page UI
  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>🔐 Welcome Admin</h2>
        <p className="admin-subtitle">Access your dashboard to manage users, products, and analytics.</p>

        {/* Form: Login Fields */}
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@example.com"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="admin-login-btn">Login</button>
        </form>

        {/* Button: Back to Home */}
        <button className="back-btn" onClick={handleBack}>← Back to Home</button>

        {/* Section: Admin Feature Highlights */}
        <div className="admin-static-info">
          <h4>🔍 Admin Capabilities:</h4>
          <ul>
            <li>📦 Manage Products</li>
            <li>👥 Monitor Users & Employees</li>
            <li>📈 Track Sales and Stock</li>
            <li>🔔 Handle Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

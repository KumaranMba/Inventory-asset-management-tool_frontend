// EmployeeLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './EmployeeLogin.css';
import { API_URL } from "../api";

const EmployeeLoginPage = () => {
  // Local state for login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/employees/login`, {
        email,
        password
      });

      // Check login success
      if (response.data.success) {
        alert('Login successful!');
        
        // Save session and token
        sessionStorage.setItem("employee", JSON.stringify(response.data.employee));
        localStorage.setItem("employeeToken", response.data.token);

        // Navigate to dashboard
        navigate('/employee-dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  // Redirect to home
  const goToHome = () => navigate('/');

  return (
    <div className="employee-login-container">
      <div className="employee-login-box">
        <h2>🧑‍💼 Employee Login</h2>
        <p className="employee-subtitle">Access internal tools and reports</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="employee-form-group">
            <label>Email</label>
            <input 
              type="email"
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="employee-form-group">
            <label>Password</label>
            <input 
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="employee-login-btn">Login</button>
        </form>

        {/* Back to home */}
        <button className="back-btn" onClick={goToHome}>← Back to Home</button>

        {/* Static info section */}
        <div className="employee-static-info">
          <h4>👩‍💻 Tools Available After Login:</h4>
          <ul>
            <li>📊 View Assigned Tasks</li>
            <li>📦 Monitor Inventory</li>
            <li>💬 Internal Messaging</li>
            <li>📁 Access Reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;

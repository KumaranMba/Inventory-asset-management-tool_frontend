import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployeeNavbar.css';

// EmployeeNavbar component for navigation bar used by logged-in employees
const EmployeeNavbar = () => {
  const navigate = useNavigate();

  // Logout handler: clears session and redirects to login page
  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    navigate('/employee-login');
  };

  // Retrieve the currently logged-in employee from session storage
  const employee = JSON.parse(sessionStorage.getItem('employee'));

  return (
    <nav className="employee-navbar">
      {/* Left side: portal branding */}
      <div className="nav-left">
        <h2 className="logo">🛠️ Employee Portal</h2>
      </div>

      {/* Right side: welcome message, links, logout */}
      <div className="nav-right">
        <span className="welcome">👋 {employee?.name}</span>
        <Link to="/employee-dashboard" className="nav-link">🏠 Dashboard</Link>
        <button
          style={{ marginBottom: '20px' }}
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;

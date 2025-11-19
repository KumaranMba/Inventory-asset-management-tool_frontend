import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importing all page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ViewAll from './pages/ViewAll';
import AdminLogin from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import CartPage from './pages/CartPage';
import Dashboard from './pages/AdminDashboardStart';
import Employee from './pages/Employee';
import UserDashboard from './pages/UserDashboard';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    // Router wraps the entire app to enable routing
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />                {/* User Login */}
        <Route path="/register" element={<RegisterPage />} />          {/* User Registration */}
        <Route path="/" element={<HomePage />} />                      {/* Homepage */}
        <Route path="view-all" element={<ViewAll />} />                {/* View all products */}

        {/* Admin Routes */}
        <Route path="admin-login" element={<AdminLogin />} />          {/* Admin Login */}
        <Route path="admin-dashboard" element={<AdminDashboard />} />  {/* Admin Dashboard */}
        <Route path="/admin/view-products" element={<AdminDashboard />} /> {/* View Products (Admin) */}
        <Route path="/admin/add-product" element={<AddProductPage />} />   {/* Add Product */}
        <Route path="/admin/edit-delete" element={<AddProductPage />} />   {/* Edit/Delete Product */}
        <Route path="/admin/logout" element={<AddProductPage />} />        {/* Logout (placeholder route) */}
        <Route path="/admin/dashboard" element={<Dashboard />} />          {/* Admin Main Dashboard */}
        <Route path="/admin/add-employee" element={<Employee />} />        {/* Add Employee */}

        {/* User & Payment Routes */}
        <Route path="/payment" element={<PaymentPage />} />             {/* Payment Page */}
        <Route path="/success" element={<SuccessPage />} />             {/* Payment Success */}
        <Route path="/cart" element={<CartPage />} />                   {/* Cart Page */}
        <Route path="/userDashboard" element={<UserDashboard />} />     {/* User Dashboard */}

        {/* Employee Routes */}
        <Route path="/employee-login" element={<EmployeeLogin />} />    {/* Employee Login */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} /> {/* Employee Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
  const [user, setUser] = useState(null); // Stores user data
  const [payments, setPayments] = useState([]); // Stores user's payment history
  const navigate = useNavigate();

  // Runs on component mount
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user")); // Get user from session storage
    if (storedUser) {
      setUser(storedUser); // Set user state
      fetchPayments(storedUser.id); // Fetch payment history for this user
    } else {
      navigate('/login'); // Redirect if user not logged in
    }
  }, []);

  // Fetch payment data by user ID
  const fetchPayments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/payment/user/${userId}`);
      setPayments(response.data); // Set payments state
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("user"); // Clear session data
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <Navbar /> {/* Top navigation bar */}
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">👋 Welcome, {user?.name}</h1>

        <div className="dashboard-sections">
          {/* User profile section */}
          <div className="profile-card">
            <h2>🧍 Your Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
            <p><strong>Address:</strong> {user?.address || 'Not provided'}</p>
            <p><strong>Gender:</strong> {user?.gender || 'Not specified'}</p>
            <p><strong>Role:</strong> {user?.isAdmin ? 'Admin' : 'Customer'}</p>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>

          {/* Payment history section */}
          <div className="purchase-history-card">
            <h2>🧾 Purchase History</h2>
            {payments.length === 0 ? (
              <p className="no-purchase-msg">You haven't made any purchases yet.</p>
            ) : (
              <div className="payments-list">
                {payments.map((pay, idx) => (
                  <div key={idx} className="payment-card">
                    <div className="payment-header">
                      <span><strong>Date:</strong> {new Date(pay.createdAt).toLocaleDateString()}</span>
                      <span><strong>Method:</strong> {pay.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="payment-body">
                      {pay.cartItems.map((item, i) => (
                        <div key={i} className="item-line">
                          <span>{item.product.name}</span>
                          <span>× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="payment-total">
                      <strong>Total: ₹{pay.totalAmount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default UserDashboard;

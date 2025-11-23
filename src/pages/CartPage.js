// CartPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from "../api";

const CartPage = () => {
  // State: Store cart items and logged-in user
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect: On component mount, get user from sessionStorage and fetch cart
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCartItems(storedUser.id);
    }
  }, []);

  // API: Fetch cart items for a specific user
  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // API: Remove an item from the cart
  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/product/cart/remove/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // API + UI: Update item quantity in cart
  const handleQuantityChange = async (itemId, delta) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === itemId) {
        const newQty = Math.max(1, item.quantity + delta); // Minimum quantity = 1
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedItems);

    try {
      const updatedItem = updatedItems.find(item => item._id === itemId);
      await axios.put(`${API_URL}/api/product/cart/update/${itemId}`, {
        quantity: updatedItem.quantity
      });
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  // Derived Value: Calculate total cart amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Navigate to payment page with cart details
  const handleCheckout = () => {
    navigate('/payment', { state: { cartItems, totalAmount } });
  };

  // If user is not logged in
  if (!user) return <p className="login-message">Please login to view your cart.</p>;

  // JSX UI Render
  return (
    <>
      <Navbar />

      <div className="cart-page-wrapper">
        <div className="cart-container">
          <h1 className="cart-title">🛒 Your Shopping Cart</h1>
          <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>

          {/* If cart is empty */}
          {cartItems.length === 0 ? (
            <p className="empty-message">Your cart is empty.</p>
          ) : (
            <>
              {/* Render all cart items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-card">
                    <img src={`${API_URL}${item.product.image}`} alt={item.product.name} />
                    <div className="cart-details">
                      <h3>{item.product.name}</h3>
                      <p>Price: ₹{item.product.price}</p>
                      <p>SKU: {item.product.sku}</p>
                      <p>Color: {item.product.color}</p>
                      <p>Category: {item.product.category}</p>
                      
                      {/* Quantity controls */}
                      <div className="qty-controls">
                        <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                      </div>

                      {/* Remove item */}
                      <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart total and checkout */}
              <div className="cart-summary">
                <h2>Total Amount: ₹{totalAmount.toFixed(2)}</h2>
                <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>

        {/* Static help/info section */}
        <div className="cart-help-section">
          <h3>Need Help?</h3>
          <p>📞 Call us at <strong>1800-123-456</strong></p>
          <p>📧 Email: <a href="mailto:support@myshop.com">support@myshop.com</a></p>
          <p>🕐 Delivery in 3-5 working days • 7-day return policy • Secure payments</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;

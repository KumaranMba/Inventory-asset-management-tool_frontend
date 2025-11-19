import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // Import stylesheet

const PaymentPage = () => {
  // Get cart data and total amount from the previous page via state
  const { state } = useLocation();
  const navigate = useNavigate();
  const cartItems = state?.cartItems || [];
  const totalAmount = state?.totalAmount || 0;

  // State for form fields
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [delivery, setDelivery] = useState({ fullName: '', address: '', phone: '' });

  // Handle the payment process
  const handlePayNow = async () => {
    // Basic validation
    if (!delivery.fullName || !delivery.address || !delivery.phone) {
      alert('Please fill in all delivery details.');
      return;
    }

    if (paymentMethod === 'card' && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv || !cardInfo.name)) {
      alert('Please complete card details.');
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      alert('Enter UPI ID.');
      return;
    }

    // Get logged-in user from session
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Prepare payment payload
    const paymentDetails = {
      user: user?.id,
      delivery,
      cartItems,
      totalAmount,
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardInfo : null,
      upiId: paymentMethod === 'upi' ? upiId : null,
      timestamp: new Date().toISOString()
    };

    try {
      // Step 1: Save payment details
      await fetch('http://localhost:5000/api/product/payment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails)
      });

      // Step 2: Update product stock quantities
      await Promise.all(cartItems.map(item =>
        fetch(`http://localhost:5000/api/product/update-stock/${item.product._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: item.quantity })
        })
      ));

      // Step 3: Remove items from cart
      await Promise.all(cartItems.map(item =>
        fetch(`http://localhost:5000/api/product/cart/remove/${item._id}`, {
          method: 'DELETE'
        })
      ));

      // Success
      alert('✅ Payment successful!');
      navigate('/success');
    } catch (error) {
      // Error handling
      console.error("Payment process failed:", error);
      alert('❌ Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-page">
      <h1>🧾 Checkout</h1>

      <div className="checkout-details">
        {/* Order summary section */}
        <div className="left">
          <h2>🛍️ Order Summary</h2>
          {cartItems.map((item, i) => (
            <div key={i} className="summary-item">
              <p><strong>{item.product.name}</strong></p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.product.price}</p>
            </div>
          ))}
          <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
        </div>

        {/* Delivery and Payment section */}
        <div className="right">
          <h2>📦 Delivery Info</h2>
          <input type="text" placeholder="Full Name" value={delivery.fullName}
            onChange={e => setDelivery({ ...delivery, fullName: e.target.value })} />
          <textarea placeholder="Address" value={delivery.address} style={{color:'black'}}
            onChange={e => setDelivery({ ...delivery, address: e.target.value })} />
          <input type="tel" placeholder="Phone" maxLength="10" value={delivery.phone}
          onChange={(e) => { const value = e.target.value; 
                // Allow only numbers
                if (/^\d*$/.test(value)) {
                  setDelivery({ ...delivery, phone: value });
                }
              }}
              onBlur={() => {
                // Validation when input loses focus
                if (!/^[6-9]\d{9}$/.test(delivery.phone)) {
                  alert("❌ Please enter a valid 10-digit Indian phone number.");
                }
              }}
            />


          <h2>💳 Payment Method</h2>
          <div className="payment-method">
            <label><input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /> Card</label>
            <label><input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /> UPI</label>
          </div>

          {/* Card Payment Fields */}
          {paymentMethod === 'card' ? (
            <>
              <input type="text" placeholder="Card Number" maxLength="16" value={cardInfo.number}
                onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} />
              <input type="text" placeholder="Expiry (MM/YY)" maxLength="5" value={cardInfo.expiry}
                onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })} />
              <input type="password" placeholder="CVV" maxLength="3" value={cardInfo.cvv}
                onChange={e => setCardInfo({ ...cardInfo, cvv: e.target.value })} />
              <input type="text" placeholder="Name on Card" value={cardInfo.name}
                onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })} />
            </>
          ) : (
            // UPI Payment Field
            <input type="text" placeholder="UPI ID (e.g., name@bank)" value={upiId}
              onChange={e => setUpiId(e.target.value)} />
          )}

          {/* Pay Now button */}
          <button className="pay-btn" onClick={handlePayNow}>Pay ₹{totalAmount.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

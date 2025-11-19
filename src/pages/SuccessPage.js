import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook to navigate between routes
import './SuccessPage.css'; // CSS for success page styling

const SuccessPage = () => {
  const navigate = useNavigate(); // Used to redirect user to home page

  return (
    <div className="success-page">
      <div className="success-card">
        {/* Success animation GIF */}
        <img
          src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
          alt="Success"
          className="success-gif"
        />

        {/* Success message */}
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>

        {/* Button to navigate to homepage */}
        <button onClick={() => navigate('/')} className="success-btn">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

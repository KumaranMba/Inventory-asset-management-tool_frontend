import React from 'react';
import './FeatureSection.css';

// FeatureSection component to showcase key platform benefits
const FeatureSection = () => {
  return (
    <section className="features-section">
      {/* Feature 1: Fast Delivery */}
      <div className="feature-card">
        <div className="feature-icon">📦</div>
        <h3>Fast Delivery</h3>
        <p>We ensure lightning-fast delivery across all major locations in India.</p>
      </div>

      {/* Feature 2: Affordable Prices */}
      <div className="feature-card">
        <div className="feature-icon">💰</div>
        <h3>Affordable Prices</h3>
        <p>Get the best value for money with unbeatable prices on top-quality products.</p>
      </div>

      {/* Feature 3: Top Rated Items */}
      <div className="feature-card">
        <div className="feature-icon">⭐</div>
        <h3>Top Rated Items</h3>
        <p>Choose from products loved and rated highly by thousands of happy customers.</p>
      </div>
    </section>
  );
};

export default FeatureSection;

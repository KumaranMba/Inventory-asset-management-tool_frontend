import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Function to generate star icons based on rating
  const getStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating - fullStars >= 0.5; // Check if half star is needed
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>⭐</span>);
    }

    // Add half star if applicable
    if (halfStar) {
      stars.push(<span key="half">✨</span>);
    }

    return stars;
  };

  return (
    <div className="product-card">
      {/* Show "Sold Out" badge if stock is 0 */}
      {product.stockQuantity === 0 && (
        <div className="sold-out-badge">Sold Out</div>
      )}

      {/* Product image */}
      <img
        className="product-img"
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        style={{ width: '100%' }}
      />

      {/* Product name */}
      <h3 className="product-name">{product.name}</h3>

      {/* Product price */}
      <p className="product-price">₹{product.price}</p>

      {/* Product rating stars */}
      <div className="product-rating">{getStars(product.rating || 0)}</div>
    </div>
  );
};

export default ProductCard;

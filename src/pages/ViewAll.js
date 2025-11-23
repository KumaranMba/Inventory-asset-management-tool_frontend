import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ViewAllPage.css';
import './HomePage.css';
import { API_URL } from "../api";

const ViewAllPage = () => {
  // State variables for products and filters
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

   const [selectedProduct, setSelectedProduct] = useState(null);
   useEffect(() => {
       fetchProducts();
     }, []);

    // fetch products initially
      const fetchProducts = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/product`);
          setProducts(res.data);
        } catch (err) {
          console.error('Failed to fetch products', err);
        }
      };


  // Available categories for filtering
  const categories = [
    'Electronics', 'Fashion', 'Books', 'Appliances',
    'Home Decor', 'Beauty', 'Toys', 'Footwear',
    'Fitness', 'Grocery'
  ];

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/product/`);
        setProducts(response.data); // Store fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filtered and sorted products based on user input
  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      p.price >= priceRange[0] && p.price <= priceRange[1] &&
      (p.rating || 0) >= minRating &&
      p.stockQuantity >= minStock
    )
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });

     // Add product to cart handler
      const handleAddToCart = async () => {
        if (!user) {
          alert("Please login to add items to your cart.");
          navigate("/login");
          return;
        }
    
        try {
          await axios.post(`${API_URL}/api/product/cart`, {
            userId: user.id,
            productId: selectedProduct._id,
            quantity: 1,
            addedAt: new Date().toISOString()
          });
    
          setCart(prev => [...prev, selectedProduct]);
          alert(`${selectedProduct.name} has been added to your cart!`);
        } catch (error) {
          console.error("Failed to add item to cart:", error);
          alert("Failed to add item to cart. Please try again later.");
        }
      };


  return (
    <div className="viewall-container">
      <Navbar /> {/* Top navigation bar */}

      <div className="viewall-layout">
        {/* Sidebar Filters */}
        <div className="viewall-sidebar">
          <h2>🔍 Filters</h2>

          {/* Search input */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="filter-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price range filter */}
          <div className="filter-group">
            <label>Price Range</label>
            <input
              type="range"
              min={0}
              max={200000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, +e.target.value])}
            />
            <span>₹0 - ₹{priceRange[1]}</span>
          </div>

          {/* Rating filter */}
          <div className="filter-group">
            <label>Minimum Rating</label>
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>All</option>
              <option value={1}>⭐ 1+</option>
              <option value={2}>⭐ 2+</option>
              <option value={3}>⭐ 3+</option>
              <option value={4}>⭐ 4+</option>
            </select>
          </div>

          {/* Minimum stock filter */}
          <div className="filter-group">
            <label>Minimum Stock</label>
            <input
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(+e.target.value)}
            />
          </div>

          {/* Sort order filter */}
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">None</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Reset filters */}
          <button
            className="filter-reset-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSortOrder('');
              setPriceRange([0, 200000]);
              setMinRating(0);
              setMinStock(0);
            }}>
            🔄 Reset All
          </button>
        </div>

        {/* Product Grid */}
        <div className="viewall-products">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="viewall-card">
                <img src={`${API_URL}${product.image}`} alt={product.name} />
                <div className="card-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <p className="category">{product.category}</p>
                  <p className="rating">⭐ {product.rating || 'N/A'} / 5</p>
                  <button className="view-btn" onClick={() => setSelectedProduct(product)}>View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-product-msg">No matching products.</p>
          )}
        </div>

      {/* view selected product modal popup */}
      {selectedProduct && (
      <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{selectedProduct.name}</h2>
      <img
      src={`${API_URL}${selectedProduct.image}`}
      alt={selectedProduct.name}
      className="modal-image"
    />

    <div className="modal-grid">
      <p><strong>Brand:</strong> {selectedProduct.brand}</p>
      <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
      <p><strong>Category:</strong> {selectedProduct.category}</p>
      <p><strong>Size Available:</strong> {selectedProduct.sizeAvailable}</p>
      <p><strong>Color:</strong> {selectedProduct.color}</p>
      <p><strong>Material:</strong> {selectedProduct.material}</p>
      <p><strong>Warranty:</strong> {selectedProduct.warranty}</p>
      <p><strong>Expected Delivery:</strong> {selectedProduct.expectedDeliveryDate}</p>
      <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
      <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
      <p><strong>Dimensions:</strong> {selectedProduct.dimensions}</p>
      <p><strong>Rating:</strong> {selectedProduct.rating}/5</p>
      <p><strong>Return Policy:</strong> {selectedProduct.returnPolicy}</p>
      <p><strong>Origin:</strong> {selectedProduct.countryOfOrigin}</p>
      <p><strong>Manufacturer:</strong> {selectedProduct.manufacturerDetails}</p>
      <p style={{ gridColumn: "1 / -1" }}><strong>Description:</strong> {selectedProduct.description}</p>
    </div>

     <div className="popup-buttons">
           {selectedProduct.stockQuantity > 0 ? (
              <button className="popup-buy-button" onClick={handleAddToCart}>Add to Cart</button>
            ) : (
              <span className="sold-out-label">🚫 Sold Out</span>
            )}
      </div>     
        

    <button onClick={() => setSelectedProduct(null)}>Close</button>
  </div>
 </div>

)}

      </div>

      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default ViewAllPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import FeatureSection from '../components/FeatureSection';
import './HomePage.css';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch grouped products by category
  useEffect(() => {
    axios.get('http://localhost:5000/api/product/grouped')
      .then(res => setProductsByCategory(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Add product to cart handler
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/product/cart', {
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

  // Chatbot predefined replies
  const chatbotReplies = {
    price: "You can find best-priced items in each category.",
    shipping: "We offer free shipping for orders above ₹500.",
    return: "Returns are accepted within 7 days of delivery.",
    support: "You can reach us at support@myshop.com or call 1800-123-456.",
    categories: "We offer Electronics, Fashion, Home Decor, Toys, Books, and more.",
    order: "You can track your order in the 'My Orders' section.",
    payment: "We accept credit/debit cards, UPI, and net banking.",
    discount: "Seasonal discounts are available in our Offers section.",
    delivery: "Standard delivery time is 3-5 business days.",
    location: "We currently deliver across India.",
    account: "You can manage your account in the profile settings.",
    cancel: "Order cancellation is possible before dispatch.",
    warranty: "Product warranties vary; details are listed on each product page.",
    invoice: "You can download your invoice from the order history.",
    gift: "Gift wrapping is available at checkout.",
    refund: "Refunds are processed within 5-7 business days.",
    exchange: "Exchanges are supported on selected items only.",
    bulk: "For bulk purchases, contact us at wholesale@myshop.com.",
    membership: "Join our Prime Club for exclusive benefits.",
    wishlist: "Add items to your wishlist for quick access later.",
    language: "Our site supports English and Hindi currently.",
    feedback: "We welcome your feedback to improve our service.",
    help: "Visit our Help Center for detailed guidance.",
    faq: "Frequently Asked Questions can be found in the FAQ section.",
    quality: "We ensure top-quality products from verified sellers.",
    compare: "Use our Compare tool to compare products.",
    popular: "Popular items are trending now!",
    new: "New arrivals are added every week.",
    returnpolicy: "Read our return policy in the footer.",
    privacy: "We never share your data with third parties.",
    login: "Use your email and password to log in.",
    register: "Click Register on the top nav to create a new account.",
    contact: "Visit our Contact Us page for more details."
  };

  // Send chatbot message
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const lower = userMessage.toLowerCase();
    const key = Object.keys(chatbotReplies).find(k => lower.includes(k));
    const botResponse = key ? chatbotReplies[key] : "Thanks for reaching out! A human agent will assist you soon.";

    setChatMessages(prev => [
      ...prev,
      { from: 'user', text: userMessage },
      { from: 'bot', text: botResponse }
    ]);
    setUserMessage('');
  };

  return (
    <div className="homepage-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Premium Products</h1>
          <p className="hero-subtitle">Top tech, fashion, and more – curated for you!</p>
          <button className="hero-button" onClick={() => navigate('/view-all')}>View All Products</button>
        </div>
      </section>

      {/* Features */}
      <FeatureSection />

      {/* Products by Category */}
      <section className="products-section">
        <h2 className="section-heading">Shop Now!</h2>
        {Object.entries(productsByCategory).map(([category, items]) => (
          <div key={category} className="category-block">
            <h3 className="category-title">{category}</h3>
            <div className="products-grid">
              {items.slice(0, 4).map(product => (
                <div key={product._id} onClick={() => setSelectedProduct(product)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Product Popup */}
      {selectedProduct && (
        <div className="product-popup">
          <button className="close-popup" onClick={() => setSelectedProduct(null)}>✖</button>
          <img
            src={`http://localhost:5000${selectedProduct.image}`}
            alt={selectedProduct.name}
            className="popup-image"
          />
          <div className="product-info">
            <h3>{selectedProduct.name}</h3>
            <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Stock:</strong> <span style={{ color: selectedProduct.stockQuantity > 0 ? "green" : "red" }}>
              {selectedProduct.stockQuantity > 0 ? selectedProduct.stockQuantity : "Out of Stock"}
            </span></p>
            <p><strong>SKU:</strong> {selectedProduct.sku}</p>
            <p><strong>Color:</strong> {selectedProduct.color}</p>
            <p><strong>Material:</strong> {selectedProduct.material}</p>
            <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
            <p><strong>Rating:</strong> {selectedProduct.rating}/5</p>
            <p><strong>Warranty:</strong> {selectedProduct.warranty}</p>
            <p><strong>Origin:</strong> {selectedProduct.countryOfOrigin}</p>
            <p><strong>Manufacturer:</strong> {selectedProduct.manufacturerDetails}</p>
          </div>

          <div className="popup-buttons">
            {selectedProduct.stockQuantity > 0 ? (
              <button className="popup-buy-button" onClick={handleAddToCart}>Add to Cart</button>
            ) : (
              <span className="sold-out-label">🚫 Sold Out</span>
            )}
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className={`chatbot-box ${chatOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <span onClick={() => setChatOpen(!chatOpen)}>💬 Support Chat</span>
          <button className="chat-close-btn" onClick={() => setChatOpen(false)}>×</button>
        </div>
        {chatOpen && (
          <div className="chatbot-body">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <p key={index} className={msg.from === 'user' ? 'user-msg' : 'bot-msg'}>
                  {msg.text}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;

// EmployeeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './EmployeeDashboard.css';
import { API_URL } from "../api";

const EmployeeDashboard = () => {
  // State variables
  const [employee, setEmployee] = useState(null);          // Logged-in employee data
  const [products, setProducts] = useState([]);            // All products
  const [editingId, setEditingId] = useState(null);        // ID of the product being edited
  const [editData, setEditData] = useState({});            // Form data for editing
  const [viewProduct, setViewProduct] = useState(null);    // Product currently viewed in model
  const navigate = useNavigate();

  // On component mount, fetch session and product data
  useEffect(() => {
    const stored = sessionStorage.getItem('employee');
    if (!stored) {
      navigate('/employee-login'); // Redirect if not logged in
    } else {
      const emp = JSON.parse(stored);
      setEmployee(emp);
      fetchProducts(); // Load products
    }
  }, []);

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Clear session and logout
  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    navigate('/employee-login');
  };

  // Enable editing for a specific product
  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setEditData({
      stockQuantity: prod.stockQuantity,
      price: prod.price,
      description: prod.description,
    });
  };

  // Cancel editing mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Update form data for edit
  /*const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };*/
  const handleChange = (field, value) => {
  setEditData(prev => {
    const updated = { ...prev, [field]: value };
    console.log("Edited Data:", updated); // ✅ See if price changes here
    return updated;
  });
};


  // Save updated product info
  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/product/edit/${id}`, editData);
      fetchProducts(); // Refresh list after save
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error('Error saving product edit', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="emp-dashboard-container">
        <h1 style={{ color: 'aquamarine' }}>👷 Employee Dashboard</h1>
        <br />

        {/* Employee profile display */}
        {employee && (
          <div className="employee-profile-box">
            <h2>Welcome, {employee.name}</h2>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <div className="permissions-list">
              <h4>Permissions:</h4>
              <ul>
                {employee.permissions && Object.entries(employee.permissions).map(([key, val]) => (
                  <li key={key}>{key.toUpperCase()}: {val ? '✅' : '❌'}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <hr />

        {/* Product listing and editing section */}
        <div className="product-card1-section">
          <h2 style={{ color: 'aquamarine' }}>🛒 Products</h2>
          <br />
          <div className="product-grid" style={{ backgroundColor: 'lightsteelblue', padding: '22px' }}>
            {products.map(prod => (
              <div className="product-card1" key={prod._id}>
                <h3>{prod.name}</h3>

                {/* If product is in edit mode */}
                {editingId === prod._id ? (
                  <>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={editData.stockQuantity}
                      onChange={(e) => handleChange('stockQuantity', e.target.value)}
                      style={{ color: 'black' }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={editData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      style={{ color: 'black' }}

                    />
                    <textarea
                      placeholder="Description"
                      value={editData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      style={{ color: 'black' }}
                    ></textarea>
                    <button className="btn save" onClick={() => saveEdit(prod._id)}>💾 Save</button>
                    <button className="btn cancel" onClick={cancelEdit}>❌ Cancel</button>
                  </>
                ) : (
                  <>
                    <p><strong>Stock:</strong> {prod.stockQuantity}</p>
                    <p><strong>Price:</strong> ₹{prod.price}</p>
                    <p className="desc">{prod.description}</p>
                    <div className="product-actions">
                      <button className="btn view" onClick={() => setViewProduct(prod)}>👁️ View</button>
                      {employee?.permissions?.edit && (
                        <button className="btn edit" onClick={() => handleEdit(prod)}>✏️ Edit</button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal for viewing full product details */}
        {viewProduct && (
          <div className="view-modal">
            <div className="view-content">
              <button className="close-view" onClick={() => setViewProduct(null)}>×</button>
              <h2>{viewProduct.name}</h2>
              <p><strong>Stock:</strong> {viewProduct.stockQuantity}</p>
              <p><strong>Price:</strong> ₹{viewProduct.price}</p>
              <p><strong>Category:</strong> {viewProduct.category}</p>
              <p><strong>SKU:</strong> {viewProduct.sku}</p>
              <p><strong>Color:</strong> {viewProduct.color}</p>
              <p><strong>Material:</strong> {viewProduct.material}</p>
              <p><strong>Weight:</strong> {viewProduct.weight} kg</p>
              <p><strong>Warranty:</strong> {viewProduct.warranty}</p>
              <p><strong>Origin:</strong> {viewProduct.countryOfOrigin}</p>
              <p><strong>Manufacturer:</strong> {viewProduct.manufacturerDetails}</p>
              <p className="desc">{viewProduct.description}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EmployeeDashboard;

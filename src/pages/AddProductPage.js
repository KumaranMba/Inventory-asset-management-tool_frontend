import React, { useState } from 'react';
import './AddProductPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../api";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    sizeAvailable: '',
    image: '',
    description: '',
    brand: '',
    expectedDeliveryDate: '',
    price: '',
    discount: '',
    color: '',
    material: '',
    category: '',
    subCategory: '',
    warranty: '',
    stockQuantity: '',
    sku: '',
    weight: '',
    dimensions: '',
    rating: '',
    returnPolicy: '',
    countryOfOrigin: '',
    manufacturerDetails: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
 // validating the add product form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) newErrors.price = "Valid price is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.image) newErrors.image = "Image URL is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.stockQuantity || isNaN(formData.stockQuantity) || formData.stockQuantity <= 0) newErrors.stockQuantity = "Valid stockQuantity is required.";
    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) newErrors.rating = "Rating must be between 1 and 5.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submitting the form
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
// calling add product api
  try {
    const submissionData = new FormData();

    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });

    const response = await axios.post(
      `${API_URL}/api/product/add`,
      submissionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    alert("Product added successfully!");
    console.log(response.data);

    setFormData({
      name: '', sizeAvailable: '', image: '', description: '', brand: '',
      expectedDeliveryDate: '', price: '', discount: '', color: '', material: '',
      category: '', subCategory: '', warranty: '', stockQuantity: '', sku: '',
      weight: '', dimensions: '', rating: '', returnPolicy: '',
      countryOfOrigin: '', manufacturerDetails: ''
    });
    setErrors({});
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Check console for details.");
  }
};
 // handle file upload
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData({
    ...formData,
    image: file,  // store the File object
  });
};

  return (
    <div className="admin-dashboard">
      {/* header part start*/}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
         <ul>
                  <li><Link to="/admin/dashboard" >Dashboard</Link></li>
                  <li><Link to="/admin/view-products" >View Products</Link></li>
                  <li><Link to="/admin/add-product" style={{backgroundColor: '#2c2c2c'}}>Add Product</Link></li>
                   <li><Link to="/admin/add-employee" >Manage Employee</Link></li>
                  <li><Link to="/">Logout</Link></li>
                </ul>
      </aside>
  {/* header part end*/}
      <main className="add-product-main">
        <h2>Add New Product</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            {/* Size Available */}
            <div className="form-group">
              <label>Size Available</label>
              <select name="sizeAvailable" value={formData.sizeAvailable} onChange={handleChange}>
                <option value="">Select</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            {/* Image */}
            <div className="form-group">
              <label>Image URL</label>
             <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
              {errors.image && <span className="error">{errors.image}</span>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            {/* Discount */}
            <div className="form-group">
              <label>Discount (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
            </div>

            {/* Brand */}
            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
                <option value="Appliances">Appliances</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Beauty">Beauty</option>
                <option value="Toys">Toys</option>
                <option value="Footwear">Footwear</option>
                <option value="Fitness">Fitness</option>
                <option value="Grocery">Grocery</option>
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>

            {/* Sub-Category */}
            <div className="form-group">
              <label>Sub-Category</label>
              <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            {/* Expected Delivery Date */}
            <div className="form-group">
              <label>Expected Delivery Date</label>
              <input type="text" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} />
            </div>

            {/* Color */}
            <div className="form-group">
              <label>Color</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} />
            </div>

            {/* Material */}
            <div className="form-group">
              <label>Material</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} />
            </div>

            {/* Warranty */}
            <div className="form-group">
              <label>Warranty</label>
              <select name="warranty" value={formData.warranty} onChange={handleChange}>
                <option value="">Select</option>
                <option value="No Warranty">No Warranty</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>

            {/* Stock Quantity */}
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
              {errors.stockQuantity && <span className="error">{errors.stockQuantity}</span>}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label>SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} />
            </div>

            {/* Weight */}
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
            </div>

            {/* Dimensions */}
            <div className="form-group">
              <label>Dimensions</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} />
            </div>

            {/* Rating */}
            <div className="form-group">
              <label>Rating (1 - 5)</label>
              <input type="number" name="rating" max="5" min="1" step="0.1" value={formData.rating} onChange={handleChange} />
              {errors.rating && <span className="error">{errors.rating}</span>}
            </div>

            {/* Return Policy */}
            <div className="form-group">
              <label>Return Policy</label>
              <input type="text" name="returnPolicy" value={formData.returnPolicy} onChange={handleChange} />
            </div>

            {/* Country of Origin */}
            <div className="form-group">
              <label>Country of Origin</label>
              <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} />
            </div>

            {/* Manufacturer Details */}
            <div className="form-group full-width">
              <label>Manufacturer Details</label>
              <textarea name="manufacturerDetails" value={formData.manufacturerDetails} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="form-submit">
            <button type="submit">Add Product</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProductPage;

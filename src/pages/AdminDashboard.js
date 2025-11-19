import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ description: '', stockQuantity: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // fetch products initially
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/product');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);

  // edit product
  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      description: product.description,
      stockQuantity: product.stockQuantity,
    });
  };

  // Delete product
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
   //console.log(id);

  try {
    const response = await axios.delete(`http://localhost:5000/api/product/delete/${id}`);

    
    alert(response.data.message);

    // Refresh list after delete
    fetchProducts();
   } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete product");
    }
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // save edit product api
  const saveEdit = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/product/edit/${id}`, editData); // Sends { description, stockQuantity }
    fetchProducts();  // Refresh list
    setEditingId(null);
  } catch (err) {
    console.error('Error saving product edit', err);
  }
};

 // filter products
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
    .sort((a, b) => {
      if (sortOrder === 'low') return a.price - b.price;
      if (sortOrder === 'high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="admin-dashboard">
       <aside className="admin-sidebar">
              <h2>Admin Panel</h2>
               <ul>
                        <li><Link to="/admin/dashboard" >Dashboard</Link></li>
                        <li><Link to="/admin/view-products" style={{backgroundColor: '#2c2c2c'}}>View Products</Link></li>
                        <li><Link to="/admin/add-product" >Add Product</Link></li>
                         <li><Link to="/admin/add-employee" >Manage Employee</Link></li>
                        <li><Link to="/">Logout</Link></li>
                      </ul>
            </aside>

      <main className="product-list-main">
        <h2 style={{color: '#00ffff'}}>Product Management</h2>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or brand"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <select value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
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

          <select value={sortOrder} onChange={handleSortChange}>
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>

        {/* Product Cards */}
        <div className="product-grid" >
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="card-image"
              />
              <div style={{color:"white"}} className="product-info">
                <h3>{product.name}</h3>
                {/* <p><strong>Brand:</strong> {product.brand}</p> */}
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Stock:</strong> {product.stockQuantity}</p>
                {/* <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Color:</strong> {product.color}</p> */}
                {/* <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Weight:</strong> {product.weight} kg</p>
                <p><strong>Rating:</strong> {product.rating}/5</p>
                <p><strong>Warranty:</strong> {product.warranty}</p>
                <p><strong>Origin:</strong> {product.countryOfOrigin}</p>
                <p><strong>Manufacturer:</strong> {product.manufacturerDetails}</p> */}
  <button onClick={() => setSelectedProduct(product)}>View Details</button>
                {editingId === product._id ? (
                  <>
                    <textarea
                    style={{color:"black"}}
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      rows={3}
                    />
                    <input
                    style={{color:"black"}}
                      type="number"
                      name="stockQuantity"
                      value={editData.stockQuantity}
                      onChange={handleEditChange}
                    />
                    <button onClick={() => saveEdit(product._id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p><strong>Description:</strong> {product.description}</p>
                    <button onClick={() => startEdit(product)}>Edit</button>
                     <button
                     style={{ backgroundColor: "red", color: "white", padding: "8px 12px", borderRadius: "4px", margin: "6px 6px 0px 6px" }}
                      onClick={() => handleDelete(product._id)} > Delete </button>
                  </>
                )}
              </div>
            </div>     
          ))}
        </div>
      </main>
      {/* view selected product modal popup */}
      {selectedProduct && (
      <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{selectedProduct.name}</h2>
    <img
      src={`http://localhost:5000${selectedProduct.image}`}
      alt={selectedProduct.name}
      className="modal-image"
    />

    <div className="modal-grid">
      <p><strong>Brand:</strong> {selectedProduct.brand}</p>
      <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
      <p><strong>Discount:</strong> {selectedProduct.discount}%</p>
      <p><strong>Category:</strong> {selectedProduct.category}</p>
      <p><strong>Sub-category:</strong> {selectedProduct.subCategory}</p>
      <p><strong>Size Available:</strong> {selectedProduct.sizeAvailable}</p>
      <p><strong>Color:</strong> {selectedProduct.color}</p>
      <p><strong>Material:</strong> {selectedProduct.material}</p>
      <p><strong>Warranty:</strong> {selectedProduct.warranty}</p>
      <p><strong>Expected Delivery:</strong> {selectedProduct.expectedDeliveryDate}</p>
      <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
      <p><strong>SKU:</strong> {selectedProduct.sku}</p>
      <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
      <p><strong>Dimensions:</strong> {selectedProduct.dimensions}</p>
      <p><strong>Rating:</strong> {selectedProduct.rating}/5</p>
      <p><strong>Return Policy:</strong> {selectedProduct.returnPolicy}</p>
      <p><strong>Origin:</strong> {selectedProduct.countryOfOrigin}</p>
      <p><strong>Manufacturer:</strong> {selectedProduct.manufacturerDetails}</p>
      <p style={{ gridColumn: "1 / -1" }}><strong>Description:</strong> {selectedProduct.description}</p>
    </div>

    <button onClick={() => setSelectedProduct(null)}>Close</button>
  </div>
</div>

)}

    </div>
  );
};

export default AdminViewProductsPage;

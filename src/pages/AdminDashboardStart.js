// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import './AdminDashboardStart.css';
import { API_URL } from "../api";

const AdminDashboard = () => {
  // State Declarations
  const [userCount, setUserCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesHistory, setSalesHistory] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Function: useEffect - Initial Data Load
  useEffect(() => {
    fetchCounts();
    fetchProducts();
    fetchSalesData();
  }, []);

  // API: Download Payment Excel Report
  const downloadPaymentExcel = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select both month and year.');
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/product/download-excel?month=${selectedMonth}&year=${selectedYear}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment_${selectedMonth}_${selectedYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Failed to download payment excel:', err);
      alert('Download failed');
    }
  };

  // API: Download All Users Excel Report
  const downloadAllUsersExcel = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product/users/download-excel/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_users.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Failed to download user excel:', err);
      alert('Download failed');
    }
  };

  // API: Fetch Total Users and Employees Count
  const fetchCounts = async () => {
    try {
      const userRes = await axios.get(`${API_URL}/api/product/count`);
      setUserCount(userRes.data.count);

      const empRes = await axios.get(`${API_URL}/api/employees/count`);
      setEmployeeCount(empRes.data.count);
    } catch (err) {
      console.error('Error fetching user count:', err);
    }
  };

  // API: Fetch Total Sales, Orders, and Sales History
  const fetchSalesData = async () => {
    try {
      const res1 = await axios.get(`${API_URL}/api/product/total-sales`);
      setTotalSales(res1.data.totalSales || 0);
      setTotalOrders(res1.data.totalOrders || 0);

      const res2 = await axios.get(`${API_URL}/api/product/sales-history`);
      setSalesHistory(res2.data);
    } catch (err) {
      console.error('Error fetching sales data:', err);
    }
  };

  // API: Fetch All Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product/`);
      setProductData(res.data);

      if (res.data.length > 0) {
        const firstProduct = res.data[0];
        setSelectedProduct(firstProduct._id);
        fetchStockHistory(firstProduct._id);
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
    }
  };

  // API: Fetch Stock History by Product ID
  const fetchStockHistory = async (productId) => {
    try {
      const res = await axios.get(`${API_URL}/api/product/${productId}/stock-history`);
      setStockHistory(res.data);
      setSelectedProduct(productId);
    } catch (err) {
      console.error('Error fetching stock history:', err);
    }
  };

  // JSX: Render Admin Dashboard UI
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard" style={{ backgroundColor: '#2c2c2c' }}>Dashboard</Link></li>
          <li><Link to="/admin/view-products">View Products</Link></li>
          <li><Link to="/admin/add-product">Add Product</Link></li>
          <li><Link to="/admin/add-employee">Manage Employee</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </aside>

      <div className="admin-main">
        <h1 style={{ color: '#00ffff' }}>Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="card">
            <h3>Total Users</h3>
            <p>{userCount}</p>
          </div>
          <div className="card">
            <h3>Total Products</h3>
            <p>{productData.length}</p>
          </div>
          <div className="card">
            <h3>Total Employees</h3>
            <p>{employeeCount}</p>
          </div>
          <div className="card">
            <h3>Total Sales (₹)</h3>
            <p>₹{totalSales.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>

          {/* Report Download Controls */}
          <div className="download-section">
            <h2>Download Reports</h2>
            <div className="download-controls">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Year</option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>

              <button onClick={downloadPaymentExcel}>Payment Excel</button>
              <button onClick={downloadAllUsersExcel}>Users Excel</button>
            </div>
          </div>

        </div>

        {/* Product List & Stock History */}
        <div className="dashboard-content">
          <div className="product-list">
            <h2>Product List</h2>
            <ul>
              {productData.map((prod) => (
                <li
                  key={prod._id}
                  onClick={() => fetchStockHistory(prod._id)}
                  className={selectedProduct === prod._id ? 'active' : ''}
                >
                  {prod.name} (Stock: {prod.stockQuantity})
                </li>
              ))}
            </ul>
          </div>

          <div className="stock-history-graph" style={{ width: '43%' }}>
            <h2>Stock History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockHistory}>
                <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#00e0ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <br /><br />
        </div>

        <br /><hr /><br />

        {/* Sales History */}
        <div className="dashboard-content">
          <div className="stock-history-graph" style={{ width: '63%' }}>
            <h2>Sales Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesHistory}>
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2ecc71" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

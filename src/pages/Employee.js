// AdminEmployeePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminEmployeePage.css';
import { Link } from 'react-router-dom';

const AdminEmployeePage = () => {
  // State: Form inputs and permissions for new employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    permissions: { view: false, edit: false }
  });

  // State: Employee list from server
  const [employees, setEmployees] = useState([]);

  // Fetch all employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function: Fetch employee data from backend
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Function: Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If checkbox, update permissions object
    if (name === 'view' || name === 'edit') {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [name]: checked
        }
      });
    } else {
      // For text/email/password/phone inputs
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function: Handle form submit to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/employees/add', formData);
      fetchEmployees(); // Refresh list after adding
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        permissions: { view: false, edit: false }
      });
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  // Function: To Delete the employee from the Organization
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to remove this employee?")) return;

  try {
    const response = await axios.delete(`http://localhost:5000/api/employees/delete/${id}`);

    alert(response.data.message);  // "Employee removed successfully"
    fetchEmployees();               // Refresh employee list
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to remove employee");
  }
 };


  return (
    <div className="admin-employee-page">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/view-products">View Products</Link></li>
          <li><Link to="/admin/add-product">Add Product</Link></li>
          <li><Link to="/admin/add-employee" style={{ backgroundColor: '#2c2c2c' }}>Manage Employee</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="employee-main" style={{ marginLeft: '260px' }}>
        <h2>Employee Management</h2>

        {/* Employee Add Form */}
        <form className="employee-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Permission Checkboxes */}
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="view"
                checked={formData.permissions.view}
                onChange={handleChange}
              />
              View Access
            </label>

            <label>
              <input
                type="checkbox"
                name="edit"
                checked={formData.permissions.edit}
                onChange={handleChange}
              />
              Edit Access
            </label>
          </div>

          <button type="submit">Add Employee</button>
        </form>

        {/* Employee Table List */}
        <div className="employee-list">
          <h3>Employees</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    View: {emp.permissions?.view ? '✔️' : '❌'}, Edit: {emp.permissions?.edit ? '✔️' : '❌'}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(emp._id)} 
                      style={{
                       backgroundColor: "red",
                       color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        marginLeft: "10px" }}>
                        Delete
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminEmployeePage;

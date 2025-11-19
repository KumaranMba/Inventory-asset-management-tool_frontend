import React from 'react';
import AuthForm from '../components/AuthForm'; // Reusable form component
import axios from '../api/axiosConfig'; // Axios instance for API calls
import { useNavigate } from 'react-router-dom'; // Hook for navigation

const RegisterPage = () => {
  const navigate = useNavigate(); // Used to programmatically navigate after registration

  // Handles user registration
  const handleRegister = async (formData) => {
    try {
      // Send form data to backend registration endpoint
      const res = await axios.post("/auth/register", formData);
      const { token, user } = res.data;

      // Store token and user info in session storage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Show success and navigate to home
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      // Show error if registration fails
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // Go back to home page
  const onBack = () => {
    console.log('back');
    navigate("/");
  };

  return (
    <div>
      {/* Render the AuthForm in registration mode */}
      <AuthForm isLogin={false} onSubmit={handleRegister} onBack={onBack} />
    </div>
  );
};

export default RegisterPage;

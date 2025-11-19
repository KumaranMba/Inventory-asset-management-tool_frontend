import React from 'react';
import AuthForm from '../components/AuthForm';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      alert(`Welcome ${res.data.user.name} 👋`);
      localStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      alert(message);
    }
  };

  const onBack = () => {
    navigate("/");
  };

  return (
    <section className="login-page">
      {/* AuthForm receives props to act as a login form */}
      <AuthForm isLogin={true} onSubmit={handleLogin} onBack={onBack} />
    </section>
  );
};

export default LoginPage;

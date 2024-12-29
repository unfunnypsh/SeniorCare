import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = role === 'admin' ? 'http://localhost:5000/api/admin/login' : 'http://localhost:5000/api/caregiver/login';

    try {
      const response = await axios.post(endpoint, { username, password });
      localStorage.setItem('token', response.data.token);
      navigate(role === 'admin' ? '/admin-dashboard' : '/caregiver-dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;

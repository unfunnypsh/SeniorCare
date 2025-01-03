import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./extra/Footer";
import Navbar from "./extra/Navbar";
import adminBg from './extra/admin-bg.jpg'; // Import the background image

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = 'http://localhost:5000/api/admin/login';
    const data = { username, password };

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        navigate('/admin-dashboard'); // Redirect to senior dashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${adminBg})`, // Use the imported background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', zIndex: 1 }}>
        <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4">Admin Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/senior-dashboard')}
                className="btn btn-link text-muted"
              >
                Senior Login
              </button>
              <button
                onClick={() => navigate('/caregiver-dashboard')}
                className="btn btn-link text-muted"
              >
                Caregiver Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

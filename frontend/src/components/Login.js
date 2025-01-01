import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [role, setRole] = useState('admin'); // 'admin' or 'caregiver'
  const [username, setUsername] = useState(''); // For admin login
  const [password, setPassword] = useState(''); // For admin login
  const [name, setName] = useState(''); // For caregiver login
  const [caregiverId, setCaregiverId] = useState(''); // For caregiver login
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let endpoint = '';
    let data = {};

    if (role === 'admin') {
      endpoint = 'http://localhost:5000/api/admin/login';
      data = { username, password };
    } else if (role === 'caregiver') {
      endpoint = 'http://localhost:5000/api/caregiver/login';
      data = { name, caregiverId };
    }

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'caregiver') {
          navigate('/caregiver-dashboard');
        }
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
<div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-center">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h5>
          <div className="text-center mb-3">
            <button
              onClick={() => setRole('admin')}
              className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-secondary'} me-2`}
            >
              Admin Login
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`btn ${role === 'caregiver' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Caregiver Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {role === 'admin' && (
              <>
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
              </>
            )}

            {role === 'caregiver' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Caregiver Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Caregiver ID"
                    value={caregiverId}
                    onChange={(e) => setCaregiverId(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              onClick={() => navigate('/senior-dashboard')}
              className="btn btn-link"
            >
              Go to Senior Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
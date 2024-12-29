import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setRole('admin')}
          style={{
            marginRight: '10px',
            padding: '10px',
            backgroundColor: role === 'admin' ? '#007BFF' : '#ccc',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Admin Login
        </button>
        <button
          onClick={() => setRole('caregiver')}
          style={{
            padding: '10px',
            backgroundColor: role === 'caregiver' ? '#007BFF' : '#ccc',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Caregiver Login
        </button>
      </div>

      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>

      <form onSubmit={handleSubmit}>
        {role === 'admin' && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px', width: '200px' }}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px', width: '200px' }}
            />
            <br />
          </>
        )}

        {role === 'caregiver' && (
          <>
            <input
              type="text"
              placeholder="Caregiver Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px', width: '200px' }}
            />
            <br />
            <input
              type="text"
              placeholder="Caregiver ID"
              value={caregiverId}
              onChange={(e) => setCaregiverId(e.target.value)}
              required
              style={{ margin: '10px', padding: '10px', width: '200px' }}
            />
            <br />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ margin: '10px', padding: '10 px', width: '150px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <button
        onClick={() => navigate('/senior-dashboard')}
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        Go to Senior Dashboard
      </button>
    </div>
  );
};

export default Login;
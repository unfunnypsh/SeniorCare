// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CaregiverDashboard from './components/CaregiverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login role="admin" />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

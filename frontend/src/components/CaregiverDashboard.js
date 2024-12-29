// CaregiverDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaregiverDashboard = () => {
  const [seniors, setSeniors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/caregiver/seniors')
      .then(response => setSeniors(response.data))
      .catch(error => console.error('Error fetching seniors', error));
  }, []);

  return (
    <div>
      <h2>Caregiver Dashboard</h2>
      <h3>Seniors Assigned</h3>
      <ul>
        {seniors.map(senior => (
          <li key={senior.SeniorID}>
            {senior.Name} - {senior.Age} years old
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaregiverDashboard;

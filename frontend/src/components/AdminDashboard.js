import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [seniors, setSeniors] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [newSenior, setNewSenior] = useState({
    name: '',
    age: '',
    gender: '',
    contactDetails: '',
    address: '',
    emergencyContact: '',
    caregiverID: null,
  });
  const [newCaregiver, setNewCaregiver] = useState({
    name: '',
    contactDetails: '',
  });

  useEffect(() => {
    fetchSeniors();
    fetchCaregivers();
  }, []);

  const fetchSeniors = async () => {
    const response = await axios.get('http://localhost:5000/api/admin/reports');
    setSeniors(response.data);
  };
  

  const fetchCaregivers = async () => {
    const response = await axios.get('http://localhost:5000/api/caregivers'); // Create this endpoint
    setCaregivers(response.data);
  };

  const handleSeniorChange = (e) => {
    setNewSenior({ ...newSenior, [e.target.name]: e.target.value });
  };

  const handleCaregiverChange = (e) => {
    setNewCaregiver({ ...newCaregiver, [e.target.name]: e.target.value });
  };

  const addSenior = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/senior', newSenior);
    fetchSeniors(); // Refresh the list
    setNewSenior({ name: '', age: '', gender: '', contactDetails: '', address: '', emergencyContact: '', caregiverID: null });
  };

  const addCaregiver = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/caregiver', newCaregiver);
    fetchCaregivers(); // Refresh the list
    setNewCaregiver({ name: '', contactDetails: '' });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Add Senior</h3>
      <form onSubmit={addSenior}>
        <input type="text" name="name" placeholder="Name" onChange={handleSeniorChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleSeniorChange} required />
        <input type="text" name="gender" placeholder="gender" onChange={handleSeniorChange} required />
        <input type="text" name="contactDetails" placeholder="Contact Details" onChange={handleSeniorChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleSeniorChange} required />
        <input type="text" name="emergencyContact" placeholder="Emergency Contact" onChange={handleSeniorChange} required />
        <select name="caregiverID" onChange={handleSeniorChange} required>
          <option value="">Assign Caregiver</option>
          {caregivers.map(caregiver => (
            <option key={caregiver.CaregiverID} value={caregiver.CaregiverID}>{caregiver.Name}</option>
          ))}
        </select>
        <button type="submit">Add Senior</button>
      </form>

      <h3>Add Caregiver</h3>
      <form onSubmit={addCaregiver}>
        <input type="text" name="name" placeholder="Name" onChange={handleCaregiverChange} required />
        <input type="text" name="contactDetails" placeholder="Contact Details" onChange={handleCaregiverChange} required />
        <button type="submit">Add Caregiver</button>
      </form>

      <h3>Seniors List</h3>
      <ul>
        {seniors.map(senior => (
          <li key={senior.SeniorID}>{senior.SeniorID}-{senior.Name} - {senior.Age} years old</li>
        ))}
      </ul>

      <h3>Caregivers List</h3>
      <ul>
        {caregivers.map(caregiver => (
          <li key={caregiver.CaregiverID}>{caregiver.CaregiverID}-{caregiver.Name}</li>
 ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
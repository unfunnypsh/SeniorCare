import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    caregiverID: '',
    medicalHistory: '',
  });
  const [newCaregiver, setNewCaregiver] = useState({
    name: '',
    contactDetails: '',
  });

  const [showSeniorsList, setShowSeniorsList] = useState(false);
  const [showCaregiversList, setShowCaregiversList] = useState(false);

  useEffect(() => {
    fetchSeniors();
    fetchCaregivers();
  }, []);

  const fetchSeniors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports');
      setSeniors(response.data);
    } catch (error) {
      console.error('Error fetching seniors:', error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/caregivers');
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  const handleSeniorChange = (e) => {
    const { name, value } = e.target;
    setNewSenior((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver((prev) => ({ ...prev, [name]: value }));
  };

  const addSenior = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/senior', newSenior);
      fetchSeniors();
      setNewSenior({
        name: '',
        age: '',
        gender: '',
        contactDetails: '',
        address: '',
        emergencyContact: '',
        caregiverID: '',
        medicalHistory: '',
      });
    } catch (error) {
      console.error('Error adding senior:', error);
      alert('Failed to add senior. Please try again.');
    }
  };

  const addCaregiver = async (e) => {
    e.preventDefault();
    if (!newCaregiver.name || !newCaregiver.contactDetails) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/admin/caregiver', newCaregiver);
      fetchCaregivers();
      setNewCaregiver({ name: '', contactDetails: '' });
    } catch (error) {
      console.error('Error adding caregiver:', error);
      alert('Failed to add caregiver. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h3>Add Senior</h3>
          <form onSubmit={addSenior}>
            <div className="form-group">
              <input type="text" className="form-control" name="name" placeholder="Name" value={newSenior.name} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <input type="number" className="form-control" name="age" placeholder="Age" value={newSenior.age} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="gender" placeholder="Gender" value={newSenior.gender} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="contactDetails" placeholder="Contact Details" value={newSenior.contactDetails} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="address" placeholder="Address" value={newSenior.address} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="emergencyContact" placeholder="Emergency Contact" value={newSenior.emergencyContact} onChange={handleSeniorChange} required />
            </div>
            <div className="form-group">
              <textarea className="form-control" name="medicalHistory" placeholder="Medical History" value={newSenior.medicalHistory} onChange={handleSeniorChange} />
            </div>
            <div className="form-group">
              <select name="caregiverID" className="form-control" value={newSenior.caregiverID} onChange={handleSeniorChange} required>
                <option value="">Assign Caregiver</option>
                {caregivers.map((caregiver) => (
                  <option key={caregiver.CaregiverID} value={caregiver.CaregiverID}>
                    {caregiver.Name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Senior</button>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3>Add Caregiver</h3>
          <form onSubmit={addCaregiver}>
            <div className="form-group">
              <input type="text" className="form-control" name="name" placeholder="Name" value={newCaregiver.name} onChange={handleCaregiverChange} required />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" name="contactDetails" placeholder="Contact Details" value={newCaregiver.contactDetails} onChange={handleCaregiverChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Add Caregiver</button>
          </form>
        </div>
      </div>

      {/* Toggle Seniors List Card */}
      <div className="card mb-4">
        <div className="card-body">
          <button className="btn btn-secondary" onClick={() => setShowSeniorsList(!showSeniorsList)}>
            {showSeniorsList ? 'Hide Seniors List' : 'Show Seniors List'}
          </button>
          {showSeniorsList && (
            <div className="mt-3">
              <h3>Seniors List</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Senior ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact Details</th>
                    <th>Address</th>
                    <th>Emergency Contact</th>
                    <th>Medical History</th>
                    <th>Caregiver ID</th>
                  </tr>
                </thead>
                <tbody>
                  {seniors.map(senior => (
                    <tr key={senior.SeniorID}>
                      <td>{senior.SeniorID}</td>
                      <td>{senior.Name}</td>
                      <td>{senior.Age} years old</td>
                      <td>{senior.Gender}</td>
                      <td>{senior.ContactDetails}</td>
                      <td>{senior.Address}</td>
                      <td>{senior.EmergencyContact}</td>
                      <td>{senior.MedicalHistory}</td>
                      <td>{senior.CaregiverID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Caregivers List Card */}
      <div className="card mb-4">
        <div className="card-body">
          <button className="btn btn-secondary" onClick={() => setShowCaregiversList(!showCaregiversList)}>
            {showCaregiversList ? 'Hide Caregivers List' : 'Show Caregivers List'}
          </button>
          {showCaregiversList && (
            <div className="mt-3">
              <h3>Caregivers List</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Caregiver ID</th>
                    <th>Name</th>
                    <th>Contact Details</th>
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map(caregiver => (
                    <tr key={caregiver.CaregiverID}>
                      <td>{caregiver.CaregiverID}</td>
                      <td>{caregiver.Name}</td>
                      <td>{caregiver.ContactDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
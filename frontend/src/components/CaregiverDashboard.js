import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CaregiverDashboard = () => {
  const [caregiverID, setCaregiverID] = useState('');
  const [caregiver, setCaregiver] = useState(null);
  const [seniors, setSeniors] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [progressID, setProgressID] = useState('');
  const [seniorID, setSeniorID] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [socialInteraction, setSocialInteraction] = useState({
    interactionType: '',
    interactionDate: '',
    details: '',
  });
  const [physicalActivity, setPhysicalActivity] = useState({
    physicalName: '',
    frequency: '',
    duration: '',
    assignedDate: '',
    intensity: 'Low',
  });
  const [cognitiveTask, setCognitiveTask] = useState({
    taskName: '',
    assignedDate: '',
    completionStatus: false,
  });

  const fetchCaregiverProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/caregiver/profile?caregiverID=${caregiverID}`);
      setCaregiver(response.data);
      fetchSeniors(response.data.CaregiverID);
    } catch (error) {
      console.error('Error fetching caregiver profile:', error);
    }
  };

  const fetchSeniors = async (caregiverID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/seniors/${caregiverID}`);
      setSeniors(response.data);
    } catch (error) {
      console.error('Error fetching seniors:', error);
    }
  };

  const handleSelectSenior = (senior) => {
    setSelectedSenior(senior);
  };

  const handleInputChange = (e, stateSetter) => {
    stateSetter((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    setCognitiveTask((prevState) => ({ ...prevState, completionStatus: e.target.checked }));
  };

  const handleFormSubmit = async (e, endpoint, data, message) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, data);
      alert(message);
    } catch (error) {
      console.error(`Error submitting ${endpoint}:`, error);
    }
  };
  const handleCleanRedundantActivity = async () => {
    try {
      await axios.post('http://localhost:5000/api/clean-activity-participation');
      alert('Redundant activity participation cleaned successfully.');
    } catch (error) {
      console.error('Error cleaning redundant activity participation:', error);
      alert('Error cleaning redundant activity participation.');
    }
  };
  const handleInsertProgress = async () => {
    try {
      await axios.post('http://localhost:5000/api/caregiver/insert-progress');
      alert('Progress tracking data inserted successfully!');
    } catch (error) {
      console.error('Error inserting progress tracking data:', error);
      alert('Error inserting progress tracking data.');
    }
  };
  const fetchProgressTrackingData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/progress-tracking');
      setProgressData(response.data);
      console.log('Fetched progress tracking data:', response.data);
    } catch (error) {
      console.error('Error fetching progress tracking data:', error);
    }
  };

  const updateNotes = async () => {
    if (!progressID || !seniorID || notes === '') {
        alert('ProgressID, SeniorID, and Notes are required.');
        return;
    }

    try {
        const response = await axios.put('http://localhost:5000/api/progress-tracking/update', {
            progressID,
            seniorID,
            notes,
        });
        alert(response.data);
        fetchProgressTrackingData(); // Refresh the data after updating
    } catch (error) {
        console.error('Error updating notes:', error);
        alert('Error updating notes.');
    }
};

const updateProgressStatus = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/update-progress-status');
    alert(response.data);
    fetchProgressTrackingData(); // Refresh data after updating
  } catch (error) {
    console.error('Error updating progress status:', error);
    alert('Error updating progress status.');
  }
};


  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4">Caregiver Dashboard</h2>

    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Enter Caregiver ID"
        value={caregiverID}
        onChange={(e) => setCaregiverID(e.target.value)}
      />
      <button className="btn btn-primary mt-2" onClick={fetchCaregiverProfile}>Fetch Caregiver Profile</button>
    </div>

    {caregiver && (
      <div className="alert alert-info">
        <h3>Welcome, {caregiver.Name}</h3>
      </div>
    )}

    <h3>Select Senior</h3>
    <ul class Name="list-group mb-4">
      {seniors.map((senior) => (
        <li key={senior.SeniorID} className="list-group-item" onClick={() => handleSelectSenior(senior)}>
          {senior.Name} - {senior.Age} years old
        </li>
      ))}
    </ul>

    {selectedSenior && (
      <div className="card mb-4">
        <div className="card-body">
        <h2 className="card-title">Selected Senior Details</h2>
                        <p><strong>Name:</strong> {selectedSenior.Name}</p>
                        <p><strong>Age:</strong> {selectedSenior.Age}</p>
                        <p><strong>Gender:</strong> {selectedSenior.Gender}</p>
                        <p><strong>Contact Details:</strong> {selectedSenior.ContactDetails}</p>
                        <p><strong>Address:</strong> {selectedSenior.Address}</p>
                        <p><strong>Emergency Contact:</strong> {selectedSenior.EmergencyContact}</p>
          <h3>Update Records for {selectedSenior.Name}</h3>

          <h4>Social Interaction</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/social-interaction', { ...socialInteraction, seniorID: selectedSenior.SeniorID }, 'Social Interaction added')
            }
          >
            <div className="mb-3">
              <input
                type="text"
                name="interactionType"
                className="form-control"
                placeholder="Interaction Type"
                onChange={(e) => handleInputChange(e, setSocialInteraction)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="interactionDate"
                className="form-control"
                onChange={(e) => handleInputChange(e, setSocialInteraction)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                name="details"
                className="form-control"
                placeholder="Details"
                onChange={(e) => handleInputChange(e, setSocialInteraction)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Add Social Interaction</button>
          </form>

          <h4 className="mt-4">Physical Activity</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/physical-activity', { ...physicalActivity, seniorID: selectedSenior.SeniorID }, 'Physical Activity added')
            }
          >
            <div className="mb-3">
              <input
                type="text"
                name="physicalName"
                className="form-control"
                placeholder="Physical Name"
                onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="frequency"
                className="form-control"
                placeholder="Frequency"
                onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="duration"
                className="form-control"
                placeholder="Duration (minutes)"
                onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="assignedDate"
                className="form-control"
                onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                required
              />
            </div>
            <div className="mb-3">
              <select
                name="intensity"
                className="form-select"
                onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                value={physicalActivity.intensity}
                required
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">Add Physical Activity</button>
          </form>

          <h4 className="mt-4">Cognitive Task</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/cognitive-task', { ...cognitiveTask, seniorID: selectedSenior.SeniorID }, 'Cognitive Task added')
            }
          >
            <div className="mb-3">
              <input
                type="text"
                name="taskName"
                className="form-control"
                placeholder="Task Name"
                onChange={(e) => handleInputChange(e, setCognitiveTask)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="assignedDate"
                className="form-control"
                onChange={(e) => handleInputChange(e, setCognitiveTask)}
                required
              />
            </div>
<div className="mb-3 form-check">
              <input
                type="checkbox"
                name="completionStatus"
                className="form-check-input"
                checked={cognitiveTask.completionStatus}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label">Completed</label>
            </div>
            <button type="submit" className="btn btn-success">Add Cognitive Task</button>
          </form>
        </div>
      </div>
    )}

    <div className="mb-4">
      <button className="btn btn-danger" onClick={handleCleanRedundantActivity}>Clean Redundant Activity Participation</button>
      <button className="btn btn-primary" onClick={handleInsertProgress}>Insert Progress</button>
    </div>

    <div>
      <h3>Progress Tracking Data</h3>
      <button className="btn btn-info mb-3" onClick={fetchProgressTrackingData}>Fetch Progress Data</button>
      <ul className="list-group">
        {progressData.map((progress) => (
          <li key={progress.ID} className="list-group-item">
            ProgressID: {progress.ProgressID}, Senior ID: {progress.SeniorID}, Date: {new Date(progress.Date).toLocaleDateString()}, Progress Status: {progress.ProgressStatus}, Notes: {progress.Notes}
          </li>
        ))}
      </ul>

      <h3 className="mt-4">Update Progress Tracking Notes</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Progress ID"
          value={progressID}
          onChange={(e) => setProgressID(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Senior ID"
          value={seniorID}
          onChange={(e) => setSeniorID(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Enter your notes here"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button className="btn btn-warning" onClick={updateNotes}>Update Notes</button>
      <h3 className="mt-4">Update Progress Status</h3>
      <button className="btn btn-warning" onClick={updateProgressStatus}>Update Progress Status</button>
    </div>
  </div>
  );
};

export default CaregiverDashboard;

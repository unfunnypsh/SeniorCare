import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Caregiver Dashboard</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Caregiver ID"
          value={caregiverID}
          onChange={(e) => setCaregiverID(e.target.value)}
        />
        <button onClick={fetchCaregiverProfile}>Fetch Caregiver Profile</button>
      </div>

      {caregiver && (
        <div>
          <h3>Welcome, {caregiver.Name}</h3>
        </div>
      )}

      <h3>Select Senior</h3>
      <ul>
        {seniors.map((senior) => (
          <li key={senior.SeniorID} onClick={() => handleSelectSenior(senior)}>
            {senior.Name} - {senior.Age} years old
          </li>
        ))}
      </ul>

      {selectedSenior && (
        <div>
          <h3>Update Records for {selectedSenior.Name}</h3>

          <h4>Social Interaction</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/social-interaction', { ...socialInteraction, seniorID: selectedSenior.SeniorID }, 'Social Interaction added')
            }
          >
            <input
              type="text"
              name="interactionType"
              placeholder="Interaction Type"
              onChange={(e) => handleInputChange(e, setSocialInteraction)}
              required
            />
            <input
              type="date"
              name="interactionDate"
              onChange={(e) => handleInputChange(e, setSocialInteraction)}
              required
            />
            <textarea
              name="details"
              placeholder="Details"
              onChange={(e) => handleInputChange(e, setSocialInteraction)}
              required
            />
            <button type="submit">Add Social Interaction</button>
          </form>

          <h4>Physical Activity</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/physical-activity', { ...physicalActivity, seniorID: selectedSenior.SeniorID }, 'Physical Activity added')
            }
          >
            <input
              type="text"
              name="physicalName"
              placeholder="Physical Name"
              onChange={(e) => handleInputChange(e, setPhysicalActivity)}
              required
            />
            <input
              type="text"
              name="frequency"
              placeholder="Frequency"
              onChange={(e) => handleInputChange(e, setPhysicalActivity)}
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              onChange={(e) => handleInputChange(e, setPhysicalActivity)}
              required
            />
            <input
              type="date"
              name="assignedDate"
              onChange={(e) => handleInputChange(e, setPhysicalActivity)}
              required
            />
            <select
              name="intensity"
              onChange={(e) => handleInputChange(e, setPhysicalActivity)}
              value={physicalActivity.intensity}
              required
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
            <button type="submit">Add Physical Activity</button>
          </form>

          <h4>Cognitive Task</h4>
          <form
            onSubmit={(e) =>
              handleFormSubmit(e, 'caregiver/cognitive-task', { ...cognitiveTask, seniorID: selectedSenior.SeniorID }, 'Cognitive Task added')
            }
          >
            <input
              type="text"
              name="taskName"
              placeholder="Task Name"
              onChange={(e) => handleInputChange(e, setCognitiveTask)}
              required
            />
            <input
              type="date"
              name="assignedDate"
              onChange={(e) => handleInputChange(e, setCognitiveTask)}
              required
            />
            <label>
              Completed:
              <input
                type="checkbox"
                name="completionStatus"
                checked={cognitiveTask.completionStatus}
                onChange={handleCheckboxChange}
              />
            </label>
            <button type="submit">Add Cognitive Task</button>
          </form>
        </div>
      )}
      <div>
        <button onClick={handleCleanRedundantActivity}>Clean Redundant Activity Participation</button>
        <button onClick={handleInsertProgress}>Insert Progress</button>
      </div>
      <div>
      <h3>Progress Tracking Data</h3>
      <button onClick={fetchProgressTrackingData}>Fetch Progress Data</button>
      <ul>
        {progressData.map((progress) => (
          <li key={progress.ID}>
            ProgressID: {progress.ProgressID},Senior ID: {progress.SeniorID}, Date: {progress.Date},ProgressStatus: {progress.ProgressStatus}, Notes: {progress.Notes}
          </li>
        ))}
      </ul>

      <h3>Update Progress Tracking Notes</h3>
      <input
        type="text"
        placeholder="Progress ID"
        value={progressID}
        onChange={(e) => setProgressID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Senior ID"
        value={seniorID}
        onChange={(e) => setSeniorID(e.target.value)}
      />
      <textarea
        placeholder="Enter your notes here"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={updateNotes}>Update Notes</button>
      <h3>Update Progress Status</h3>
      <button onClick={updateProgressStatus}>Update Progress Status</button>
      </div>
    </div>
  );
};

export default CaregiverDashboard;

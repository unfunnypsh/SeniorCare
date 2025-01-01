import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CaregiverDashboard = () => {
  const [caregiverID, setCaregiverID] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverGmail, setCaregiverGmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    duration: '',
    assignedDate: '',
    intensity: 'Low',
    completedStatus: false,
  });
  
  const [cognitiveTask, setCognitiveTask] = useState({
    taskName: '',           
    assignedDate: '',      
    completionStatus: false, 
    timeSpent: '',           
    difficultyLevel: 'Easy', 
  });
  
  // Caregiver login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/caregiver/login', {
        name: caregiverName,
        caregiverId: caregiverID,
        gmailID: caregiverGmail,
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        fetchCaregiverProfile();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed, please try again.');
    }
  };


    const [searchQuery, setSearchQuery] = useState('');

    const filteredSeniors = seniors.filter(senior => 
      senior.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
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

  const handlePhysicalCheckboxChange = (e, setter) => {
    setter((prevState) => ({ ...prevState, completedStatus: e.target.checked }));
  };
  
   
  const handleCheckboxChange = (e) => {
    setCognitiveTask((prevState) => ({ ...prevState, completionStatus: e.target.checked }));
  };

  const handleFormSubmit = async (e, endpoint, data, message) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, data);
      alert(message);
      await handleCleanRedundantActivity();
    } catch (error) {
      console.error(`Error submitting ${endpoint}:`, error);
    }
  };
  const handleCleanRedundantActivity = async () => {
    try {
      await axios.post('http://localhost:5000/api/clean-activity-participation');
      console.log("Success");
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

const handleInsertAndUpdateProgress=()=>{
  handleInsertProgress();
  setTimeout(()=>{
    updateProgressStatus();
  },500);
}


  return (
    <div className="container mt-5">
      {/* Caregiver Login Form */}
      {!isAuthenticated && (
        <div>
          <h2 className="text-center mb-4 text-primary">Caregiver Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Caregiver Name"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Caregiver ID"
                value={caregiverID}
                onChange={(e) => setCaregiverID(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Caregiver Gmail ID"
                value={caregiverGmail}
                onChange={(e) => setCaregiverGmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-auto" type="submit">
              Login
            </button>
          </form>
        </div>
      )}

      {/* Caregiver Dashboard (Visible after login) */}
      {isAuthenticated && (
        <div>
          <h2 className="text-center mb-4 text-primary">Caregiver Dashboard</h2>

          {/* Caregiver Info */}
          {caregiver && (
            <div className="alert alert-info text-center">
              <h3>Welcome, {caregiver.Name}</h3>
            </div>
          )}

          {/* Senior Selection */}
          <h3 className="text-secondary">Select Senior</h3>
          <ul className="list-group mb-4">
            {seniors.map((senior) => (
              <li
                key={senior.SeniorID}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => handleSelectSenior(senior)}
                style={{ cursor: 'pointer' }}
              >
                {senior.Name}
                <span className="badge bg-primary rounded-pill">{senior.Age} yrs</span>
              </li>
            ))}
          </ul>

  {/* Selected Senior Details */}
  {selectedSenior && (
    <div className="card mb-4 shadow">
      <div className="card-header bg-primary text-white">
        <h4>Selected Senior: {selectedSenior.Name}</h4>
      </div>
      <div className="card-body">
              <p><strong>Age:</strong> {selectedSenior.Age}</p>
              <p><strong>Gender:</strong> {selectedSenior.Gender}</p>
              <p><strong>Contact:</strong> {selectedSenior.ContactDetails}</p>
              <p><strong>Address:</strong> {selectedSenior.Address}</p>
              <p><strong>Emergency Contact:</strong> {selectedSenior.EmergencyContact}</p>
              <p><strong>Medical History:</strong> {selectedSenior.MedicalHistory}</p>
            </div>
          </div>
  )}

  {/* Forms */}
  {selectedSenior && (
        <div className="row">
        {/* Social Interaction Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-primary">Social Interaction</h4>
              <form
                onSubmit={(e) =>
                  handleFormSubmit(e, 'caregiver/social-interaction', { ...socialInteraction, seniorID: selectedSenior.SeniorID }, 'Social Interaction added')
                }
              >
                <div className="mb-3">
                  <input
                    type="text"
                    name="interactionType"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Interaction Type"
                    onChange={(e) => handleInputChange(e, setSocialInteraction)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    name="interactionDate"
                    className="form-control col-sm-8 mx-auto"
                    onChange={(e) => handleInputChange(e, setSocialInteraction)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="details"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Details"
                    onChange={(e) => handleInputChange(e, setSocialInteraction)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-auto mx-auto d-block">Add Social Interaction</button>
              </form>
            </div>
          </div>
        </div>

        {/* Physical Activity Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-primary">Physical Activity</h4>
              <form
                onSubmit={(e) =>
                  handleFormSubmit(e, 'caregiver/physical-activity', { ...physicalActivity, seniorID: selectedSenior.SeniorID }, 'Physical Activity added')
                }
              >
                <div className="mb-3">
                  <input
                    type="text"
                    name="physicalName"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Physical Activity Name"
                    onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    name="duration"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Duration (minutes)"
                    onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    name="assignedDate"
                    className="form-control col-sm-8 mx-auto"
                    onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="intensity"
                    className="form-select col-sm-8 mx-auto"
                    onChange={(e) => handleInputChange(e, setPhysicalActivity)}
                    value={physicalActivity.intensity}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="completedStatus"
                    className="form-check-input"
                    checked={physicalActivity.completedStatus}
                    onChange={(e) => handlePhysicalCheckboxChange(e, setPhysicalActivity)}
                  />
                  <label className="form-check-label">Completed</label>
                </div>
                <button type="submit" className="btn btn-success w-auto">Add Physical Activity</button>
              </form>
            </div>
          </div>
        </div>

        {/* Cognitive Task Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-primary">Cognitive Task</h4>
              <form
                onSubmit={(e) =>
                  handleFormSubmit(e, 'caregiver/cognitive-task', { ...cognitiveTask, seniorID: selectedSenior.SeniorID }, 'Cognitive Task added')
                }
              >
                <div className="mb-3">
                  <input
                    type="text"
                    name="taskName"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Task Name"
                    onChange={(e) => handleInputChange(e, setCognitiveTask)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    name="assignedDate"
                    className="form-control col-sm-8 mx-auto"
                    onChange={(e) => handleInputChange(e, setCognitiveTask)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    name="timeSpent"
                    className="form-control col-sm-8 mx-auto"
                    placeholder="Time Spent (minutes)"
                    onChange={(e) => handleInputChange(e, setCognitiveTask)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="difficultyLevel"
                    className="form-select col-sm-8 mx-auto"
                    onChange={(e) => handleInputChange(e, setCognitiveTask)}
                    value={cognitiveTask.difficultyLevel}
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="completionStatus"
                    className="form-check-input"
                    checked={cognitiveTask.completionStatus}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label">Completed</label>
                </div>
                <button type="submit" className="btn btn-success w-auto">Add Cognitive Task</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  )}

  {/* Progress Tracking */}
  <div className="my-4">
  <h3 className="text-secondary">Progress Tracking Data</h3>
  <button className="btn btn-info w-auto mb-3" onClick={handleInsertAndUpdateProgress}>
    Fetch Progress Data
  </button>

        {/* Progress Tracking Table */}
        {selectedSenior && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Progress ID</th>
                  <th>Senior ID</th>
                  <th>Date</th>
                  <th>Progress Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {progressData
                  .filter(progress => progress.SeniorID === selectedSenior.SeniorID)
                  .map((progress) => (
                    <tr key={progress.ProgressID}>
                      <td>{progress.ProgressID}</td>
                      <td>{progress.SeniorID}</td>
                      <td>{new Date(progress.Date).toLocaleDateString()}</td>
                      <td>{progress.ProgressStatus}</td>
                      <td>{progress.ProgressScore}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

  <h4 className="mt-4 text-secondary">Update Progress Notes</h4>
  <div className="mb-3">
    <input
      type="text"
      className="form-control col-sm-8 mx-auto"
      placeholder="Progress ID"
      value={progressID}
      onChange={(e) => setProgressID(e.target.value)}
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      className="form-control col-sm-8 mx-auto"
      placeholder="Senior ID"
      value={seniorID}
      onChange={(e) => setSeniorID(e.target.value)}
    />
  </div>
  <div className="mb-3">
    <textarea
      className="form-control col-sm-8 mx-auto"
      placeholder="Enter your notes here"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
  </div>
  <button className="btn btn-warning w-auto" onClick={updateNotes}>
    Update Notes
  </button>
</div>
</div>
  )}
</div>

  );
};

export default CaregiverDashboard;

/* make it such that after login theres 3 rows first row contains the select senior card that has a search filter insdide it to search seniors by name and the selected senior card with their info..2nd row contains the already existing 3 cards that are in proper format dont change that... in  3rd row  ive the card with progress title and fetch progress button. it takes 2 columns space and in the 3rd column space ive the update notes card on the left remove the senior  */

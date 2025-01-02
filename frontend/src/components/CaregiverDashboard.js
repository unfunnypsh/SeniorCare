import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CaregiverDashboard.css';

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
  const [filteredSeniors, setFilteredSeniors] = useState(seniors);
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
        setCaregiverID(caregiverID); // Ensure caregiverID is set correctly
        fetchCaregiverProfile();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed, please try again.');
    }
  };
  
  useEffect(() => {
    setFilteredSeniors(seniors);
  }, [seniors]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    const filtered = seniors.filter(senior => 
      senior.Name.toLowerCase().includes(query.toLowerCase())
    );
  
    setFilteredSeniors(filtered);
  };

    const [searchQuery, setSearchQuery] = useState('');

    // const filteredSeniors = seniors.filter(senior => 
    //   senior.Name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
  
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
  const fetchCaregiver = async (caregiverID) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/api/caregiver/profile?caregiverID=${caregiverID}`
        );
        setCaregiver(response.data);
    } catch (error) {
        console.error("Error fetching caregiver details:", error);
    }
};
  const handleSelectSenior = async (senior) => {
    setSelectedSenior(senior);
    await fetchCaregiver(senior.CaregiverID);
    setCaregiverID(senior.CaregiverID);
    if (!senior || !senior.SeniorID) {
      console.error('Selected senior is invalid:', senior);
      return;
    }
    fetchMessages(senior.SeniorID, caregiverID); // Pass both seniorID and caregiverID
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
    if (!progressID || !selectedSenior || notes === '') {
        alert('ProgressID, SeniorID, and Notes are required.');
        return;
    }

    try {
        const response = await axios.put('http://localhost:5000/api/progress-tracking/update', {
            progressID,
            seniorID: selectedSenior.SeniorID, // Ensure you're sending the correct Senior ID
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
const fetchMessages = async (seniorID, caregiverID) => {
  try {
    // Ensure that both seniorID and caregiverID are correct
    const response = await axios.get(`http://localhost:5000/api/messages/${seniorID}/${caregiverID}`);
    setMessages(response.data);  // Update state with the messages from the API
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};



const sendMessage = async (e) => {
  e.preventDefault();

  // Check if caregiverID and selectedSenior are properly set
  if (!caregiverID || !selectedSenior || !selectedSenior.SeniorID || !newMessage) {
    alert('Please ensure a senior is selected and a caregiver is logged in.');
    return;
  }

  // Log to verify the correct values
  console.log('Sending message:', {
    senderID: caregiverID,  // Should be set from caregiver's login
    receiverID: selectedSenior.SeniorID,  // Should be set when a senior is selected
    messageText: newMessage,  // Ensure message text is set
  });

  try {
    const response = await axios.post('http://localhost:5000/api/messages', {
      senderID: caregiverID,  // Ensure caregiverID is correctly passed
      receiverID: selectedSenior.SeniorID,  // Ensure SeniorID is correctly passed
      messageText: newMessage,  // Ensure message text is correctly passed
    });

    // After successful send, clear the input and reload messages
    setNewMessage('');  // Clear the message input
    fetchMessages(selectedSenior.SeniorID, caregiverID);  // Refresh messages after sending
  } catch (error) {
    console.error('Error sending message:', error);  // Log error for debugging
    alert('Failed to send message. Please try again.');
  }
};



  return (
    <div className="container mt-5">
      {/* Caregiver Login Form */}
      {!isAuthenticated && (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-container">
    <div className="row w-100">
      <div className="col-md-6 login-left d-none d-md-flex align-items-center justify-content-center">
        {/* Background image will be applied via CSS */}
      </div>
      <div className="col-md-6">
        <div className="login-form p-4">
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
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
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

    {/* First Row: Senior Selection with Search Filter */}
    <div className="row mb-4">
  <div className="col-md-6">
    <div className="card mb-4 shadow">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">Select Senior</h3>
      </div>
      <div className="card-body">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredSeniors.map((senior) => (
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
      </div>
    </div>
  </div>

  {/* Selected Senior Details */}
  <div className="col-md-6">
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
  </div>
</div>

    {/* Second Row: Existing Cards */}
    {selectedSenior && (
      <div className="row mb-4">
        {/* Social Interaction Card */}
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
                <button type="submit" className="btn btn-primary w-auto">Add Cognitive Task</button>
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
                <button type="submit" className="btn btn-primary w-auto">Add Physical Activity</button>
              </form>
            </div>
          </div>
        </div>

        {/* Cognitive Task Card */}
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
                <button type="submit" className="btn btn-primary w-auto mx-auto d-block">Add Social Interaction</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Third Row: Progress Tracking and Update Notes */}
    <div className="row">
  {selectedSenior && ( // Only render this card if a senior is selected
    <div className="col-md-12 mb-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Progress Tracking</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 mb-4">
              <button className="btn btn-primary w-auto mb-3" onClick={handleInsertAndUpdateProgress}>
                Fetch Progress Data
              </button>

              {/* Progress Tracking Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Progress ID</th>
                      <th>Senior ID</th>
                      <th>Date</th>
                      <th>Progress Status</th>
                      <th>Score</th>
                      <th>Note</th>
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
                          <td>{progress.Notes}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Notes Card */}
            <div className="col-md-4 mb-4">
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
                  value={selectedSenior ? selectedSenior.SeniorID : ''} // Use selectedSenior's ID
                  readOnly // Make it read-only
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
              <button className="btn btn-primary w-auto" onClick={updateNotes}>
                Update Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
  <div className="col-md-12">
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">Messages</h3>
      </div>
      <div className="card-body">
        <div className="message-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.MessageID}
                className={`message-card ${msg.SenderID === caregiverID ? 'sent' : 'received'}`}
              >
                {/* Sender Label */}
                <p className={`message-label ${msg.SenderID === caregiverID ? 'sent-label' : 'received-label'}`}>
                  {msg.SenderID === caregiverID ? 'You' : 'Senior'}
                </p>
                <p><strong>{msg.SenderName}</strong></p>
                <p>{msg.MessageText}</p>
                <p className="text-muted">{new Date(msg.SentAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        <form onSubmit={sendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
    </div>
  )}
  
</div>

  </div>
  
)}
</div>

  );
};

export default CaregiverDashboard;


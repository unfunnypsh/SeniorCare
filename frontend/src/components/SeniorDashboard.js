import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SeniorDashboard.css';

const SeniorDashboard = () => {
    // States to manage selected senior, activity types, and progress
    const [seniors, setSeniors] = useState([]);
    const [seniorID, setSeniorID] = useState(null);
    const [physicalActivity, setPhysicalActivity] = useState([]);
    const [seniorDetails, setSeniorDetails] = useState(null);
    const [cognitiveActivity, setCognitiveActivity] = useState([]);
    const [caregiverID, setCaregiverID] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [caregiver, setCaregiver] = useState(null);
    const [socialActivity, setSocialActivity] = useState([]);
    const [progress, setProgress] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    
    const [report, setReport] = useState('');
    const [participationData, setParticipationData] = useState([]);
    const [progressData, setProgressData] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');

    // State variables for toggling sections
    const [showPhysicalActivities, setShowPhysicalActivities] = useState(false);
    const [showCognitiveTasks, setShowCognitiveTasks] = useState(false);
    const [showSocialInteractions, setShowSocialInteractions] = useState(false);
    const [showProgressTracking, setShowProgressTracking] = useState(false);

    useEffect(()=>{
        fetchSeniors();
    },[]);

    const [showSections, setShowSections] = useState({
        physical: false,
        cognitive: false,
        social: false,
        progress: false,
    });
    const toggleSection = (section) => {
        setShowSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
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
    const fetchSeniors = async () => {
        try{
        const response = await axios.get('http://localhost:5000/api/seniors');
        setSeniors(response.data);
        } catch (error){
            console.error('Error fetching seniors:', error);
        }
  };
  const fetchSeniorProfile = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/profile?seniorID=${seniorID}`);
        setSeniorDetails(response.data); // Update state with the fetched senior details
    } catch (error) {
        console.error('Error fetching senior profile:', error);
    }
};

const fetchActivities = async (seniorID) => {
    try {
        const [physicalRes, cognitiveRes, socialRes, progressRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/senior/${seniorID}/physical-activities`),
            axios.get(`http://localhost:5000/api/senior/${seniorID}/cognitive-tasks`),
            axios.get(`http://localhost:5000/api/senior/${seniorID}/social-interactions`),
            axios.get(`http://localhost:5000/api/senior/${seniorID}/progress-tracking`),
        ]);
        setPhysicalActivity(physicalRes.data);
        setCognitiveActivity(cognitiveRes.data);
        setSocialActivity(socialRes.data);
        setProgressData(progressRes.data);
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
};

const fetchPhysicalActivities = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/physical-activities`);
        setPhysicalActivity(response.data);
    } catch (error) {
        console.error('Error fetching physical activities:', error);
    }
};

  // Fetch cognitive tasks for a selected senior
  const fetchCognitiveTasks = async (seniorID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/cognitive-tasks`);
      console.log('Cognitive Tasks:', response.data); // Log the response for debugging
      setCognitiveActivity(response.data);
    } catch (error) {
      console.error('Error fetching cognitive tasks:', error);
    }
  };

const fetchSocialInteractions = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/social-interactions`);
        console.log('Social Interactions:', response.data); // Log the response
        setSocialActivity(response.data);
    } catch (error) {
        console.error('Error fetching social interactions:', error);
    }
};
const fetchProgressTracking = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/progress-tracking`);
        setProgressData(response.data);
    } catch (error) {
        console.error('Error fetching progress data:', error);
    }
};




const handleFetchDetails = async () => {
    if (!selectedSenior) {
        alert("Please select a senior first!");
        return;
    }

    try {
        const response = await axios.get(
            `http://localhost:5000/api/senior/${selectedSenior.SeniorID}/report`
        );
        console.log("Senior Details Response:", response.data); // Log the API response
        setSeniorDetails(response.data); // Set the fetched details in state
        alert("Senior details fetched successfully!");
    } catch (error) {
        console.error("Error fetching senior details:", error);
        alert("Failed to fetch senior details. Please try again.");
    }
};

async function fetchSeniorReport(seniorID) {
    try {
      const response = await fetch(`/api/senior/${seniorID}/report`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching senior report:', error);
      throw error;
    }
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
};


const filterByDate = (data, dateField) => {
    if (!selectedDate) return data; // No date filter applied
    return data.filter(item => new Date(item[dateField]).toLocaleDateString() === new Date(selectedDate).toLocaleDateString());
};

const handleSelectSenior = async (senior) => {
    setSelectedSenior(senior);
    setCaregiver(null); // Clear caregiver details until fetched

    // Fetch caregiver details
    await fetchCaregiver(senior.CaregiverID);

    // Fetch activities for the selected senior
    await fetchActivities(senior.SeniorID);

    // After fetching caregiver details, set caregiverID
    setCaregiverID(senior.CaregiverID); // Ensure caregiverID is set

    // Fetch messages for the selected senior and their caregiver
    await fetchMessages(senior.SeniorID, senior.CaregiverID);
};
    const filteredSeniors = seniors.filter(senior =>
        senior.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senior.SeniorID.toString().includes(searchTerm)
    );
    
    useEffect(() => {
        if (selectedSenior && caregiverID) {
            fetchMessages(selectedSenior.SeniorID, caregiverID); // Fetch messages for the selected senior
        }
    }, [selectedSenior, caregiverID]);
      
      const fetchMessages = async (seniorID, caregiverID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/${seniorID}/${caregiverID}`);
            setMessages(response.data); // Update state with fetched messages
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    
      
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return; // Don't send empty messages
    
        if (!selectedSenior || !selectedSenior.CaregiverID) {
            alert("Please select a senior and caregiver.");
            return;
        }
    
        const senderID = selectedSenior.SeniorID; // Sender is the selected senior
        const receiverID = selectedSenior.CaregiverID; // Receiver is the caregiver of the selected senior
    
        try {
            const response = await axios.post('http://localhost:5000/api/messages', {
                senderID: senderID,
                receiverID: receiverID,
                messageText: newMessage,
            });
            if (response.status === 201) {
                setMessages([...messages, { SenderID: senderID, ReceiverID: receiverID, MessageText: newMessage }]); // Add new message
                setNewMessage(''); // Clear message input
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };
    
    
    return (
        <div className="container mt-5">
        <h1 className="text-center mb-4 text-primary">Senior Dashboard</h1>

        <div className="row mb-4">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header">
                        <h4>Select Senior</h4>
                    </div>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by Name or Senior ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {filteredSeniors.map((senior) => (
                                <li
                                    key={senior.SeniorID}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleSelectSenior(senior)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {senior.SeniorID} - {senior.Name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
    <div className="card shadow-sm">
      <div className="card-header">
        <h4>Caregiver Details</h4>
      </div>
      <div className="card-body">
        {caregiver ? (
          <div>
            <p><strong>Name:</strong> {caregiver.Name}</p>
            <p><strong>Contact:</strong> {caregiver.ContactDetails}</p>
            <p><strong>Email:</strong> {caregiver.GmailID}</p>
          </div>
        ) : selectedSenior ? (
          <p>Loading caregiver details...</p>
        ) : (
          <p>Select a senior to view caregiver details.</p>
        )}
      </div>
    </div>
    {/* Message Component */}
    <div className="card shadow-sm">
  <div className="card-header">
    <h4>Messages</h4>
  </div>
  <div className="card-body">
    <div className="message-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.MessageID}
            className={`message-card ${msg.SenderID === selectedSenior.SeniorID ? 'sent' : 'received'}`}
          >
            {/* Sender Label */}
            <p className={`message-label ${msg.SenderID === selectedSenior.SeniorID ? 'sent-label' : 'received-label'}`}>
              {msg.SenderID === selectedSenior.SeniorID ? 'You' : 'Caregiver'}
            </p>
            <p><strong>{msg.SenderName}</strong></p>
            <p>{msg.MessageText}</p>
            <p className="text-muted">{new Date(msg.SentAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
    <form onSubmit={handleSendMessage}>
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

            {/* Activities and Progress */}
            <div className="card shadow-sm">
                <div className="card-header">
                    <h4>Activities</h4>
                </div>
                <div className="card-body">
                    <input
                        type="date"
                        className="form-control mb-4"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

        {/* Toggle Sections */}
        {[
            { title: 'Physical Activities', key: 'physical', data: physicalActivity, dateField: 'AssignedDate' },
            { title: 'Cognitive Tasks', key: 'cognitive', data: cognitiveActivity, dateField: 'AssignedDate' },
            { title: 'Social Interactions', key: 'social', data: socialActivity, dateField: 'InteractionDate' },
            { title: 'Progress Tracking', key: 'progress', data: progressData, dateField: 'Date' },
        ].map((section, index) => (
            <div key={index}>
                <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={() => toggleSection(section.key)}
                >
                    {section.title}
                </button>
                {showSections[section.key] && (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {Object.keys(section.data[0] || {}).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filterByDate(section.data, section.dateField).map((item, idx) => (
                                <tr key={idx}>
                                    {Object.entries(item).map(([key, value], i) => (
                                        <td key={i}>
                                            {key.toLowerCase().includes('date')
                                                ? new Date(value).toLocaleDateString()
                                                : value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filterByDate(section.data, section.dateField).length === 0 && (
                                <tr>
                                    <td colSpan="100%">No data found for the selected date.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
                    ))}
                </div>
            </div>
        </div>
);
};
export default SeniorDashboard;
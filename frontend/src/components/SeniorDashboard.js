import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SeniorDashboard.css';
import Footer from "./extra/Footer";
import { useNavigate } from 'react-router-dom';
import Navbar from "./extra/Navbar";

const SeniorDashboard = () => {
    // States to manage selected senior, activity types, and progress
    const [seniors, setSeniors] = useState([]);
    const [seniorID, setSeniorID] = useState('');
    const [physicalActivity, setPhysicalActivity] = useState([]);
    const [seniorDetails, setSeniorDetails] = useState(null);
    const [cognitiveActivity, setCognitiveActivity] = useState([]);
    const [caregiverID, setCaregiverID] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [caregiver, setCaregiver] = useState(null);
    const [socialActivity, setSocialActivity] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [seniorName, setSeniorName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();

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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/senior/login', {
                name: seniorName,
                seniorId: seniorID,
            });
            
            console.log(response.data); // Log the response to check if the structure is correct
    
            if (response.data.success && response.data.senior) {
                setIsAuthenticated(true);
                setSeniorID(response.data.senior.SeniorID);
                setSelectedSenior(response.data.senior);
                await fetchCaregiver(response.data.senior.CaregiverID);  // Fetch caregiver details
                await fetchActivities(response.data.senior.SeniorID);  // Fetch activities and progress
                await fetchMessages(response.data.senior.SeniorID, response.data.senior.CaregiverID); // Fetch messages
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed, please try again.');
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
    const fetchSeniors = async () => {
        try{
        const response = await axios.get('http://localhost:5000/api/seniors');
        setSeniors(response.data);
        } catch (error){
            console.error('Error fetching seniors:', error);
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

const filterByDate = (data, dateField) => {
    if (!selectedDate) return data;
    return data.filter(item => new Date(item[dateField]).toLocaleDateString() === new Date(selectedDate).toLocaleDateString());
};

const handleSelectSenior = async (senior) => {
    setSelectedSenior(senior);
    setCaregiver(null);
    await fetchCaregiver(senior.CaregiverID);
    await fetchActivities(senior.SeniorID);
    setCaregiverID(senior.CaregiverID);
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
        <div><Navbar />
<div className="container mt-5">
            {/* Senior Login Form */}
            {!isAuthenticated && (
                <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-container">
                    <div className="row w-100">
                        <div className="col-md-6 login-left d-none d-md-flex align-items-center justify-content-center"></div>
                        <div className="col-md-6">
                            <div className="login-form p-4">
                                <h2 className="text-center mb-4 text-primary">Senior Login</h2>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Senior Name"
                                            value={seniorName}
                                            onChange={(e) => setSeniorName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Senior ID"
                                            value={seniorID}
                                            onChange={(e) => setSeniorID(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button className="btn btn-primary w-100" type="submit">
                                        Login
                                    </button>
                                </form>
                                <div className="text-center mt-4">
            <button
              onClick={() => navigate('/Caregiver-dashboard')}
              className="btn btn-link text-muted"
            >
              Go to Caregiver Login
            </button></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Senior Dashboard */}
            {isAuthenticated && selectedSenior && (
                <>
                    <div className="row mb-4">
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
                                    ) : (
                                        <p>Loading caregiver details...</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="col-md-6">
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
                                                <div key={msg.MessageID} className={`message-card ${msg.SenderID === seniorID ? 'sent' : 'received'}`}>
                                                    <p className={`message-label ${msg.SenderID === seniorID ? 'sent-label' : 'received-label'}`}>
                                                        {msg.SenderID === seniorID ? 'You' : 'Caregiver'}
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
                                            <button className="btn btn-primary" type="submit">Send</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activities Section */}
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
                            {[{ title: 'Physical Activities', key: 'physical', data: physicalActivity },
                              { title: 'Cognitive Tasks', key: 'cognitive', data: cognitiveActivity },
                              { title: 'Social Interactions', key: 'social', data: socialActivity },
                              { title: 'Progress Tracking', key: 'progress', data: progressData }
                            ].map((section, index) => (
                                <div key={index}>
                                    <button
                                        className="btn btn-primary w-100 mb-3"
                                        onClick={() => setShowSections({ ...showSections, [section.key]: !showSections[section.key] })}
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
                                                {filterByDate(section.data, section.key === 'progress' ? 'Date' : 'AssignedDate').map((item, idx) => (
                                                    <tr key={idx}>
                                                        {Object.entries(item).map(([key, value], i) => (
                                                            <td key={i}>{key.toLowerCase().includes('date') ? new Date(value).toLocaleDateString() : value}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                                {filterByDate(section.data, section.key === 'progress' ? 'Date' : 'AssignedDate').length === 0 && (
                                                    <tr><td colSpan="100%">No data found for the selected date.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
        <Footer/>
         </div>
);
};
export default SeniorDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeniorDashboard = () => {
    // States to manage selected senior, activity types, and progress
    const [seniors, setSeniors] = useState([]);
    const [seniorID, setSeniorID] = useState(null);
    const [physicalActivity, setPhysicalActivity] = useState([]);
    const [seniorDetails, setSeniorDetails] = useState(null);
    const [cognitiveActivity, setCognitiveActivity] = useState([]);
    const [caregiverID, setCaregiverID] = useState('');
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [caregiver, setCaregiver] = useState(null);
    const [socialActivity, setSocialActivity] = useState([]);
    const [progress, setProgress] = useState(null);
    

    const [participationData, setParticipationData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchSeniors();
    },[]);

    const fetchCaregiver = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/caregiver/profile?caregiverID=${caregiverID}`);
          setCaregiver(response.data);
          fetchSeniors(response.data.CaregiverID);
        } catch (error) {
          console.error('Error fetching caregiver profile:', error);
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

const fetchPhysicalActivities = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/physical-activities`);
        console.log('Physical Activities:', response.data); // Log the response
        setPhysicalActivity(response.data);
    } catch (error) {
        console.error('Error fetching physical activities:', error);
    }
};

const fetchCognitiveTasks = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/senior/${seniorID}/cognitive-tasks`);
        console.log('Cognitive Tasks:', response.data); // Log the response
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
    const handleSelectSenior = (senior) => {
        setSelectedSenior(senior);
        fetchPhysicalActivities(senior.SeniorID);
        fetchCognitiveTasks(senior.SeniorID);
        fetchSocialInteractions(senior.SeniorID);
        fetchProgressTracking(senior.SeniorID);
    };

    
    return (
        <div>
            <h1>Senior Dashboard</h1>
            <h3>Seniors List</h3>
            <ul>
                {seniors.map((senior) => (
                    <li
                        key={senior.SeniorID}
                        onClick={() => handleSelectSenior(senior)}
                        style={{ cursor: 'pointer', margin: '10px 0', color: 'blue' }}
                    >
                        {senior.Name} - {senior.Age} years old
                    </li>
                ))}
            </ul>

            {selectedSenior && (
                <div>
                    <h2>Selected Senior Details</h2>
                    <p><strong>Name:</strong> {selectedSenior.Name}</p>
                    <p><strong>Age:</strong> {selectedSenior.Age}</p>
                    <p><strong>Gender:</strong> {selectedSenior.Gender}</p>
                    <p><strong>Contact Details:</strong> {selectedSenior.ContactDetails}</p>
                    <p><strong>Address:</strong> {selectedSenior.Address}</p>
                    <p><strong>Emergency Contact:</strong> {selectedSenior.EmergencyContact}</p>

                    <h3>Physical Activities</h3>
                    {physicalActivity.length > 0 ? (
                        <ul>
                            {physicalActivity.map((activity, index) => (
                                <li key={index}>
                                    <strong>Activity:</strong> {activity.PhysicalName} <br />
                                    <strong>Frequency:</strong> {activity.Frequency} <br />
                                    <strong>Duration:</strong> {activity.Duration} minutes
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No physical activities found.</p>
                    )}

<h3>Cognitive Tasks</h3>
                    {cognitiveActivity.length > 0 ? (
                        <ul>
                            {cognitiveActivity.map((task, index) => (
                                <li key={index}>
                                    <strong>Task Name:</strong> {task.TaskName} <br />
                                    <strong>Frequency:</strong> {task.Frequency} <br />
                                    <strong>Duration:</strong> {task.Duration} minutes
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No cognitive tasks found.</p>
                    )}

<h3>Social Interactions</h3>
{socialActivity.length > 0 ? (
    <ul>
        {socialActivity.map((interaction, index) => (
            <li key={index}>
                <strong>Type:</strong> {interaction.InteractionType} <br />
                <strong>Date:</strong> {new Date(interaction.InteractionDate).toLocaleDateString()} <br />
                <strong>Details:</strong> {interaction.Details}
            </li>
        ))}
    </ul>
) : (
    <p>No social interactions found.</p>
)}

<h3>Progress Tracking</h3>
                    {progressData.length > 0 ? (
                        <ul>
                            {progressData.map((item, index) => (
                                <li key={index}>
                                    <strong>Senior ID:</strong> {item.SeniorID} <br />
                                    <strong>Date:</strong> {new Date(item.Date).toLocaleDateString()} <br />
                                    <strong>Progress Status:</strong> {item.ProgressStatus} <br />
                                    <strong>Notes:</strong> {item.Notes} <br />
                                    <strong>Progress Score:</strong> {item.ProgressScore} <br />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No progress tracking found.</p>
                    )}


                </div>
            )}

        </div>
    );
};

export default SeniorDashboard;
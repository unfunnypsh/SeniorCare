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
const fetchParticipationData = async (seniorID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/activityparticipation?seniorID=${seniorID}`);
        setParticipationData(response.data);
    } catch (error) {
        console.error('Error fetching participation data:', error);
    }
};
const calculateScores = (data) => {
    const progressEntries = {};

    data.forEach(entry => {
        const date = entry.ParticipationDate.split('T')[0]; // Extract date from datetime

        if (!progressEntries[date]) {
            progressEntries[date] = { Score: 0, Notes: "", SeniorID: entry.SeniorID };
        }

        // Scoring based on participation
        if (entry.PhysicalActivityID) {
            // Assuming you have a way to determine the intensity of the physical activity
            // For example, you might fetch the activity details separately or have them in the participation data
            // Here, I'm just using a placeholder for intensity
            const intensity = 'High'; // Replace with actual logic to determine intensity

            if (intensity === 'High') {
                progressEntries[date].Score += 10;
            } else if (intensity === 'Moderate') {
                progressEntries[date].Score += 5;
            } else if (intensity === 'Low') {
                progressEntries[date].Score += 2;
            }
        }

        if (entry.CognitiveTaskID) {
            // Assuming cognitive tasks contribute a fixed score
            progressEntries[date].Score += 10; // Example scoring for cognitive tasks
        }

        progressEntries[date].Notes = "Data processed based on activity participation.";
    });

    return Object.entries(progressEntries).map(([date, data]) => ({
        Date: date,
        ...data
    }));
};

const saveProgressData = async (progress) => {
    try {
        await Promise.all(progress.map(async (entry) => {
            await axios.post('/api/progress', {
                SeniorID: entry.SeniorID,
                Date: entry.Date,
                ProgressStatus: entry.Score > 50 ? "Active" : "Needs Improvement",
                Notes: entry.Notes,
                Score: entry.Score
            });
        }));
        alert('Progress data saved successfully!');
    } catch (error) {
        console.error('Error saving progress data:', error);
    }
};

const handleProcessAndSave = async () => {
    if (selectedSenior) {
        await fetchParticipationData(selectedSenior.SeniorID); // Fetch participation data
        const scores = calculateScores(participationData); // Calculate scores
        setProgressData(scores); // Set progress data state
        await saveProgressData(scores); // Save progress data
    } else {
        alert('Please select a senior first.');
    }
};

    const fetchProgressTracking = (seniorId) => {
        axios.get(`http://localhost:5000/api/progress/${seniorId}/progress-tracking`)
            .then((response) => {
                setProgress(response.data);
            })
            .catch((error) => {
                console.error('Error fetching progress:', error);
            });
    };

    const handleSelectSenior = (senior) => {
        setSelectedSenior(senior);
        fetchPhysicalActivities(senior.SeniorID);
        fetchCognitiveTasks(senior.SeniorID);
        fetchSocialInteractions(senior.SeniorID);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchParticipationData();
            setLoading(false);
        };
        loadData();
    }, [seniorID]);
    
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
                </div>
            )}
<div>
                <h1>Senior Dashboard</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <button onClick={handleProcessAndSave}>Process and Save Progress</button>
                        <div>
                            <h2>Participation Data</h2>
                            <pre>{JSON.stringify(participationData, null, 2)}</pre>
                        </div>
                        <div>
                            <h2>Calculated Progress Data</h2>
                            <pre>{JSON.stringify(progressData, null, 2)}</pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SeniorDashboard;
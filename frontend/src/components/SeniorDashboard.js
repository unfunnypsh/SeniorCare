import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    
    const [report, setReport] = useState('');
    const [participationData, setParticipationData] = useState([]);
    const [progressData, setProgressData] = useState([]);

    // State variables for toggling sections
    const [showPhysicalActivities, setShowPhysicalActivities] = useState(false);
    const [showCognitiveTasks, setShowCognitiveTasks] = useState(false);
    const [showSocialInteractions, setShowSocialInteractions] = useState(false);
    const [showProgressTracking, setShowProgressTracking] = useState(false);

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



    const handleSelectSenior = (senior) => {
        setSelectedSenior(senior);
        fetchPhysicalActivities(senior.SeniorID);
        fetchCognitiveTasks(senior.SeniorID);
        fetchSocialInteractions(senior.SeniorID);
        fetchProgressTracking(senior.SeniorID);
        setSelectedSenior(senior);
    };

    
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Senior Dashboard</h1>
            <h3>Seniors List</h3>
            <ul className="list-group mb-4">
                {seniors.map((senior) => (
                    <li
                        key={senior.SeniorID}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectSenior(senior)}
                    >
                        {senior.Name} - {senior.Age} years old
                    </li>
                ))}
            </ul>

            {selectedSenior && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>Physical Activities</h3>
                        <button className="btn btn-info" onClick={() => setShowPhysicalActivities(!showPhysicalActivities)}>
                            {showPhysicalActivities ? 'Hide' : 'Show'} Physical Activities
                        </button>
                        {showPhysicalActivities && (
                            <table className="table table-bordered mt-3">
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Date</th>
                                        <th>Duration</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {physicalActivity.length > 0 ? (
                                        physicalActivity.map((activity, index) => (
                                            <tr key={index}>
                                                <td>{activity.PhysicalName}</td>
                                                <td>{new Date(activity.AssignedDate).toLocaleDateString()}</td>
                                                <td>{activity.Duration} minutes</td>
                                                <td>{activity.Completed ? 'Yes' : 'No'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No physical activities found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

      {/* Button for toggling cognitive tasks visibility */}
      <h3>Cognitive Tasks</h3>
      <button className="btn btn-info" onClick={() => setShowCognitiveTasks(!showCognitiveTasks)}>
        {showCognitiveTasks ? 'Hide' : 'Show'} Cognitive Tasks
      </button>

      {/* Show cognitive tasks if toggled on */}
      {showCognitiveTasks && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Date</th>
              <th>Duration (minutes)</th>
              <th>Completion Status</th>
              <th>Difficulty Level</th>
            </tr>
          </thead>
          <tbody>
            {cognitiveActivity.length > 0 ? (
              cognitiveActivity.map((task, index) => (
                <tr key={index}>
                  <td>{task.TaskName}</td>
                  <td>{new Date(task.AssignedDate).toLocaleDateString()}</td>
                  <td>{task.TimeSpent} minutes</td>
                  <td>{task.CompletionStatus === 1 ? 'Completed' : 'Incomplete'}</td>
                  <td>{task.DifficultyLevel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No cognitive tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

                        <h3>Social Interactions</h3>
                        <button className="btn btn-info" onClick={() => setShowSocialInteractions(!showSocialInteractions)}>
                            {showSocialInteractions ? 'Hide' : 'Show'} Social Interactions
                        </button>
                        {showSocialInteractions && (
                            <table className="table table-bordered mt-3">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {socialActivity.length > 0 ? (
                                        socialActivity.map((interaction, index) => (
                                            <tr key={index}>
                                                <td>{interaction.InteractionType}</td>
                                                <td>{new Date(interaction.InteractionDate).toLocaleDateString()}</td>
                                                <td>{interaction.Details}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No social interactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        <h3>Progress Tracking</h3>
                        <button className="btn btn-info" onClick={() => setShowProgressTracking(!showProgressTracking)}>
                            {showProgressTracking ? 'Hide' : 'Show'} Progress Tracking
                        </button>
                        {showProgressTracking && (
                            <table className="table table-bordered mt-3">
                                <thead>
                                    <tr>
                                        <th>Senior ID</th>
                                        <th>Date</th>
                                        <th>Progress Status</th>
                                        <th>Notes</th>
                                        <th>Progress Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {progressData.length > 0 ? (
                                        progressData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.SeniorID}</td>
                                                <td>{new Date(item.Date).toLocaleDateString()}</td>
                                                <td>{item.ProgressStatus}</td>
                                                <td>{item.Notes}</td>
                                                <td>{item.ProgressScore}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan ="5">No progress tracking found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeniorDashboard;
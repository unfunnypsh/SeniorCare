const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use your MySQL username
  password: 'harshith9902', // Use your MySQL password
  database: 'senior_care',
});

// Test MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the MySQL database.');
});


// API to fetch all seniors
app.get('/api/admin/reports', (req, res) => {
  const query = 'SELECT * FROM Seniors';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching seniors.');
      return;
    }
    res.json(results);
  });
});
app.get('/api/seniors', (req, res) => {
    const query = 'SELECT * FROM Seniors';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching seniors.');
        return;
      }
      res.json(results);
    });
  });

   
// API to fetch all caregivers
app.get('/api/caregivers', (req, res) => {
  const query = 'SELECT * FROM Caregivers';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching caregivers.');
      return;
    }
    res.json(results);
  });
});
// Fetch caregiver profile
app.get('/api/caregiver/profile', (req, res) => {
    const caregiverID = req.query.caregiverID;
    const query = 'SELECT * FROM Caregivers WHERE CaregiverID = ?';
    db.query(query, [caregiverID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching caregiver profile.');
        return;
      }
      res.json(results[0]);
    });
  });

  app.get('/api/senior/profile', (req, res) => {
    const seniorID = req.query.seniorID;
    const query = 'SELECT * FROM Seniors WHERE SeniorID = ?';
    db.query(query, [seniorID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching caregiver profile.');
        return;
      }
      res.json(results[0]);
    });
  });

// API to add a new senior
app.post('/api/admin/senior', (req, res) => {
  console.log('Incoming request body:', req.body);
  const { name, age, gender, contactDetails, address, emergencyContact, caregiverID,medicalHistory } = req.body;
  const query = `
    INSERT INTO Seniors (Name, Age, Gender, ContactDetails, Address, EmergencyContact, CaregiverID, MedicalHistory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, age, gender, contactDetails, address, emergencyContact, caregiverID,medicalHistory],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding senior.');
        return;
      }
      res.status(201).send('Senior added successfully.');
    }
  );
});

// API to add a new caregiver
app.post('/api/admin/caregiver', (req, res) => {
  const { name, contactDetails } = req.body;
  const query = 
    `INSERT INTO Caregivers (Name, ContactDetails)
    VALUES (?, ?)`;
  db.query(query, [name, contactDetails], (err, result) => {
    if (err) {
      console.error('Error inserting caregiver:', err);
      res.status(500).send('Error adding caregiver.');
      return;
    }
    res.status(201).send('Caregiver added successfully.');
  });
});


  
// Fetch caregiver assigned to a seniors
app.get('/api/seniors/:caregiverID', (req, res) => {
    const caregiverID = req.params.caregiverID;
    const query = 'SELECT * FROM Seniors WHERE CaregiverID = ?';
    db.query(query, [caregiverID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching assigned seniors.');
        return;
      }
      res.json(results);
    });
  });
  
  // Add social interaction
  app.post('/api/caregiver/social-interaction', (req, res) => {
    const { interactionType, interactionDate, details, seniorID } = req.body;
    const query = `
      INSERT INTO SocialInteractions (InteractionType, InteractionDate, Details, SeniorID)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [interactionType, interactionDate, details, seniorID], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding social interaction.');
        return;
      }
      res.status(201).send('Social interaction added successfully.');
    });
  });
  
  app.post('/api/caregiver/physical-activity', (req, res) => {
    const { physicalName, duration, intensity, assignedDate, seniorID, completedStatus } = req.body;
  
    if (!physicalName) {
      res.status(400).send('Physical Name is required.');
      return;
    }
  
    // Map completedStatus to 1 (true) or 0 (false)
    const completed = completedStatus ? 1 : 0;
  
    const query = `
      INSERT INTO PhysicalActivities (PhysicalName, SeniorID, Duration, AssignedDate, Intensity, Completed)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [physicalName, seniorID, duration, assignedDate, intensity, completed], (err) => {
      if (err) {
        console.error('Error adding physical activity:', err);
        res.status(500).send('Error adding physical activity.');
        return;
      }
      res.status(201).send('Physical activity added successfully.');
    });
  });
  

  
// Add cognitive task
app.post('/api/caregiver/cognitive-task', (req, res) => {
  const { taskName, assignedDate, completionStatus, seniorID, timeSpent, difficultyLevel } = req.body;

  // Validate DifficultyLevel
  const validDifficultyLevels = ['Easy', 'Medium', 'Hard'];
  if (!validDifficultyLevels.includes(difficultyLevel)) {
    return res.status(400).send('Invalid difficulty level. Must be one of Easy, Medium, or Hard.');
  }

  const query = `
    INSERT INTO CognitiveTasks (TaskName, AssignedDate, CompletionStatus, SeniorID, TimeSpent, DifficultyLevel)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [taskName, assignedDate, completionStatus, seniorID, timeSpent, difficultyLevel], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding cognitive task.');
      return;
    }
    res.status(201).send('Cognitive task added successfully.');
  });
});

  
// API to execute clean-up procedure
app.post('/api/clean-activity-participation', (req, res) => {
    // First, disable safe updates
    db.query('SET SQL_SAFE_UPDATES = 0;', (err, results) => {
        if (err) {
            console.error('Error disabling safe updates:', err);
            return res.status(500).send('Error disabling SQL_SAFE_UPDATES.');
        }

        // Now, call the stored procedure to clean the redundant activity participation
        db.query('CALL CleanRedundantActivityParticipation();', (err, results) => {
            if (err) {
                console.error('Error executing clean-up procedure:', err);
                return res.status(500).send('Error cleaning redundant activity participation.');
            }

            // Finally, re-enable safe updates
            db.query('SET SQL_SAFE_UPDATES = 1;', (err, results) => {
                if (err) {
                    console.error('Error re-enabling safe updates:', err);
                    return res.status(500).send('Error re-enabling SQL_SAFE_UPDATES.');
                }

                // Respond with success message
                res.status(200).send('Redundant activity participation cleaned successfully.');
            });
        });
    });
});

// API to fetch physical activities for a senior by ID
app.get('/api/senior/:seniorID/physical-activities', (req, res) => {
  const seniorID = req.params.seniorID;
  const query = 'SELECT PhysicalID, PhysicalName, SeniorID, Duration, AssignedDate, Intensity, Completed FROM PhysicalActivities WHERE SeniorID = ?';
  
  db.query(query, [seniorID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching physical activities.');
      return;
    }
    res.json(results);
  });
});

  
// API to fetch cognitive tasks for a senior by ID
app.get('/api/senior/:seniorID/cognitive-tasks', (req, res) => {
  const seniorID = req.params.seniorID;
  const query = 'SELECT TaskID, TaskName, AssignedDate, CompletionStatus, TimeSpent, DifficultyLevel FROM CognitiveTasks WHERE SeniorID = ?';
  
  db.query(query, [seniorID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching cognitive tasks.');
      return;
    }
    res.json(results);
  });
});

  
  // API to fetch social interactions for a senior by ID
  app.get('/api/senior/:seniorID/social-interactions', (req, res) => {
    const seniorID = req.params.seniorID;
    const query = 'SELECT * FROM SocialInteractions WHERE SeniorID = ?';
    db.query(query, [seniorID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching social interactions.');
        return;
      }
      res.json(results);
    });
  });
  
  // API to fetch progress tracking for a senior by ID
  app.get('/api/senior/:seniorID/progress-tracking', (req, res) => {
    const seniorID = req.params.seniorID;
    const query = 'SELECT * FROM ProgressTracking WHERE SeniorID = ?';
    db.query(query, [seniorID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching progress tracking.');
        return;
      }
      res.json(results);
    });
  });
  
  app.get('/api/activityparticipation', (req, res) => {
    const seniorID = req.query.seniorID;
    const query = 'SELECT * FROM ActivityParticipation WHERE SeniorID = ?';
    db.query(query, [seniorID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching participation data.');
        }
        res.json(results);
    });
});

app.post('/api/progress', (req, res) => {
    const { SeniorID, Date, ProgressStatus, Notes, Score } = req.body;
    const query = 'INSERT INTO ProgressTracking (SeniorID, Date, ProgressStatus, Notes, Score) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [SeniorID, Date, ProgressStatus, Notes, Score], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving progress data.');
        }
        res.status(201).send('Progress data saved successfully.');
    });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Admins WHERE username = ? AND password = ?'; // Adjust table name and fields as necessary
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error during login' });
        }
        if (results.length > 0) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
    });
});

// Caregiver login endpoint
app.post('/api/caregiver/login', (req, res) => {
    const { name, caregiverId } = req.body;
    const query = 'SELECT * FROM Caregivers WHERE name = ? AND caregiverId = ?'; // Adjust table name and fields as necessary
    db.query(query, [name, caregiverId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error during login' });
        }
        if (results.length > 0) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid caregiver credentials' });
        }
    });
});

app.post('/api/caregiver/insert-progress', (req, res) => {
  const query = 'CALL InsertProgressTracking()';

  db.query(query, (err) => {
    if (err) {
      console.error('Error executing stored procedure:', err);
      res.status(500).send('Failed to insert progress tracking data.');
    } else {
      res.status(200).send('Progress tracking data inserted successfully.');
    }
  });
});

// API to fetch all progress tracking data
app.get('/api/progress-tracking', (req, res) => {
  const query = 'SELECT * FROM ProgressTracking';
  db.query(query, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error fetching progress tracking data.');
      }
      res.json(results);
  });
});

// API to update notes in progress tracking
app.put('/api/progress-tracking/update', (req, res) => {
  const { progressID, seniorID, notes } = req.body;

  if (!progressID || !seniorID || notes === undefined) {
      return res.status(400).send('ProgressID, SeniorID, and Notes are required.');
  }

  const query = 'UPDATE ProgressTracking SET Notes = ? WHERE ProgressID = ? AND SeniorID = ?';
  db.query(query, [notes, progressID, seniorID], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating notes in progress tracking.');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('No matching progress tracking record found.');
      }
      res.status(200).send('Notes updated successfully.');
  });
});
app.post('/api/update-progress-status', (req, res) => {
  // First, disable safe updates
  db.query('SET SQL_SAFE_UPDATES = 0;', (err, results) => {
      if (err) {
          console.error('Error disabling safe updates:', err);
          return res.status(500).send('Error disabling SQL_SAFE_UPDATES.');
      }

      
      db.query('CALL  UpdateProgressStatus();', (err, results) => {
          if (err) {
              console.error('Error executing update progress :', err);
              return res.status(500).send('Error cleaning redundant activity participation.');
          }

          // Finally, re-enable safe updates
          db.query('SET SQL_SAFE_UPDATES = 1;', (err, results) => {
              if (err) {
                  console.error('Error re-enabling safe updates:', err);
                  return res.status(500).send('Error re-enabling SQL_SAFE_UPDATES.');
              }

              // Respond with success message
              res.status(200).send('updated progress status successfully.');
          });
      });
  });
});

// First API: Fetch data for a specific senior
app.get('/api/senior/:seniorID/report', (req, res) => {
  const seniorID = req.params.seniorID;

  const query = `
    SELECT 
      pa.ParticipationID,
      pa.ParticipationDate AS ActivityParticipationDate,
      p.PhysicalID,
      p.PhysicalName,
      p.Frequency,
      p.Duration,
      p.AssignedDate AS PhysicalAssignedDate,
      p.Intensity,
      ct.TaskID,
      ct.TaskName,
      ct.AssignedDate AS CognitiveAssignedDate,
      ct.CompletionStatus,
      si.InteractionID,
      si.InteractionType,
      si.InteractionDate,
      si.Details
    FROM 
      ActivityParticipation pa
    LEFT JOIN 
      PhysicalActivities p ON pa.PhysicalActivityID = p.PhysicalID AND pa.SeniorID = p.SeniorID
    LEFT JOIN 
      CognitiveTasks ct ON pa.CognitiveTaskID = ct.TaskID AND pa.SeniorID = ct.SeniorID
    LEFT JOIN 
      SocialInteractions si ON pa.SeniorID = si.SeniorID
    WHERE 
      pa.SeniorID = ?;
  `;

  db.query(query, [seniorID], async (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data.');
    }

    res.json(results); // Send the raw data as JSON response
  });
});

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
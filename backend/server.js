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
  const { name, age, gender, contactDetails, address, emergencyContact, caregiverID } = req.body;
  const query = `
    INSERT INTO Seniors (Name, Age, Gender, ContactDetails, Address, EmergencyContact, CaregiverID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, age, gender, contactDetails, address, emergencyContact, caregiverID],
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
  const query = `
    INSERT INTO Caregivers (Name, ContactDetails)
    VALUES (?, ?)
  `;
  db.query(query, [name, contactDetails], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding caregiver.');
      return;
    }
    res.status(201).send('Caregiver added successfully.');
  });
});



  
// Fetch seniors assigned to a caregiver
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
  
// Add physical activity
app.post('/api/caregiver/physical-activity', (req, res) => {
    const { physicalName, frequency, duration, intensity, assignedDate, seniorID } = req.body;
  
    if (!physicalName) {
      res.status(400).send('Physical Name is required.');
      return;
    }
  
    const query = `
      INSERT INTO PhysicalActivities (PhysicalName, SeniorID, Frequency, Duration, AssignedDate, Intensity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [physicalName, seniorID, frequency, duration, assignedDate, intensity], (err) => {
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
    const { taskName, assignedDate, completionStatus, seniorID } = req.body;
    const query = `
      INSERT INTO CognitiveTasks (TaskName, AssignedDate, CompletionStatus, SeniorID)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [taskName, assignedDate, completionStatus, seniorID], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding cognitive task.');
        return;
      }
      res.status(201).send('Cognitive task added successfully.');
    });
  });
  
  // API to call the CleanRedundantActivityParticipation stored procedure
// API to execute clean-up procedure (no restriction)
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
    const query = 'SELECT * FROM PhysicalActivities WHERE SeniorID = ?';
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
    const query = 'SELECT * FROM CognitiveTasks WHERE SeniorID = ?';
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
  


  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
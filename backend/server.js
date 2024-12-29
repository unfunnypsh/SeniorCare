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
    const { physicalName, frequency, duration, intensity, seniorID } = req.body;
    const query = `
      INSERT INTO PhysicalActivities (PhysicalName, Frequency, Duration, Intensity, SeniorID)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [physicalName, frequency, duration, intensity, seniorID], (err) => {
      if (err) {
        console.error(err);
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
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
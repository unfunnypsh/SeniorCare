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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

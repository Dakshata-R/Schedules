const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const startInfraServer = () => {
  const app = express();
  const port = 5000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/uploads', express.static('uploads'));

  // MySQL Connection
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sandhiya',
    database: 'infra_management',
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  // Multer Configuration for File Upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage });

  // Routes
  app.post('/api/save-basic', upload.single('image'), (req, res) => {
    const { uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons } = req.body;
    const imagePath = req.file ? req.file.path : '';

    const query = `
      INSERT INTO basic (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [uniqueId, venueName, location, priority, primaryPurpose, JSON.stringify(responsiblePersons), imagePath],
      (err, result) => {
        if (err) {
          console.error('Error saving basic data:', err);
          res.status(500).send('Error saving basic data');
          return;
        }
        res.status(200).send('Basic data saved successfully');
      }
    );
  });

  app.post('/api/save-venue-type', (req, res) => {
    const { capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType } = req.body;
  
    const query = `
      INSERT INTO venue_type (capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [capacity, floor, JSON.stringify(maintenanceFrequency), JSON.stringify(usageFrequency), JSON.stringify(accessibilityOptions), ventilationType],
      (err, result) => {
        if (err) {
          console.error('Error saving venue type data:', err);
          res.status(500).send('Error saving venue type data');
          return;
        }
        res.status(200).send('Venue type data saved successfully');
      }
    );
  });

  app.post('/api/save-facility', (req, res) => {
    const { roles, facilities, selectedFacilities } = req.body;
  
    const query = `
      INSERT INTO facility (roles, facilities, selectedFacilities)
      VALUES (?, ?, ?)
    `;
  
    infraDb.query(
      query,
      [JSON.stringify(roles), JSON.stringify(facilities), JSON.stringify(selectedFacilities)],
      (err, result) => {
        if (err) {
          console.error('Error saving facility data:', err);
          res.status(500).send('Error saving facility data');
          return;
        }
        res.status(200).send('Facility data saved successfully');
      }
    );
  });
  app.listen(port, () => {
    console.log(`Infra Server running on port ${port}`);
  });
};

module.exports = { startInfraServer };
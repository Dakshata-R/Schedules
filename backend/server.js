const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'student_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API to save student data
app.post('/api/save-student', (req, res) => {
  const {
    studentId, name, dob, age, bloodGroup, weight, height,
    fatherName, motherName, fatherOccupation, motherOccupation,
    profileImage, coverImage,
    school, department, schoolMedium, tenthMarks, tenthPercent,
    twelfthMarks, twelfthPercent, semesterGrade, uploadedFile
  } = req.body;

  // Insert into students table
  const studentSql = `
    INSERT INTO students (
      studentId, name, dob, age, bloodGroup, weight, height,
      fatherName, motherName, fatherOccupation, motherOccupation,
      profileImage, coverImage
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const studentValues = [
    studentId, name, dob, age, bloodGroup, weight, height,
    fatherName, motherName, fatherOccupation, motherOccupation,
    profileImage, coverImage
  ];

  db.query(studentSql, studentValues, (err, studentResult) => {
    if (err) {
      console.error('Error saving student data:', err);
      res.status(500).send('Error saving student data');
      return;
    }

    // Insert into academic_details table
    const academicSql = `
      INSERT INTO academic_details (
        studentId, school, department, schoolMedium, tenthMarks, tenthPercent,
        twelfthMarks, twelfthPercent, semesterGrade, documentPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const academicValues = [
      studentId, school, department, schoolMedium, tenthMarks, tenthPercent,
      twelfthMarks, twelfthPercent, semesterGrade, uploadedFile ? uploadedFile.name : null
    ];

    db.query(academicSql, academicValues, (err, academicResult) => {
      if (err) {
        console.error('Error saving academic data:', err);
        res.status(500).send('Error saving academic data');
        return;
      }

      res.status(200).send('Student and academic data saved successfully');
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
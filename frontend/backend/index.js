const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "sandhiya", // Replace with your MySQL password
  database: "student_management",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// API Endpoint to Save Student Data
app.post("/api/save-student", (req, res) => {
  const {
    studentId,
    name,
    dob,
    age,
    bloodGroup,
    weight,
    height,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    profileImage,
    coverImage,
    department,
    schoolMedium,
    tenthMarks,
    tenthPercent,
    twelfthMarks,
    twelfthPercent,
    semesterGrade,
    mobile1,
    mobile2,
    personalEmail,
    officialEmail,
    location,
    currentAddress,
    permanentAddress,
    disability,
    healthIssues,
    fitnessCertificate,
    additionalInfo,
    additionalDocuments,
  } = req.body;

  const query = `
    INSERT INTO students (
      studentId, name, dob, age, bloodGroup, weight, height, 
      fatherName, motherName, fatherOccupation, motherOccupation, 
      profileImage, coverImage, department, schoolMedium, 
      tenthMarks, tenthPercent, twelfthMarks, twelfthPercent, 
      semesterGrade, mobile1, mobile2, personalEmail, officialEmail, 
      location, currentAddress, permanentAddress, disability, 
      healthIssues, fitnessCertificate, additionalInfo, additionalDocuments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    studentId,
    name,
    dob,
    age,
    bloodGroup,
    weight,
    height,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    profileImage,
    coverImage,
    department,
    schoolMedium,
    tenthMarks,
    tenthPercent,
    twelfthMarks,
    twelfthPercent,
    semesterGrade,
    mobile1,
    mobile2,
    personalEmail,
    officialEmail,
    location,
    currentAddress,
    permanentAddress,
    disability,
    healthIssues,
    fitnessCertificate,
    additionalInfo,
    additionalDocuments,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error saving student data:", err);
      return res.status(500).json({ message: "Failed to save student data" });
    }
    console.log("Student data saved successfully:", result);
    res.status(200).json({ message: "Student data saved successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Red PDF icon
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AcademicDetails = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [department, setDepartment] = useState("");
  const [schoolMedium, setSchoolMedium] = useState("");
  const [tenthMarks, setTenthMarks] = useState("");
  const [tenthPercent, setTenthPercent] = useState("");
  const [twelfthMarks, setTwelfthMarks] = useState("");
  const [twelfthPercent, setTwelfthPercent] = useState("");
  const [semesterGrade, setSemesterGrade] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAddImage = () => {
    // Logic to handle adding another document
    setUploadedFile(null); // Reset the uploaded file
    alert("Add another document in the same format.");
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleSchoolMediumChange = (event) => {
    setSchoolMedium(event.target.value);
  };

  const engineeringDepartments = [
    "Artificial Intelligence and Data Science",
    "Computer Science and Engineering",
    "Mechanical Engineering",
    "Electrical and Electronics Engineering",
    "Civil Engineering",
    "Electronics and Communication Engineering",
    "Information Technology",
    "Chemical Engineering",
    "Biomedical Engineering",
    "Aerospace Engineering",
  ];

  const schoolMediumOptions = ["Tamil", "English", "Others"];

  return (
    <Box sx={{ width: "100%", padding: { xs: 1, sm: 3 } }}>
      <Grid container spacing={3}>
        {/* Left Side - Academic Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Academic Details
          </Typography>

          {/* School Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            School
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon />
                </InputAdornment>
              ),
              style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
            }}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Enter the name of the school you attended.
          </Typography>

          {/* 10th Marks Section */}
          <Grid container spacing={3}>
            <Grid item xs={7} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                10th Marks
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={tenthMarks}
                onChange={(e) => setTenthMarks(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
                }}
                placeholder="Marks"
              />
              <Typography variant="caption" display="block" gutterBottom>
                Enter the total marks obtained in the 10th grade.
              </Typography>
            </Grid>
            <Grid item xs={7} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Mark Percent
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={tenthPercent}
                onChange={(e) => setTenthPercent(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
                }}
                placeholder="Percent"
              />
              <Typography variant="caption" display="block" gutterBottom>
                Enter the percentage of marks obtained in the 10th grade.
              </Typography>
            </Grid>
          </Grid>

          {/* 12th Marks Section */}
          <Grid container spacing={3}>
            <Grid item xs={7} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                12th Marks
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={twelfthMarks}
                onChange={(e) => setTwelfthMarks(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
                }}
                placeholder="Marks"
              />
              <Typography variant="caption" display="block" gutterBottom>
                Enter the total marks obtained in the 12th grade.
              </Typography>
            </Grid>
            <Grid item xs={7} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Mark Percent
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={twelfthPercent}
                onChange={(e) => setTwelfthPercent(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
                }}
                placeholder="Percent"
              />
              <Typography variant="caption" display="block" gutterBottom>
                Enter the percentage of marks obtained in the 12th grade.
              </Typography>
            </Grid>
          </Grid>

          {/* School Medium Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            School medium
          </Typography>
          <Select
            fullWidth
            value={schoolMedium}
            onChange={handleSchoolMediumChange}
            displayEmpty
            margin="normal"
            sx={{ backgroundColor: "#f5f5f5", height: "40px" }} // Light grey background and reduced height
          >
            <MenuItem value="" disabled>
              Select School Medium
            </MenuItem>
            {schoolMediumOptions.map((medium) => (
              <MenuItem key={medium} value={medium}>
                {medium}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" display="block" gutterBottom>
            Select the medium of instruction used during your schooling.
          </Typography>

          {/* BIT Academics Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: "bold" }}>
            BIT Academics
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Department
          </Typography>
          <Select
            fullWidth
            value={department}
            onChange={handleDepartmentChange}
            displayEmpty
            margin="normal"
            sx={{ backgroundColor: "#f5f5f5", height: "40px" }} // Light grey background and reduced height
          >
            <MenuItem value="" disabled>
              Select Department
            </MenuItem>
            {engineeringDepartments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" display="block" gutterBottom>
            Select your engineering department from the list.
          </Typography>

          {/* Semester Wise Marks Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Semester wise marks
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={semesterGrade}
            onChange={(e) => setSemesterGrade(e.target.value)}
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#f5f5f5", height: "40px" }, // Light grey background and reduced height
            }}
            placeholder="Grade"
          />
          <Typography variant="caption" display="block" gutterBottom>
            Enter your grade for the current or most recent semester.
          </Typography>
        </Grid>

        {/* Right Side - Image Upload */}
        <Grid item xs={12} md={4}>
          {/* Add documents (req) Text */}
          <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Add documents (req)
          </Typography>

          {/* Image Upload Section */}
          <Box
            sx={{
              border: "1px dashed gray",
              textAlign: "center",
              padding: 2,
              marginTop: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center", // Center content horizontally
              width: { xs: "100%", sm: "80%" }, // Responsive width
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Red PDF Icon */}
            <PictureAsPdfIcon sx={{ fontSize: 50, color: "red" }} />

            {/* Green Upload Icon and "Upload pdf" Text */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Button
                component="label"
                sx={{ p: 0, minWidth: 0, display: "flex", alignItems: "center" }}
              >
                <CloudUploadIcon sx={{ fontSize: 30, color: "green", mr: 1 }} />
                <Typography variant="body1">Upload pdf</Typography>
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
            </Box>

            {/* Display Uploaded File Name */}
            {uploadedFile && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Uploaded: {uploadedFile.name}
              </Typography>
            )}
          </Box>

          {/* File Format Information (Below Container) */}
          <Typography variant="caption" display="block" mt={1} textAlign="center">
            File Format: pdf, Recommended Size: 600x600 (1:1)
          </Typography>
          <Typography variant="caption" display="block" textAlign="center">
            Upload required documents in PDF format.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcademicDetails;
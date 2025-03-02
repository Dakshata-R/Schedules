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

const Academic = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    school: "",
    tenthMarks: "",
    tenthPercent: "",
    twelfthMarks: "",
    twelfthPercent: "",
    schoolMedium: "",
    department: "",
    semesterGrade: "",
    uploadedFile: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    onUpdate({ [name]: value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, uploadedFile: file });
      onUpdate({ uploadedFile: file });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.school) newErrors.school = "School name is required";
    if (!formData.tenthMarks) newErrors.tenthMarks = "10th Marks are required";
    if (!formData.tenthPercent) newErrors.tenthPercent = "10th Percentage is required";
    if (!formData.twelfthMarks) newErrors.twelfthMarks = "12th Marks are required";
    if (!formData.twelfthPercent) newErrors.twelfthPercent = "12th Percentage is required";
    if (!formData.schoolMedium) newErrors.schoolMedium = "School medium is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.semesterGrade) newErrors.semesterGrade = "Semester grade is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate the form
    if (!validateForm()) {
      alert("Please fill out all required fields correctly.");
      return;
    }
  
    // Create a FormData object to send the data
    const formDataToSend = new FormData();
  
    // Append all form fields to the FormData object
    formDataToSend.append("school", formData.school);
    formDataToSend.append("tenth_marks", formData.tenthMarks);
    formDataToSend.append("tenth_percent", formData.tenthPercent);
    formDataToSend.append("twelfth_marks", formData.twelfthMarks);
    formDataToSend.append("twelfth_percent", formData.twelfthPercent);
    formDataToSend.append("school_medium", formData.schoolMedium);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("semester_grade", formData.semesterGrade);
  
    // Append the uploaded file (if it exists)
    if (formData.uploadedFile) {
      formDataToSend.append("file", formData.uploadedFile);
    } else {
      alert("Please upload a PDF file.");
      return;
    }
  
    try {
      // Send the data to the backend
      const response = await fetch("http://localhost:5000/api/academic", {
        method: "POST",
        body: formDataToSend,
        headers: {
            "Accept": "application/json"
        }
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
  
      // Handle successful submission
      console.log("Academic details and file uploaded successfully!");
      alert("Academic details and file uploaded successfully!");
  
      // Optionally, reset the form after successful submission
      setFormData({
        school: "",
        tenthMarks: "",
        tenthPercent: "",
        twelfthMarks: "",
        twelfthPercent: "",
        schoolMedium: "",
        department: "",
        semesterGrade: "",
        uploadedFile: null,
      });
      setErrors({});
    } catch (error) {
      // Handle errors
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    }
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
            name="school"
            value={formData.school}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon />
                </InputAdornment>
              ),
              style: { backgroundColor: "#f5f5f5", height: "40px" },
            }}
            error={!!errors.school}
            helperText={errors.school}
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
                name="tenthMarks"
                value={formData.tenthMarks}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" },
                }}
                placeholder="Marks"
                error={!!errors.tenthMarks}
                helperText={errors.tenthMarks}
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
                name="tenthPercent"
                value={formData.tenthPercent}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" },
                }}
                placeholder="Percent"
                error={!!errors.tenthPercent}
                helperText={errors.tenthPercent}
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
                name="twelfthMarks"
                value={formData.twelfthMarks}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" },
                }}
                placeholder="Marks"
                error={!!errors.twelfthMarks}
                helperText={errors.twelfthMarks}
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
                name="twelfthPercent"
                value={formData.twelfthPercent}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  style: { backgroundColor: "#f5f5f5", height: "40px" },
                }}
                placeholder="Percent"
                error={!!errors.twelfthPercent}
                helperText={errors.twelfthPercent}
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
            name="schoolMedium"
            value={formData.schoolMedium}
            onChange={handleChange}
            displayEmpty
            margin="normal"
            sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
            error={!!errors.schoolMedium}
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
            name="department"
            value={formData.department}
            onChange={handleChange}
            displayEmpty
            margin="normal"
            sx={{ backgroundColor: "#f5f5f5", height: "40px" }}
            error={!!errors.department}
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
            name="semesterGrade"
            value={formData.semesterGrade}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#f5f5f5", height: "40px" },
            }}
            placeholder="Grade"
            error={!!errors.semesterGrade}
            helperText={errors.semesterGrade}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Enter your grade for the current or most recent semester.
          </Typography>
        </Grid>

        {/* Right Side - PDF Upload */}
        <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
          {/* Add documents (req) Text */}
          <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Add documents (req)
          </Typography>

          {/* Grey Box Wrapper */}
          <Box
            sx={{
              width: "200px",
              height: "180px",
              borderRadius: "12px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              mt: 1,
              border: "1px dashed gray",
              flexDirection: "column",
            }}
          >
            {/* Red PDF Icon */}
            <PictureAsPdfIcon sx={{ fontSize: 50, color: "red" }} />

            {/* Upload Button */}
            <Typography variant="body2" color="gray" component="div" mt={1}>
              Upload a PDF document (max 600x600)
              <Box display="block" mt={1}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ backgroundColor: "green", color: "white" }}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload PDF
                  <input type="file" hidden onChange={handleFileUpload} accept="application/pdf" />
                </Button>
              </Box>
            </Typography>
          </Box>

          {/* Display Uploaded File Name */}
          {formData.uploadedFile && (
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Uploaded: {formData.uploadedFile.name}
            </Typography>
          )}

          {/* File Format Information */}
          <Typography variant="caption" display="block" mt={1} textAlign="center">
            File Format: PDF, Recommended Size: 600x600 (1:1)
          </Typography>
          <Typography variant="caption" display="block" textAlign="center">
            Upload required documents in PDF format.
          </Typography>
        </Grid>


      </Grid>

      {/* Save & Next Button */}
      <Button 
        variant="contained" 
        onClick={handleSubmit} 
        sx={{ 
            mt: 2, 
            backgroundColor: "green !important", 
            color: "white", 
            '&:hover': { backgroundColor: "darkgreen !important" } 
        }}
    >
        Save
    </Button>

    </Box>
  );
};

export default Academic;
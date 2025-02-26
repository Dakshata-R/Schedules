import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";

const Personal = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    dob: "",
    age: "",
    bloodGroup: "",
    weight: "",
    height: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    profileImage: null,
    coverImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") {
          setFormData({ ...formData, profileImage: file });
        } else {
          setFormData({ ...formData, coverImage: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student ID is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
    if (!formData.weight) newErrors.weight = "Weight is required";
    if (!formData.height) newErrors.height = "Height is required";
    if (!formData.fatherName) newErrors.fatherName = "Father's Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission
      console.log("Form Data:", formData);
    }
  };

  return (
    <Box sx={{ width: "100%", padding: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Personal Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* Student ID */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Student ID
          </Typography>
          <TextField
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Enter your Student ID"
            error={!!errors.studentId}
            helperText={errors.studentId}
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your unique student identification number.
          </Typography>

          {/* Name */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Name
          </Typography>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Enter your full name"
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your full name as per official records.
          </Typography>

          {/* Date of Birth */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Date of Birth
          </Typography>
          <TextField
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Enter your date of birth"
            error={!!errors.dob}
            helperText={errors.dob}
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your date of birth in the format DD/MM/YYYY.
          </Typography>

          {/* Age and Blood Group */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Age
              </Typography>
              <TextField
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                size="small"
                margin="none"
                placeholder="Enter your age"
                error={!!errors.age}
                helperText={errors.age}
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
              />
              <Typography variant="body2" color="textSecondary" mb={2}>
                Enter your current age in years.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Blood Group
              </Typography>
              <TextField
                select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                fullWidth
                size="small"
                margin="none"
                placeholder="Select your blood group"
                error={!!errors.bloodGroup}
                helperText={errors.bloodGroup}
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {["O +ve", "O -ve", "A +ve", "A -ve", "B +ve", "B -ve", "AB +ve", "AB -ve"].map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Select your blood group from the dropdown.
              </Typography>
            </Grid>
          </Grid>

          {/* Weight and Height */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Weight
              </Typography>
              <TextField
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                size="small"
                margin="none"
                placeholder="Enter your weight in kg"
                error={!!errors.weight}
                helperText={errors.weight}
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
              />
              <Typography variant="body2" color="textSecondary" mb={2}>
                Enter your weight in kilograms (kg).
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Height
              </Typography>
              <TextField
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                fullWidth
                size="small"
                margin="none"
                placeholder="Enter your height in cm"
                error={!!errors.height}
                helperText={errors.height}
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
              />
              <Typography variant="body2" color="textSecondary" mb={2}>
                Enter your height in centimeters (cm).
              </Typography>
            </Grid>
          </Grid>

          {/* Parent’s Occupation Section */}
          <Typography variant="h6" fontWeight="bold" mt={2} mb={2}>
            Parent’s Occupation
          </Typography>

          {/* Father Name */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Father Name
          </Typography>
          <TextField
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Enter your father's name"
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your father's full name.
          </Typography>

          {/* Father's Occupation */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Father's Occupation
          </Typography>
          <TextField
            select
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Select your father's occupation"
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          >
            {["Business man", "Engineer", "Doctor", "Teacher", "Other"].map((job) => (
              <MenuItem key={job} value={job}>
                {job}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Select your father's occupation from the dropdown.
          </Typography>

          {/* Mother Name */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Mother Name
          </Typography>
          <TextField
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Enter your mother's name"
            error={!!errors.motherName}
            helperText={errors.motherName}
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your mother's full name.
          </Typography>

          {/* Mother's Occupation */}
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Mother's Occupation
          </Typography>
          <TextField
            select
            name="motherOccupation"
            value={formData.motherOccupation}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="none"
            placeholder="Select your mother's occupation"
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon/>
                </InputAdornment>
              ),
            }}
          >
            {["House wife", "Engineer", "Doctor", "Teacher", "Other"].map((job) => (
              <MenuItem key={job} value={job}>
                {job}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Select your mother's occupation from the dropdown.
          </Typography>
        </Grid>

        {/* Profile Image Section */}
        <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Add Profile Image
          </Typography>
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
            }}
          >
            {formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
              />
            ) : (
              <Typography variant="body2" color="gray">
                Upload a cover image for your Image
                file format jpg,png (Recommended)
                0x600(1:1)
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mt: 1, backgroundColor: "green", color: "white" }}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                  <input type="file" hidden onChange={(e) => handleImageUpload(e, "profile")} accept="image/jpeg, image/png" />
                </Button>
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Personal;
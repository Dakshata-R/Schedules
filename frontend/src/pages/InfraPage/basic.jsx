import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  IconButton,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IoPersonOutline, IoLocationOutline } from "react-icons/io5"; // Import icons
import { LiaQuestionCircle } from "react-icons/lia"; // Import question mark icon
import CloseIcon from "@mui/icons-material/Close"; // Import close icon
import ImageUploadLabel from "../ImageUploadLabel"; // Import the updated ImageUploadLabel component

const Basic = ({ errors, setErrors, setBasicData }) => {
  const [responsiblePersons, setResponsiblePersons] = useState(["Lab Technician I"]);
  const [newPerson, setNewPerson] = useState("");
  const [localBasicData, setLocalBasicData] = useState({
    uniqueId: "SFB01",
    venueName: "Sunflower block-basement class-01",
    location: "Sunflower block",
    priority: "",
    primaryPurpose: "Trainings",
    responsiblePersons: ["Lab Technician I"],
    image: null, // Add image field to localBasicData
  });

  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      const updatedPersons = [...responsiblePersons, newPerson];
      setResponsiblePersons(updatedPersons);
      setLocalBasicData({ ...localBasicData, responsiblePersons: updatedPersons });
      setNewPerson("");
    }
  };

  const handleDeletePerson = (index) => {
    const updatedPersons = responsiblePersons.filter((_, i) => i !== index);
    setResponsiblePersons(updatedPersons);
    setLocalBasicData({ ...localBasicData, responsiblePersons: updatedPersons });
  };

  const avatarColors = ["#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0"]; // Different colors for avatars

  const handleChange = (field, value) => {
    setLocalBasicData({ ...localBasicData, [field]: value });
    setBasicData({ ...localBasicData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error when the field is updated
  };

  const handleImageChange = (file) => {
    setLocalBasicData({ ...localBasicData, image: file });
    setBasicData({ ...localBasicData, image: file });
    setErrors({ ...errors, image: "" });
  };
  
  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      {/* Header Section with Bulk Upload Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 5 }}>
        <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
          Basic Details
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ backgroundColor: "green", color: "white" }}
          >
            Bulk Upload
          </Button>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "Poppins, sans-serif", 
            fontWeight: "bold", 
            marginRight: "168px" // Adjusted marginRight to move the text 1 inch to the right
          }}
        >
          Add Venue Image
        </Typography>
      </Box>

      {/* Two-Column Layout */}
      <Grid container spacing={4}>
        {/* Left Column (Form Fields) */}
        <Grid item xs={12} md={8}>
          {/* Unique ID Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Unique ID
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Unique ID"
              value={localBasicData.uniqueId}
              onChange={(e) => handleChange("uniqueId", e.target.value)}
              error={!!errors.uniqueId}
              helperText={errors.uniqueId}
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <IoPersonOutline size={20} />
                  </Box>
                ),
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                    <LiaQuestionCircle size={20} />
                  </Box>
                ),
                sx: {
                  backgroundColor: "#f5f6fa", // Grey background
                  borderRadius: "8px", // Rounded corners
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }} // Increased width
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          {/* Venue Name Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Venue Name
            </Typography>
            <Select
              fullWidth
              variant="outlined"
              value={localBasicData.venueName}
              onChange={(e) => handleChange("venueName", e.target.value)}
              error={!!errors.venueName}
              sx={{
                width: "100%",
                marginTop: "10px",
                backgroundColor: "#f5f6fa", // Grey background
                borderRadius: "8px", // Rounded corners
              }}
            >
              <MenuItem value="AS Block">AS Block</MenuItem>
              <MenuItem value="IB Block">IB Block</MenuItem>
              <MenuItem value="Mechanical Block">Mechanical Block</MenuItem>
              <MenuItem value="Aero Block">Aero Block</MenuItem>
              <MenuItem value="Learning Center">Learning Center</MenuItem>
              <MenuItem value="Special Lab">Special Lab</MenuItem>
            </Select>
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          {/* Location Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Location
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location"
              value={localBasicData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <IoPersonOutline size={20} />
                  </Box>
                ),
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                    <IoLocationOutline size={20} />
                  </Box>
                ),
                sx: {
                  backgroundColor: "#f5f6fa", // Grey background
                  borderRadius: "8px", // Rounded corners
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }} // Increased width
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          {/* Priority Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Priority
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "High")}
                sx={{
                  color: localBasicData.priority === "High" ? "white" : "red",
                  borderColor: "red",
                  backgroundColor: localBasicData.priority === "High" ? "red" : "transparent",
                  "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.1)" },
                }}
              >
                High
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "Medium")}
                sx={{
                  color: localBasicData.priority === "Medium" ? "white" : "orange",
                  borderColor: "orange",
                  backgroundColor: localBasicData.priority === "Medium" ? "orange" : "transparent",
                  "&:hover": { borderColor: "orange", backgroundColor: "rgba(255, 165, 0, 0.1)" },
                }}
              >
                Medium
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "Low")}
                sx={{
                  color: localBasicData.priority === "Low" ? "white" : "green",
                  borderColor: "green",
                  backgroundColor: localBasicData.priority === "Low" ? "green" : "transparent",
                  "&:hover": { borderColor: "green", backgroundColor: "rgba(0, 128, 0, 0.1)" },
                }}
              >
                Low
              </Button>
            </Box>
            {errors.priority && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
                {errors.priority}
              </Typography>
            )}
          </Box>

          {/* Primary Purpose Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Primary Purpose
            </Typography>
            <Select
              fullWidth
              variant="outlined"
              value={localBasicData.primaryPurpose}
              onChange={(e) => handleChange("primaryPurpose", e.target.value)}
              error={!!errors.primaryPurpose}
              sx={{
                width: "100%",
                marginTop: "10px",
                backgroundColor: "#f5f6fa", // Grey background
                borderRadius: "8px", // Rounded corners
              }}
            >
              <MenuItem value="Self Learning">Self Learning</MenuItem>
              <MenuItem value="Training">Training</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Lunch">Lunch</MenuItem>
            </Select>
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          {/* Responsible Person Section */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Responsible Person
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "10px" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Responsible Person"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                      <IoPersonOutline size={20} />
                    </Box>
                  ),
                  endAdornment: (
                    <Button
                      variant="text"
                      onClick={handleAddPerson}
                      sx={{ textTransform: "none", color: "gray" }}
                    >
                      Add
                    </Button>
                  ),
                  sx: {
                    backgroundColor: "#f5f6fa", // Grey background
                    borderRadius: "8px", // Rounded corners
                  },
                }}
                sx={{ width: "100%" }} // Increased width
              />
            </Box>
            {/* Display Avatars with Close Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: "10px" }}>
              {responsiblePersons.slice(0, 2).map((person, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    sx={{
                      backgroundColor: avatarColors[index % avatarColors.length],
                      cursor: "pointer",
                      width: 40,
                      height: 40,
                    }}
                    onClick={() => alert(person)} // Display name on click
                  >
                    {person.charAt(0)}
                  </Avatar>

                  {/* Close Icon in a Small Circle at Bottom-Right */}
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      backgroundColor: "red",
                      color: "white",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    onClick={() => handleDeletePerson(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {responsiblePersons.length > 2 && (
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <Avatar
                    sx={{
                      backgroundColor: "lightpink",
                      cursor: "pointer",
                      width: 40,
                      height: 40,
                    }}
                  >
                    +{responsiblePersons.length - 2}
                  </Avatar>

                  {/* Close Icon in a Small Circle at Bottom-Right */}
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      backgroundColor: "red",
                      color: "white",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    onClick={() => handleDeletePerson(2)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            {errors.responsiblePersons && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
                {errors.responsiblePersons}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Right Column (Add Venue Image) */}
        <Grid item xs={12} md={4}>
          <Box sx={{ marginBottom: "10px" }}>
            {/* Replace the existing image upload section with the ImageUploadLabel component */}
            <ImageUploadLabel
              onFileChange={handleImageChange}
              error={!!errors.image}
              helperText={errors.image}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Basic;
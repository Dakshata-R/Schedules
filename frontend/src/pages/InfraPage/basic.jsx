import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import { IoPersonOutline, IoLocationOutline } from "react-icons/io5";
import { LiaQuestionCircle } from "react-icons/lia";
import CloseIcon from "@mui/icons-material/Close";

const Basic = ({ errors, setErrors, setBasicData, basicData }) => {
  const [newPerson, setNewPerson] = useState("");
  const [accessibilityOptions, setAccessibilityOptions] = useState(
    basicData?.responsiblePersons || []
  );

  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      const updatedPersons = [...accessibilityOptions, newPerson];
      setAccessibilityOptions(updatedPersons);
      setBasicData(prev => ({
        ...prev,
        responsiblePersons: updatedPersons,
      }));
      setNewPerson("");
      setErrors(prev => ({ ...prev, responsiblePersons: "" }));
    }
  };

  const handleDeletePerson = (index) => {
    const updatedPersons = accessibilityOptions.filter((_, i) => i !== index);
    setAccessibilityOptions(updatedPersons);
    setBasicData(prev => ({
      ...prev,
      responsiblePersons: updatedPersons,
    }));
  };

  const avatarColors = ["#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0"];

  const handleChange = (field, value) => {
    setBasicData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 5 }}>
        <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
          Basic Details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Unique ID
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Unique ID"
              value={basicData.uniqueId || ""}
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
                  backgroundColor: "#f5f6fa",
                  borderRadius: "8px",
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }}
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Venue Name
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Venue Name"
              value={basicData.venueName || ""}
              onChange={(e) => handleChange("venueName", e.target.value)}
              error={!!errors.venueName}
              helperText={errors.venueName}
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <IoPersonOutline size={20} />
                  </Box>
                ),
                sx: {
                  backgroundColor: "#f5f6fa",
                  borderRadius: "8px",
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }}
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Venue Type
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Location"
              value={basicData.location || ""}
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
                  backgroundColor: "#f5f6fa",
                  borderRadius: "8px",
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }}
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Priority
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "High")}
                sx={{
                  color: basicData?.priority === "High" ? "white" : "red",
                  borderColor: "red",
                  backgroundColor: basicData?.priority === "High" ? "red" : "transparent",
                  "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.1)" },
                }}
              >
                High
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "Medium")}
                sx={{
                  color: basicData?.priority === "Medium" ? "white" : "orange",
                  borderColor: "orange",
                  backgroundColor: basicData?.priority === "Medium" ? "orange" : "transparent",
                  "&:hover": { borderColor: "orange", backgroundColor: "rgba(255, 165, 0, 0.1)" },
                }}
              >
                Medium
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChange("priority", "Low")}
                sx={{
                  color: basicData?.priority === "Low" ? "white" : "green",
                  borderColor: "green",
                  backgroundColor: basicData?.priority === "Low" ? "green" : "transparent",
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

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
              Primary Purpose
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Primary Purpose"
              value={basicData.primaryPurpose || ""}
              onChange={(e) => handleChange("primaryPurpose", e.target.value)}
              error={!!errors.primaryPurpose}
              helperText={errors.primaryPurpose}
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <IoPersonOutline size={20} />
                  </Box>
                ),
                sx: {
                  backgroundColor: "#f5f6fa",
                  borderRadius: "8px",
                },
              }}
              sx={{ width: "100%", marginTop: "10px" }}
            />
            <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "gray", marginTop: "5px" }}>
              Description text
            </Typography>
          </Box>

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
                    backgroundColor: "#f5f6fa",
                    borderRadius: "8px",
                  },
                }}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: "10px" }}>
              {accessibilityOptions.slice(0, 2).map((person, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: avatarColors[index % avatarColors.length],
                      cursor: "pointer",
                      width: 40,
                      height: 40,
                    }}
                    onClick={() => alert(person)}
                  >
                    {person.charAt(0)}
                  </Avatar>

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
              {accessibilityOptions.length > 2 && (
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <Avatar
                    sx={{
                      backgroundColor: "lightpink",
                      cursor: "pointer",
                      width: 40,
                      height: 40,
                    }}
                  >
                    +{accessibilityOptions.length - 2}
                  </Avatar>

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
      </Grid>
    </Box>
  );
};

export default Basic;
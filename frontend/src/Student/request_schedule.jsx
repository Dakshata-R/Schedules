import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import AddSkillDialog from "./addSkill";

const RequestSchedule = ({ onCancel, onSave }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Retrieve the logged-in email from local storage
  const loggedInEmail = localStorage.getItem("email");

  // Debugging: Log the email to verify it's being retrieved correctly
  console.log("Logged-in email:", loggedInEmail);

  // Fetch the user's name, roll number, and department based on their email
  useEffect(() => {
    const fetchUserData = async () => {
      if (!loggedInEmail) {
        console.error("No logged-in email provided.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/user-data?email=${loggedInEmail}`
        );
        if (response.data) {
          setName(response.data.name || ""); // Fallback to empty string
          setRollNumber(response.data.rollNumber || ""); // Fallback to empty string
          setDepartment(response.data.department || ""); // Fallback to empty string
        } else {
          console.error("User data not found in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [loggedInEmail]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleAddSelectedSkills = (selectedSkills) => {
    setSkills((prevSkills) => [
      ...prevSkills,
      ...selectedSkills.filter((skill) => !prevSkills.includes(skill)),
    ]);
    setIsAddSkillDialogOpen(false);
  };

  const handleMakeRequest = async () => {
    if (!loggedInEmail) {
      console.error("No logged-in email provided.");
      return;
    }

    // Validate that priority is selected
    if (!priority) {
      alert("Please select a priority.");
      return;
    }

    const requestData = {
      name,
      rollNumber,
      department,
      priority,
      skills,
      email: loggedInEmail, // Include the logged-in email in the request data
    };

    try {
      const response = await axios.post("http://localhost:5000/api/requests", requestData);
      console.log("Request created:", response.data);
      setSnackbarOpen(true); // Show success message
      if (typeof onSave === "function") {
        onSave(); // Call onSave if it's a function
      }
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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

  return (
    <Box sx={{ padding: 3 }}>
      {/* Top Right Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "green", color: "white" }}
          onClick={handleMakeRequest}
        >
          Make Request
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Make Request
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name} // Bind to name state
          InputProps={{
            readOnly: true, // Make the field read-only
          }}
        />
      </Box>

      {/* Roll Number Input Field */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Roll Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={rollNumber} // Bind to rollNumber state
          InputProps={{
            readOnly: true, // Make the field read-only
          }}
        />
      </Box>

      {/* Department Input Field */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Department"
          variant="outlined"
          fullWidth
          margin="normal"
          value={department} // Bind to department state
          InputProps={{
            readOnly: true, // Make the field read-only
          }}
        />
      </Box>

      {/* Priority Selection */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          Set Priority
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Chip
            label="High"
            onClick={() => setPriority("High")}
            sx={{
              backgroundColor: priority === "High" ? "red" : "transparent",
              color: priority === "High" ? "white" : "red",
              border: "1px solid red",
              "&:hover": {
                backgroundColor: "red",
                color: "white",
              },
            }}
          />
          <Chip
            label="Medium"
            onClick={() => setPriority("Medium")}
            sx={{
              backgroundColor: priority === "Medium" ? "orange" : "transparent",
              color: priority === "Medium" ? "white" : "orange",
              border: "1px solid orange",
              "&:hover": {
                backgroundColor: "orange",
                color: "white",
              },
            }}
          />
          <Chip
            label="Low"
            onClick={() => setPriority("Low")}
            sx={{
              backgroundColor: priority === "Low" ? "green" : "transparent",
              color: priority === "Low" ? "white" : "green",
              border: "1px solid green",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Skills Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Requesting Skill
        </Typography>

        {/* Add Skill Input with Button Inside */}
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
          <TextField
            label="Add Skill"
            variant="outlined"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            fullWidth
            margin="normal"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: "1px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={() => setIsAddSkillDialogOpen(true)}
                    sx={{
                      backgroundColor: "#e0e0e0",
                      color: "black",
                      textTransform: "none",
                      padding: "6px 35px",
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: "#bdbdbd",
                      },
                    }}
                  >
                    Add Skill
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Display Selected Skills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}>
          {skills.map((skill, index) => (
            <Chip
              sx={{
                backgroundColor: "#ecfdf5",
                color: "#059669",
                borderRadius: "20px",
              }}
              key={index}
              label={skill}
              onDelete={() =>
                setSkills(skills.filter((existingSkill) => existingSkill !== skill))
              }
            />
          ))}
        </Box>
      </Box>

      {/* AddSkill Dialog */}
      <AddSkillDialog
        open={isAddSkillDialogOpen}
        onClose={() => setIsAddSkillDialogOpen(false)}
        onAddSkill={handleAddSelectedSkills}
      />

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Auto-close after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position at top-right
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Request sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestSchedule;
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddSkillDialog from "./addSkill";
import axios from 'axios';

const RequestSchedule = ({ open, handleClose }) => {
  const [priority, setPriority] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    rollNumber: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the logged-in user's email from storage
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!open || !userEmail) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:8000/api/students?email=${encodeURIComponent(userEmail)}`);
        
        if (response.data) {
          setUserDetails({
            name: response.data.first_name || '', // Changed from response.data.name
            rollNumber: response.data.rollNumber || '',
            department: response.data.department || ''
          });
        } else {
          setError('Student data not found');
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.error || 'Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, [open, userEmail]);
  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleMakeRequest = () => {
    if (!priority) {
      setError('Please select a priority');
      return;
    }
    
    // Here you would typically send the request to your backend
    console.log('Submitting request with:', {
      ...userDetails,
      priority,
      skills
    });
    
    setSnackbarOpen(true);
    handleClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddSelectedSkills = (selectedSkills) => {
    setSkills(prevSkills => [
      ...prevSkills,
      ...selectedSkills.filter(skill => !prevSkills.includes(skill))
    ]);
    setIsAddSkillDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Request Schedule</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <>
                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userDetails.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    label="Roll Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userDetails.rollNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    label="Department"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userDetails.department}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </>
            )}

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

            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Requesting Skill
              </Typography>
              <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                <TextField
                  label="Add Skill"
                  variant="outlined"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={() => setIsAddSkillDialogOpen(true)}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    color: "black",
                    textTransform: "none",
                    padding: "6px 16px",
                  }}
                >
                  Add Skill
                </Button>
              </Box>

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
                    onDelete={() => handleRemoveSkill(skill)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleMakeRequest}
            disabled={loading || error}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}
      <AddSkillDialog
        open={isAddSkillDialogOpen}
        onClose={() => setIsAddSkillDialogOpen(false)}
        onAddSkill={handleAddSelectedSkills}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Request sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RequestSchedule;
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

  // Get the logged-in user's email from localStorage
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    console.log('Component mounted with open:', open, 'userEmail:', userEmail);
    
    const fetchUserDetails = async () => {
      if (!open || !userEmail) {
        console.log('Skipping fetch - dialog not open or no email');
        return;
      }

      console.log('Starting fetch for email:', userEmail);
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:8000/api/students`, {
          params: { email: userEmail }
        });

        console.log('API Response:', {
          status: response.status,
          data: response.data,
          config: response.config
        });

        if (response.data) {
          const newDetails = {
            name: response.data.first_name || 'Not available',
            rollNumber: response.data.rollNumber || 'Not available',
            department: response.data.department || 'Not available'
          };
          console.log('Setting user details:', newDetails);
          setUserDetails(newDetails);
        } else {
          console.warn('Empty response received');
          setError('Student data not found');
        }
      } catch (err) {
        console.error("Fetch error:", {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setError(err.response?.data?.error || 'Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [open, userEmail]);

  // Debug: Monitor state changes
  useEffect(() => {
    console.log('Current state:', {
      userDetails,
      loading,
      error,
      skills,
      priority
    });
  }, [userDetails, loading, error, skills, priority]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleMakeRequest = async () => {
    if (!priority) {
      setError('Please select a priority');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:8000/api/requests', {
        student_email: userEmail,
        student_name: userDetails.name,
        roll_number: userDetails.rollNumber,
        department: userDetails.department,
        priority,
        skills
      });
  
      console.log('Request submitted:', response.data);
      setSnackbarOpen(true);
      handleClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
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
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography component="span" sx={{ 
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'primary.main'
          }}>
            Request Schedule
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ padding: 2 }}>
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: 200
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
                <Button 
                  size="small" 
                  onClick={() => window.location.reload()}
                  sx={{ ml: 2 }}
                >
                  Retry
                </Button>
              </Alert>
            ) : (
              <>
                <Box sx={{ marginBottom: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Student Information
                  </Typography>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userDetails.name}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Roll Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userDetails.rollNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ mb: 2 }}
                  />
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

                <Box sx={{ marginBottom: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Set Priority
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    {['High', 'Medium', 'Low'].map((level) => (
                      <Chip
                        key={level}
                        label={level}
                        onClick={() => setPriority(level)}
                        sx={{
                          px: 3,
                          backgroundColor: priority === level ? 
                            level === 'High' ? 'error.main' : 
                            level === 'Medium' ? 'warning.main' : 'success.main' 
                            : 'action.selected',
                          color: priority === level ? 'common.white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: 
                              level === 'High' ? 'error.dark' : 
                              level === 'Medium' ? 'warning.dark' : 'success.dark',
                            color: 'common.white'
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ marginBottom: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Requesting Skills
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                    <TextField
                      label="Add Skill"
                      variant="outlined"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      fullWidth
                      size="small"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setIsAddSkillDialogOpen(true)}
                      sx={{
                        textTransform: "none",
                        minWidth: 120
                      }}
                    >
                      Browse Skills
                    </Button>
                  </Box>
                  
                  {skills.length > 0 ? (
                    <Box sx={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: 1,
                      p: 1,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}>
                      {skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleRemoveSkill(skill)}
                          sx={{
                            backgroundColor: 'success.light',
                            color: 'success.dark',
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleMakeRequest}
            disabled={loading || error || !priority}
            sx={{ px: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      <AddSkillDialog
        open={isAddSkillDialogOpen}
        onClose={() => setIsAddSkillDialogOpen(false)}
        onAddSkill={handleAddSelectedSkills}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: "100%" }}
        >
          Schedule request submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RequestSchedule;
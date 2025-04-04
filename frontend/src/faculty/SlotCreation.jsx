import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Checkbox, List, ListItem, 
  ListItemText, Alert, CircularProgress
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const SlotCreation = ({ onClose, selectedStudents = [] }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    startDate: null,
    endDate: null,
    fromTime: null,
    toTime: null,
    location: '',
    priority: '',
    studentEmails: []
  });
  const [students, setStudents] = useState([]);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initialize with pre-selected students if provided
    if (selectedStudents.length > 0) {
      setFormData(prev => ({
        ...prev,
        studentEmails: [...selectedStudents]
      }));
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again.');
      }
    };
    
    fetchStudents();
  }, [selectedStudents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleStudentSelect = (email) => {
    setFormData(prev => {
      const studentEmails = [...prev.studentEmails];
      const index = studentEmails.indexOf(email);
      
      if (index === -1) {
        studentEmails.push(email);
      } else {
        studentEmails.splice(index, 1);
      }
      
      return { ...prev, studentEmails };
    });
  };

  const validateForm = () => {
    if (!formData.skillName.trim()) {
      setError('Skill name is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date');
      return false;
    }
    if (!formData.fromTime) {
      setError('Start time is required');
      return false;
    }
    if (!formData.toTime) {
      setError('End time is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.priority) {
      setError('Please select a priority level');
      return false;
    }
    if (formData.studentEmails.length === 0) {
      setError('Please select at least one student');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const loggedInEmail = localStorage.getItem('email');
      if (!loggedInEmail) {
        throw new Error('User not authenticated');
      }

      const { skillName, startDate, endDate, fromTime, toTime, location, priority, studentEmails } = formData;
      
      // Combine date and time
      const startDateTime = new Date(startDate);
      startDateTime.setHours(fromTime.getHours(), fromTime.getMinutes());
      
      const endDateTime = new Date(endDate);
      endDateTime.setHours(toTime.getHours(), toTime.getMinutes());
      
      const response = await axios.post('http://localhost:5000/api/schedules', {
        facultyEmail: loggedInEmail,
        skillName,
        startDate: startDateTime,
        endDate: endDateTime,
        location,
        priority,
        studentEmails: studentEmails
      });
      
      console.log('Schedule created:', response.data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.response?.data?.message || 'Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Create New Schedule
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Schedule created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Skill Name" 
                name="skillName" 
                value={formData.skillName} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker 
                label="Start Date" 
                value={formData.startDate} 
                onChange={handleDateChange('startDate')} 
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth required />} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker 
                label="From Time" 
                value={formData.fromTime} 
                onChange={handleDateChange('fromTime')} 
                renderInput={(params) => <TextField {...params} fullWidth required />} 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker 
                label="End Date" 
                value={formData.endDate} 
                onChange={handleDateChange('endDate')} 
                minDate={formData.startDate || new Date()}
                renderInput={(params) => <TextField {...params} fullWidth required />} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker 
                label="To Time" 
                value={formData.toTime} 
                onChange={handleDateChange('toTime')} 
                minTime={formData.fromTime}
                renderInput={(params) => <TextField {...params} fullWidth required />} 
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Priority:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['High', 'Medium', 'Low'].map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    color={
                      option === 'High' ? 'error' : 
                      option === 'Medium' ? 'warning' : 'success'
                    }
                    variant={formData.priority === option ? 'filled' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, priority: option }))}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Selected Students:</Typography>
                {formData.studentEmails.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {formData.studentEmails.map(email => {
                      const student = students.find(s => s.email === email);
                      return (
                        <Chip
                          key={email}
                          label={student ? student.name : email}
                          onDelete={() => handleStudentSelect(email)}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No students selected
                  </Typography>
                )}
              </Box>
              
              <Button 
                variant="outlined" 
                onClick={() => setOpenStudentDialog(true)}
              >
                {selectedStudents.length > 0 ? 'Modify Selection' : 'Select Students'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Creating...' : 'Create Schedule'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Student Selection Dialog */}
      <Dialog 
        open={openStudentDialog} 
        onClose={() => setOpenStudentDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Select Students</DialogTitle>
        <DialogContent>
          <List>
            {students.map((student) => (
              <ListItem key={student.email}>
                <Checkbox
                  checked={formData.studentEmails.includes(student.email)}
                  onChange={() => handleStudentSelect(student.email)}
                />
                <ListItemText 
                  primary={student.name} 
                  secondary={`${student.department} • ${student.email}`} 
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentDialog(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default SlotCreation;
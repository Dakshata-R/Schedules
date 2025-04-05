import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Grid, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Checkbox, List, ListItem, 
  ListItemText, Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import Add_Faculty_popup from '../components/schedules_template/Add_Faculty_popup';

const SlotCreation = ({ onClose, selectedStudents = [], students = [], requestId = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    facultyIncharge: '',
    startDate: null,
    endDate: null,
    fromTime: null,
    toTime: null,
    location: '',
    priority: '',
    studentEmails: [...selectedStudents]
  });

  const [openFacultyDialog, setOpenFacultyDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);

  const handleFacultySelect = (selectedFaculties) => {
    if (selectedFaculties.length > 0) {
      setFormData(prev => ({
        ...prev,
        facultyIncharge: selectedFaculties[0].name
      }));
    }
    setOpenFacultyDialog(false);
  };

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
    if (!formData.facultyIncharge.trim()) {
      setError('Faculty incharge is required');
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
      const formattedData = {
        skillName: formData.skillName,
        facultyIncharge: formData.facultyIncharge,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        fromTime: formData.fromTime.toLocaleTimeString('en-US', { hour12: false }),
        toTime: formData.toTime.toLocaleTimeString('en-US', { hour12: false }),
        location: formData.location,
        priority: formData.priority,
        studentEmails: formData.studentEmails
      };

      if (requestId) {
        // Approving a request
        await axios.put(
          `http://localhost:8000/api/requests/${requestId}/approve`,
          formattedData
        );
        setSuccess('Request approved and slot created!');
      } else {
        // Regular slot creation
        await axios.post('http://localhost:8000/api/slots', formattedData);
        setSuccess('Slot created successfully!');
      }

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {requestId ? 'Approve Request and Create Schedule' : 'Create New Schedule'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
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

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Faculty Incharge" 
                name="facultyIncharge" 
                value={formData.facultyIncharge} 
                onChange={handleChange} 
                required 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setOpenFacultyDialog(true)}
                        sx={{ 
                          backgroundColor: 'lightgray',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: 'darkgray'
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                  {loading ? (requestId ? 'Approving...' : 'Creating...') : (requestId ? 'Approve Request' : 'Create Schedule')}
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

      {/* Faculty Selection Dialog */}
      <Add_Faculty_popup 
        open={openFacultyDialog} 
        onClose={handleFacultySelect}
      />
    </LocalizationProvider>
  );
};

export default SlotCreation;
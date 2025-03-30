import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' }
];

const SlotCreation = () => {
  const [formData, setFormData] = useState({
    skillName: '',
    facultyIncharge: '',
    startDate: null,
    endDate: null,
    fromTime: null,
    toTime: null,
    location: '',
    priority: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handlePriorityChange = (value) => {
    setFormData(prev => ({ ...prev, priority: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Box elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Create New Slot
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Skill Name" name="skillName" value={formData.skillName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Faculty Incharge" name="facultyIncharge" value={formData.facultyIncharge} onChange={handleChange} required />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} md={6}>
              <DatePicker label="Start Date" value={formData.startDate} onChange={handleDateChange('startDate')} renderInput={(params) => <TextField {...params} fullWidth required />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker label="End Date" value={formData.endDate} onChange={handleDateChange('endDate')} minDate={formData.startDate} renderInput={(params) => <TextField {...params} fullWidth required />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker label="From Time" value={formData.fromTime} onChange={handleDateChange('fromTime')} renderInput={(params) => <TextField {...params} fullWidth required />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker label="To Time" value={formData.toTime} onChange={handleDateChange('toTime')} minTime={formData.fromTime} renderInput={(params) => <TextField {...params} fullWidth required />} />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={12}>
            <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Priority:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {priorityOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  color={option.color}
                  variant={formData.priority === option.value ? 'filled' : 'outlined'}
                  onClick={() => handlePriorityChange(option.value)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ px: 4 }}>
                Create Slot
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      </Box>
    
  );
};

export default SlotCreation;

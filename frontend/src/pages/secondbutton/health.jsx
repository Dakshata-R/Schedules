import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';
import ImageUploadLabel from '../ImageUploadLabel'; // Import the ImageUploadLabel component

const AccommodationForm = () => {
  const [disability, setDisability] = useState('No');
  const [healthIssues, setHealthIssues] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleDisabilityChange = (event) => {
    setDisability(event.target.value);
    setError(''); // Clear error when user interacts with the field
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setError(''); // Clear error when a file is uploaded
  };

  const handleSave = async () => {
    if (!disability || !uploadedFile) {
      setError('Please fill out all required fields (Disability and Certificate Upload).');
      return;
    }
    const formData = new FormData();
    formData.append('disability', disability);
    formData.append('health_issues', healthIssues);
    formData.append('file', uploadedFile);

    try {
      await axios.post('http://localhost:5000/api/health/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Error uploading health details:', error);
      alert('Failed to save health details.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Health Details Section */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Health Details
      </Typography>

      <form>
        <Grid container spacing={3}>
          {/* Left Side - Form Fields */}
          <Grid item xs={12} md={8}>
            {/* Disability Section */}
            <FormControl component="fieldset" required>
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'black',
                  '&.Mui-focused': { color: 'black' }, // Ensure it stays black when focused
                  '&.MuiFormLabel-root': { color: 'black' }, // Default color
                }}
              >
                Any Disabilities
              </FormLabel>

              <RadioGroup row value={disability} onChange={handleDisabilityChange}>
                <FormControlLabel
                  value="No"
                  control={<Radio sx={{ color: 'darkgreen', '&.Mui-checked': { color: 'darkgreen' } }} />}
                  label="No"
                />
                <FormControlLabel
                  value="Yes"
                  control={<Radio sx={{ color: 'darkgreen', '&.Mui-checked': { color: 'darkgreen' } }} />}
                  label="Yes"
                />
              </RadioGroup>
            </FormControl>

            {/* Health Issues Section */}
            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem', mt: 2 }}>
              Any health issues mention here
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              value={healthIssues}
              onChange={(e) => setHealthIssues(e.target.value)}
            />

            {/* Error Message */}
            {error && (
              <Typography variant="body2" sx={{ mt: 2, color: 'red' }}>
                {error}
              </Typography>
            )}

            {/* Save Button and Saved Message */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
                onClick={handleSave}
              >
                Save
              </Button>
              {isSaved && (
                <Typography variant="body2" sx={{ ml: 2, color: 'green', fontWeight: 'bold' }}>
                  Saved!
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Right Side - Image Upload Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Add fitness certificate (Required)
            </Typography>

            {/* Image Upload Section */}
            <ImageUploadLabel
              onFileChange={handleFileUpload}
              error={!!error}
              helperText={error}
            />

            {/* Display Uploaded File Name */}
            {uploadedFile && (
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Uploaded: {uploadedFile.name}
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
      </form>
    </Box>
  );
};

export default AccommodationForm;
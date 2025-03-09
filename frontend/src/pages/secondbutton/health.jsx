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
  IconButton,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed!');
        return;
      }
      setUploadedFile(file);
      setError(''); // Clear error when a file is uploaded
    }
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Error uploading health details:', error);
      alert('Failed to save health details.');
    }
   };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Bulk Upload Button (Green and Centered) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ backgroundColor: 'green', color: 'white' }}
        >
          Bulk Upload
          <input type="file" hidden />
        </Button>
      </Box>

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

            {/* Updated File Upload UI */}
            <Box
              sx={{
                width: '200px',
                height: '180px',
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                mt: 1,
                border: '1px dashed gray',
                flexDirection: 'column',
              }}
            >
              {/* Red PDF Icon */}
              <PictureAsPdfIcon sx={{ fontSize: 50, color: 'red' }} />

              {/* Upload Button */}
              <Typography variant="body2" color="gray" component="div" mt={1}>
                Upload a PDF document (max 600x600)
                <Box display="block" mt={1}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: 'green', color: 'white' }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload PDF
                    <input type="file" hidden onChange={handleFileUpload} accept="application/pdf" />
                  </Button>
                </Box>
              </Typography>
            </Box>

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

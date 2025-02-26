import React, { useState } from 'react';
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
  const [email, setEmail] = useState('abc@bitsoftry.ac.in');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDisabilityChange = (event) => {
    setDisability(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
         Health Details
      </Typography>

      {/* Bulk Upload Button (Green and Centered) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ backgroundColor: 'green', color: 'white' }}
        >
          Bulk Upload
          <input type="file" hidden />
        </Button>
      </Box>

      <form>
        <Grid container spacing={3}>
          {/* Left Side - Form Fields */}
          <Grid item xs={12} md={8}>
            {/* Disability Section */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Any Disabilities</FormLabel>
              <RadioGroup row value={disability} onChange={handleDisabilityChange}>
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </FormControl>

            {/* Health Issues Section */}
            <TextField
              label="Any health issues mention here"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              value={healthIssues}
              onChange={(e) => setHealthIssues(e.target.value)}
            />

            {/* Email Section */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                ),
              }}
            />
            <Typography variant="caption" display="block" mt={1}>
              Enter email
            </Typography>
          </Grid>

          {/* Right Side - Image Upload Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Add fitness certificate (Required)
            </Typography>

            <Box
              sx={{
                border: '1px dashed gray',
                textAlign: 'center',
                padding: 2,
                marginTop: 2,
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Red PDF Icon */}
              <PictureAsPdfIcon sx={{ fontSize: 50, color: 'red' }} />

              {/* Green Upload Icon and "Upload PDF" Text */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Button
                  component="label"
                  sx={{ p: 0, minWidth: 0, display: 'flex', alignItems: 'center' }}
                >
                  <CloudUploadIcon sx={{ fontSize: 30, color: 'green', mr: 1 }} />
                  <Typography variant="body1">Upload PDF</Typography>
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
              </Box>

              {/* Display Uploaded File Name */}
              {uploadedFile && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Uploaded: {uploadedFile.name}
                </Typography>
              )}
            </Box>

            {/* File Format Information */}
            <Typography variant="caption" display="block" mt={1} textAlign="center">
              File Format: PDF, Recommended Size: 600x600 (1:1)
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AccommodationForm;

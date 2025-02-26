import React, { useState } from 'react';
import {
  TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Grid,
  Radio, RadioGroup, FormControlLabel, InputAdornment, IconButton
} from '@mui/material';
import { Person, Call, HelpOutline } from '@mui/icons-material';

const AdvisorDetails = () => {
  const [accommodationType, setAccommodationType] = useState('Hosteller');
  const [collegeTransport, setCollegeTransport] = useState('No');
  const [countryCode, setCountryCode] = useState('+91'); 
  const [floor, setFloor] = useState('Ground'); 
  const [hostelName, setHostelName] = useState(''); 
  const [roomType, setRoomType] = useState(''); 

  const handleAccommodationChange = (event) => {
    setAccommodationType(event.target.value);
  };

  const handleCollegeTransportChange = (event) => {
    setCollegeTransport(event.target.value);
  };

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const handleFloorChange = (event) => {
    setFloor(event.target.value);
  };

  const handleHostelNameChange = (event) => {
    setHostelName(event.target.value);
  };

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  // Country codes for dropdown
  const countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+86', name: 'China' },
  ];

  // Hostel names for dropdown
  const hostelNames = ['Narmadha', 'Yamuna', 'Kaveri', 'Bhavani', 'Ganga'];

  // Room types for dropdown
  const roomTypes = ['Four Cot', 'Three Cot', 'Two Cot', 'Single Cot'];

  return (
    <Paper style={{ padding: '20px', margin: '20px', maxWidth: '1200px' }}>
      <Typography variant="h6" gutterBottom>
        Class Advisor and Accommodation Details
      </Typography>

      <Grid container spacing={2}>
        {/* Left Side - Common Fields */}
        <Grid item xs={6}>
          {/* Class Advisor Name */}
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
            Class Advisor Name
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            variant="outlined"
            size="small" // Added size="small"
            sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" />
                </InputAdornment>
              ),
              style: {  fontSize: '17px' },
            }}
          />
          <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
            Enter the name of the class advisor.
          </Typography>

          {/* Class Advisor Number */}
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
            Class Advisor Number
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <Select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  size="small" // Added size="small"
                  sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
                >
                  {countryCodes.map((country) => (
                    <MenuItem key={country.code} value={country.code} sx={{ fontSize: '17px' }}>
                      {`${country.code} (${country.name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                size="small" // Added size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <Call fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {  fontSize: '17px' },
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
            Enter the contact number of the class advisor.
          </Typography>

          {/* Class Advisor Mail ID */}
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
            Class Advisor Mail ID (official)
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            variant="outlined"
            size="small" // Added size="small"
            sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <HelpOutline fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              style: {  fontSize: '17px' },
            }}
          />
          <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
            Enter the official email ID of the class advisor.
          </Typography>

          {/* Type */}
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
            Accommodation Details
          </Typography>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
            Type
          </Typography>
          <FormControl fullWidth margin="dense" sx={{ maxWidth: '800px' }}>
            <InputLabel sx={{ fontSize: '17px' }}>Select Type</InputLabel>
            <Select
              value={accommodationType}
              onChange={handleAccommodationChange}
              label="Select Type"
              size="small" // Added size="small"
              sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
              inputProps={{
                style: {  fontSize: '17px' },
              }}
            >
              <MenuItem value="Hosteller" sx={{ fontSize: '17px' }}>Hosteller</MenuItem>
              <MenuItem value="Dayscholar" sx={{ fontSize: '17px' }}>Dayscholar</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
            Select the type of accommodation.
          </Typography>

          {/* Conditional Fields for Dayscholar */}
          {accommodationType === 'Dayscholar' && (
            <>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                College Transport
              </Typography>
              <FormControl component="fieldset" fullWidth margin="dense" sx={{ maxWidth: '800px' }}>
                <RadioGroup
                  row
                  value={collegeTransport}
                  onChange={handleCollegeTransportChange}
                >
                  <FormControlLabel value="No" control={<Radio size="small" />} label="No" sx={{ fontSize: '17px' }} />
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" sx={{ fontSize: '17px' }} />
                </RadioGroup>
              </FormControl>
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Select whether college transport is available.
              </Typography>

              {collegeTransport === 'Yes' && (
                <>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                    Route
                  </Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    size="small" 
                    sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                    InputProps={{
                      style: { fontSize: '17px' },
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                    Enter the route for college transport.
                  </Typography>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                    Stage
                  </Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    size="small" // Added size="small"
                    sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                    InputProps={{
                      style: {  fontSize: '17px' },
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                    Enter the stage for college transport.
                  </Typography>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                    Stopping
                  </Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    size="small" // Added size="small"
                    sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                    InputProps={{
                      style: {  fontSize: '17px' },
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                    Enter the stopping point for college transport.
                  </Typography>
                </>
              )}
            </>
          )}

          {/* Conditional Fields for Hosteller */}
          {accommodationType === 'Hosteller' && (
            <>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Hosteller Details
              </Typography>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Hostel Name
              </Typography>
              <FormControl fullWidth margin="dense" sx={{ maxWidth: '800px' }}>
                <InputLabel sx={{ fontSize: '17px' }}>Select Hostel</InputLabel>
                <Select
                  value={hostelName}
                  onChange={handleHostelNameChange}
                  label="Select Hostel"
                  size="small" // Added size="small"
                  sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
                >
                  {hostelNames.map((name) => (
                    <MenuItem key={name} value={name} sx={{ fontSize: '17px' }}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Select the name of the hostel.
              </Typography>

              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Floor
              </Typography>
              <FormControl component="fieldset" fullWidth margin="dense" sx={{ maxWidth: '800px' }}>
                <RadioGroup
                  row
                  value={floor}
                  onChange={handleFloorChange}
                >
                  <FormControlLabel value="Ground" control={<Radio size="small" />} label="Ground" sx={{ fontSize: '17px' }} />
                  <FormControlLabel value="I" control={<Radio size="small" />} label="I" sx={{ fontSize: '17px' }} />
                  <FormControlLabel value="II" control={<Radio size="small" />} label="II" sx={{ fontSize: '17px' }} />
                  <FormControlLabel value="III" control={<Radio size="small" />} label="III" sx={{ fontSize: '17px' }} />
                </RadioGroup>
              </FormControl>
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Select the floor of the hostel.
              </Typography>
            </>
          )}
        </Grid>

        {/* Right Side - Conditional Fields */}
        <Grid item xs={6}>
          {accommodationType === 'Hosteller' && (
            <>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Room Number
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                size="small" // Added size="small"
                sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                  style: {  fontSize: '17px' },
                }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Enter the room number.
              </Typography>

              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Room Type
              </Typography>
              <FormControl fullWidth margin="dense" sx={{ maxWidth: '800px' }}>
                <InputLabel sx={{ fontSize: '17px' }}>Select Room Type</InputLabel>
                <Select
                  value={roomType}
                  onChange={handleRoomTypeChange}
                  label="Select Room Type"
                  size="small" // Added size="small"
                  sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type} sx={{ fontSize: '17px' }}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Select the type of room.
              </Typography>
            </>
          )}

          {accommodationType === 'Dayscholar' && (
            <>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Bus Number
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                size="small" // Added size="small"
                sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                  style: {  fontSize: '17px' },
                }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Enter the bus number.
              </Typography>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                Stopping Name
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                size="small" // Added size="small"
                sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                  style: {  fontSize: '17px' },
                }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                Enter the stopping name.
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvisorDetails;
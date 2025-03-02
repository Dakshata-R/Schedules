import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Grid,
  Radio, RadioGroup, FormControlLabel, InputAdornment, Button, Checkbox, IconButton // Added IconButton
} from '@mui/material';
import { Person, Call, HelpOutline } from '@mui/icons-material'; // Removed Add icon
import Busnumber from '../../components/classadvisor/busnumber'; // Import the busnumber Popup component
import AddRoute from '../../components/classadvisor/AddRoute';
import AddStage from '../../components/classadvisor/AddStage';
import AddStopping from '../../components/classadvisor/AddStopping';

const AdvisorDetails = () => {
  const [saveStatus, setSaveStatus] = useState('');
  const [accommodationType, setAccommodationType] = useState('Hosteller');
  const [collegeTransport, setCollegeTransport] = useState('No');
  const [countryCode, setCountryCode] = useState('+91');
  const [floor, setFloor] = useState('Ground');
  const [hostelName, setHostelName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [route, setRoute] = useState('');
  const [stage, setStage] = useState('');
  const [stopping, setStopping] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);

  const [errors, setErrors] = useState({
    advisorName: false,
    contactNumber: false,
    email: false,
    hostelName: false,
    roomNumber: false,
    route: false,
    stage: false,
    stopping: false,
    busNumber: false,
  });

  const validateContactNumber = (number) => {
    const phoneRegex = /^\d{10}$/; // Regex to check if the number has exactly 10 digits
    return phoneRegex.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(email);
  };

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
    setErrors({ ...errors, hostelName: false });
  };

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  const handleAdvisorNameChange = (event) => {
    setAdvisorName(event.target.value);
    setErrors({ ...errors, advisorName: false });
  };

  const handleContactNumberChange = (event) => {
    const value = event.target.value;
    setContactNumber(value);
    setErrors({ ...errors, contactNumber: !validateContactNumber(value) });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setErrors({ ...errors, email: !validateEmail(value) });
  };

  const handleRoomNumberChange = (event) => {
    setRoomNumber(event.target.value);
    setErrors({ ...errors, roomNumber: false });
  };

  const handleRouteChange = (event) => {
    setRoute(event.target.value);
    setErrors({ ...errors, route: false });
  };

  const handleStageChange = (event) => {
    setStage(event.target.value);
    setErrors({ ...errors, stage: false });
  };

  const handleStoppingChange = (event) => {
    setStopping(event.target.value);
    setErrors({ ...errors, stopping: false });
  };

  const handleBusNumberChange = (event) => {
    setBusNumber(event.target.value);
    setErrors({ ...errors, busNumber: false });
  };

  const handlePopupOpen = () => {
    setPopupOpen(true); // Open the Busnumber popup
  };

  const handleBusNumberSelect = (selectedBusNumber) => {
    setBusNumber(selectedBusNumber); // Update state with selected bus number
  };
  
  const handleRouteSelect = (selectedRoute) => {
    setRoute(selectedRoute); // Update state with selected Route
  };
  
  const handleStageSelect = (selectedStage) => {
    setStage(selectedStage); // Update state with selected Stage
  };
  
  const handleStoppingSelect = (selectedStopping) => {
    setStopping(selectedStopping); // Update state with selected Stopping
  };
  
  const handlePopupClose = (selectedBusNumber) => {
    if (selectedBusNumber) {
      setBusNumber(selectedBusNumber); // Update selected bus number
    }
    setPopupOpen(false); // Close the popup
  };

  const validateForm = () => {
    const newErrors = {
      advisorName: !advisorName,
      contactNumber: !validateContactNumber(contactNumber),
      email: !validateEmail(email),
      hostelName: accommodationType === 'Hosteller' && !hostelName,
      roomNumber: accommodationType === 'Hosteller' && !roomNumber,
      route: accommodationType === 'Dayscholar' && collegeTransport === 'Yes' && !route,
      stage: accommodationType === 'Dayscholar' && collegeTransport === 'Yes' && !stage,
      stopping: accommodationType === 'Dayscholar' && collegeTransport === 'Yes' && !stopping,
      busNumber: accommodationType === 'Dayscholar' && collegeTransport === 'Yes' && !busNumber,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        alert('Please fill out all required fields.');
        return;
    }

    const advisorData = {
        advisor_name: advisorName,
        country_code: countryCode,
        contact_number: contactNumber,
        email: email,
        accommodation_type: accommodationType,
        hostel_name: hostelName || null,
        floor: floor || null,
        room_type: roomType || null,
        room_number: roomNumber || null,
        college_transport: collegeTransport || null,
        route: route || null,
        stage: stage || null,
        stopping: stopping || null,
        bus_number: busNumber || null,
    };

    try {
        await axios.post('http://localhost:5000/api/advisors', advisorData);
        setSaveStatus('Saved!'); // ✅ Show success message
    } catch (error) {
        console.error('Error saving advisor details:', error);
        alert('Failed to save advisor details.');
    }
};

  const countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+86', name: 'China' },
  ];

  const hostelNames = ['Narmadha', 'Yamuna', 'Kaveri', 'Bhavani', 'Ganga'];
  const roomTypes = ['Four Cot', 'Three Cot', 'Two Cot', 'Single Cot'];

  return (
    <Paper style={{ padding: '20px', margin: '20px', maxWidth: '1200px', boxShadow: 'none' }}>
      <Typography variant="h6" gutterBottom>
        Class Advisor and Accommodation Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
              Class Advisor Name
            </Typography>
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person fontSize="small" />
                  </InputAdornment>
                ),
                style: { fontSize: '17px' },
              }}
              value={advisorName}
              onChange={handleAdvisorNameChange}
              error={errors.advisorName}
              helperText={errors.advisorName ? 'This field is required' : ''}
            />
            <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
              Enter the name of the class advisor.
            </Typography>

            <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
              Class Advisor Number
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <FormControl fullWidth margin="dense">
                  <Select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    size="small"
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
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <Call fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: { fontSize: '17px' },
                  }}
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  error={errors.contactNumber}
                  helperText={errors.contactNumber ? 'This field is required' : ''}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
              Enter the contact number of the class advisor.
            </Typography>

            <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
              Class Advisor Mail ID (official)
            </Typography>
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <HelpOutline fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { fontSize: '17px' },
              }}
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              helperText={errors.email ? 'This field is required' : ''}
            />
            <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
              Enter the official email ID of the class advisor.
            </Typography>

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
                size="small"
                sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
                inputProps={{
                  style: { fontSize: '17px' },
                }}
              >
                <MenuItem value="Hosteller" sx={{ fontSize: '17px' }}>Hosteller</MenuItem>
                <MenuItem value="Dayscholar" sx={{ fontSize: '17px' }}>Dayscholar</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
              Select the type of accommodation.
            </Typography>

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
                    <FormControlLabel
                      value="No"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="No"
                      sx={{ fontSize: '17px' }}
                    />
                    <FormControlLabel
                      value="Yes"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="Yes"
                      sx={{ fontSize: '17px' }}
                    />
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <AddRoute onRouteSelect={handleRouteSelect} /> {/* Pass the function */}
                          </InputAdornment>
                        ),
                        style: { fontSize: '17px' },
                        readOnly: true, // Make the input field readonly
                      }}
                      value={route} // Display the selected route
                      error={errors.route}
                      helperText={errors.route ? 'This field is required' : ''}
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
                      size="small"
                      sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <AddStage onStageSelect={handleStageSelect} /> {/* Pass the function */}
                          </InputAdornment>
                        ),
                        style: { fontSize: '17px' },
                        readOnly: true, // Make the input field readonly
                      }}
                      value={stage} // Display the selected stage
                      error={errors.stage}
                      helperText={errors.stage ? 'This field is required' : ''}
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
                      size="small"
                      sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <AddStopping onStoppingSelect={handleStoppingSelect} /> {/* Pass the function */}
                          </InputAdornment>
                        ),
                        style: { fontSize: '17px' },
                        readOnly: true, // Make the input field readonly
                      }}
                      value={stopping} // Display the selected stopping
                      error={errors.stopping}
                      helperText={errors.stopping ? 'This field is required' : ''}
                    />

                    <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                      Enter the stopping point for college transport.
                    </Typography>
                    </>
                )}
              </>
            )}

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
                    size="small"
                    sx={{ backgroundColor: '#f5f5f5', fontSize: '17px' }}
                    error={errors.hostelName}
                  >
                    {hostelNames.map((name) => (
                      <MenuItem key={name} value={name} sx={{ fontSize: '17px' }}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.hostelName && (
                  <Typography variant="body2" color="error" gutterBottom style={{ fontSize: '12px' }}>
                    This field is required
                  </Typography>
                )}
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
                    <FormControlLabel
                      value="Ground"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="Ground"
                      sx={{ fontSize: '17px' }}
                    />
                    <FormControlLabel
                      value="I"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="I"
                      sx={{ fontSize: '17px' }}
                    />
                    <FormControlLabel
                      value="II"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="II"
                      sx={{ fontSize: '17px' }}
                    />
                    <FormControlLabel
                      value="III"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                            },
                            '&.Mui-checked': {
                              color: 'darkgreen',
                            },
                          }}
                        />
                      }
                      label="III"
                      sx={{ fontSize: '17px' }}
                    />
                  </RadioGroup>
                </FormControl>
                <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                  Select the floor of the hostel.
                </Typography>
              </>
            )}
          </Grid>

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
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: '17px' },
                  }}
                  value={roomNumber}
                  onChange={handleRoomNumberChange}
                  error={errors.roomNumber}
                  helperText={errors.roomNumber ? 'This field is required' : ''}
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
                    size="small"
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

            {accommodationType === 'Dayscholar' && collegeTransport === 'Yes' && (
              <>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                  Bus Number
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                      {/* Busnumber Popup */}
                      <Busnumber onBusSelect={handleBusNumberSelect} />
                      </InputAdornment>
                    ),
                    style: { fontSize: '17px' },
                    readOnly: true, // Make the input readonly
                  }}
                  value={busNumber}
                  error={errors.busNumber}
                  helperText={errors.busNumber ? 'This field is required' : ''}
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
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5', maxWidth: '800px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                    style: { fontSize: '17px' },
                  }}
                  value={stopping}
                  onChange={handleStoppingChange}
                  error={errors.stopping}
                  helperText={errors.stopping ? 'This field is required' : ''}
                />
                <Typography variant="body2" color="textSecondary" gutterBottom style={{ fontSize: '12px' }}>
                  Enter the stopping name.
                </Typography>
              </>
            )}
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
          style={{ marginTop: '20px' }}
        >
          Save
        </Button>
        {saveStatus && <span style={{ marginLeft: '10px', color: 'green', fontWeight: 'bold' }}>{saveStatus}</span>}
      </form>
    </Paper>
  );
};

export default AdvisorDetails;
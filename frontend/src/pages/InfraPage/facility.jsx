import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Grid,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ExtraFacility from './extrafacility';
import AddFacility from './addfacility';
import AddUser from './adduser';

const FacilityType = ({ errors, setFacilityData, facilityData }) => {
  // State for accessibility options (stored as roles in DB)
  const [accessibilityOptions, setAccessibilityOptions] = useState(
    facilityData.accessibilityOptions || []
  );
  const [inputValue, setInputValue] = useState('');

  // State for facilities
  const [facilities, setFacilities] = useState(
    facilityData.facilities || ['Chairs', 'Guest chair', 'Charging ports', 'Mic', 'Table']
  );
  const [facilityInputValue, setFacilityInputValue] = useState('');

  // State for selected facilities
  const [selectedFacilities, setSelectedFacilities] = useState(
    facilityData.selectedFacilities || []
  );

  // State for selected users
  const [selectedUsers, setSelectedUsers] = useState(facilityData.selectedUsers || []);

  // State for popups
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [isExtraFacilityOpen, setIsExtraFacilityOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Update parent component's state whenever local state changes
  useEffect(() => {
    setFacilityData({
      accessibilityOptions,
      facilities,
      selectedFacilities: selectedFacilities,
      selectedUsers,
    });
  }, [accessibilityOptions, facilities, selectedFacilities, selectedUsers]);

  // Handle adding a new accessibility option
  const handleAddAccessibility = () => {
    if (inputValue.trim() !== '') {
      setAccessibilityOptions([...accessibilityOptions, inputValue.trim()]);
      setInputValue('');
    }
  };

  // Handle deleting an accessibility option
  const handleDeleteAccessibility = (index) => {
    const updatedOptions = [...accessibilityOptions];
    updatedOptions.splice(index, 1);
    setAccessibilityOptions(updatedOptions);
  };

  // Handle adding a new facility
  const handleAddFacility = (facilityName) => {
    if (Array.isArray(facilityName)) {
      setSelectedFacilities([...selectedFacilities, ...facilityName]);
    } else if (facilityName.trim() !== '') {
      setFacilities([...facilities, facilityName.trim()]);
    }
  };

  // Handle deleting a facility
  const handleDeleteFacility = (index) => {
    const updatedFacilities = [...facilities];
    updatedFacilities.splice(index, 1);
    setFacilities(updatedFacilities);
  };

  // Handle deleting a selected facility
  const handleDeleteSelectedFacility = (index) => {
    const updatedSelectedFacilities = [...selectedFacilities];
    updatedSelectedFacilities.splice(index, 1);
    setSelectedFacilities(updatedSelectedFacilities);
  };

  // Handle adding a new user
  const handleAddUser = (users) => {
    const newUsers = Array.isArray(users) ? users : [users];
    setSelectedUsers([...selectedUsers, ...newUsers]);
    
    // Also add role names to accessibility options
    const newRoles = newUsers.map(user => user.roleName);
    setAccessibilityOptions([...accessibilityOptions, ...newRoles]);
  };

  // Handle deleting a user
  const handleDeleteUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);
    setSelectedUsers(updatedUsers);
  };

  // Handle pressing Enter in accessibility input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddAccessibility();
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: '30px' }}>
        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'gray' }}>
            Facility
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ marginBottom: '30px' }}>
          Roles who can use the venue
        </Typography>
      </Box>

      {/* Accessibility and Right Grid Section */}
      <Grid container spacing={6}>
        {/* Left Grid (Two Input Containers) */}
        <Grid item xs={6}>
          {/* Accessibility Section */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Accessibility
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {accessibilityOptions.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => handleDeleteAccessibility(index)}
                  sx={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '20px',
                  }}
                />
              ))}
              <TextField
                size="small"
                placeholder="Add accessibility"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  backgroundColor: '#f5f6fa',
                  borderRadius: '8px',
                  width: '100%',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAddAccessibility}
                        sx={{ textTransform: 'none', borderColor: 'white', color: 'gray' }}
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {errors.accessibility && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.accessibility}
              </Typography>
            )}
          </Box>

          {/* Facilities Section */}
          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Facilities
            </Typography>
            <TextField
              size="small"
              placeholder="Add facility"
              value={facilityInputValue}
              onChange={(e) => setFacilityInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && facilityInputValue.trim() !== '') {
                  handleAddFacility(facilityInputValue);
                  setFacilityInputValue('');
                }
              }}
              sx={{
                backgroundColor: '#f5f6fa',
                borderRadius: '8px',
                width: '100%',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => setIsAddFacilityOpen(true)}
                      sx={{ textTransform: 'none', borderColor: 'white', color: 'gray' }}
                    >
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {facilities.map((facility, index) => (
                <Chip
                  key={index}
                  label={facility}
                  onDelete={() => handleDeleteFacility(index)}
                  sx={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '20px',
                  }}
                />
              ))}
            </Box>
            {errors.facilities && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.facilities}
              </Typography>
            )}
          </Box>

        
        </Grid>

        {/* Right Grid (Selected Facilities) */}
        <Grid item xs={6}>
          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Facilities to be added
            </Typography>
            <Box sx={{ marginBottom: '20px' }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setIsExtraFacilityOpen(true)}
                sx={{
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'gray',
                  backgroundColor: '#f5f6fa',
                  width: '100%',
                  justifyContent: 'flex-start',
                }}
              >
                Add Extra Facilities
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {selectedFacilities.map((facility, index) => (
                <Chip
                  key={index}
                  label={facility}
                  onDelete={() => handleDeleteSelectedFacility(index)}
                  sx={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '20px',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Popup Components */}
      <AddFacility
        open={isAddFacilityOpen}
        onClose={() => setIsAddFacilityOpen(false)}
        onAddFacility={handleAddFacility}
      />

      <ExtraFacility
        open={isExtraFacilityOpen}
        onClose={() => setIsExtraFacilityOpen(false)}
        onAddFacility={handleAddFacility}
      />

      <AddUser
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />
    </Box>
  );
};

export default FacilityType;
import React, { useState } from 'react';
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
  Stack, // Add Stack for vertical alignment
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ExtraFacility from './extrafacility'; // Import the ExtraFacility popup component
import AddFacility from './AddFacility'; // Import the AddFacility popup component
import AddUser from './adduser'; // Import the AddUser popup component

const FacilityType = () => {
  // State for roles
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');

  // State for facilities
  const [facilities, setFacilities] = useState(['Chairs', 'Guest chair', 'Charging ports', 'Mic', 'Table']);
  const [facilityInputValue, setFacilityInputValue] = useState('');

  // State for accessibility options
  const [accessibilityOptions, setAccessibilityOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // State to control popups
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [isExtraFacilityOpen, setIsExtraFacilityOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // State for selected facilities from ExtraFacility
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // State for selected users (avatars)
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Handle adding a new role
  const handleAddRole = () => {
    if (newRole.trim() !== '') {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  // Handle deleting a role
  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  // Handle adding a new accessibility option
  const handleAddAccessibility = (roleName) => {
    if (roleName.trim() !== '') {
      const newAccessibilityOption = roleName.trim();
      setAccessibilityOptions([...accessibilityOptions, newAccessibilityOption]);
      setRoles([...roles, newAccessibilityOption]); // Update roles state with the new accessibility option
    }
  };

  // Handle deleting an accessibility option
  const handleDeleteAccessibility = (index) => {
    const updatedOptions = accessibilityOptions.filter((_, i) => i !== index);
    const updatedRoles = roles.filter((_, i) => i !== index); // Remove the corresponding role
    setAccessibilityOptions(updatedOptions);
    setRoles(updatedRoles);
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
    const updatedFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(updatedFacilities);
  };

  // Handle deleting a selected facility
  const handleDeleteSelectedFacility = (index) => {
    const updatedSelectedFacilities = selectedFacilities.filter((_, i) => i !== index);
    setSelectedFacilities(updatedSelectedFacilities);
  };

  // Handle adding a new user
  
// Handle adding a new user
const handleAddUser = (users) => {
  setSelectedUsers([...selectedUsers, ...users]);
  const newRoles = users.map(user => user.roleName); // Extract role names from users
  setRoles([...roles, ...newRoles]); // Add the new roles to the roles state
};

// Handle adding a new accessibility option

  // Handle deleting a user
  const handleDeleteUser = (index) => {
    const updatedUsers = selectedUsers.filter((_, i) => i !== index);
    setSelectedUsers(updatedUsers);
  };

  // Handle saving data
  const handleSave = async () => {
    const facilityData = {
      roles: roles, // Ensure roles is an array of role names
      facilities: facilities,
      selectedFacilities: selectedFacilities,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/save-facility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });
  
      if (response.ok) {
        console.log('Facility data saved successfully!');
        alert('Facility data saved successfully!');
      } else {
        console.error('Failed to save facility data');
        alert('Failed to save facility data');
      }
    } catch (error) {
      console.error('Error saving facility data:', error);
      alert('Error saving facility data');
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
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              marginLeft: '500px',
              backgroundColor: '#006400',
            }}
          >
            Bulk Upload
          </Button>
        </Box>
        <Typography variant="h6" sx={{ marginBottom: '30px' }}>
          Roles who can use the venue
        </Typography>
      </Box>

      {/* Accessibility and Right Grid Section */}
      <Grid container spacing={6}>
        {/* Left Grid (Two Input Containers) */}
        <Grid item xs={6}>
          {/* First Input Container: Accessibility */}
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
                        onClick={() => setIsAddUserOpen(true)}
                        sx={{ textTransform: 'none', borderColor: 'white', color: 'gray' }}
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
  {selectedUsers.map((user, index) => (
    <Box key={index} sx={{ position: 'relative', textAlign: 'center' }}>
      <Stack direction="column" alignItems="center" spacing={1}>
        <Avatar src={user.avatar} alt={user.roleName} />
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          {user.roleName}
        </Typography>
      </Stack>
      <IconButton
        onClick={() => handleDeleteUser(index)}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'red',
          color: 'white',
          padding: '2px',
          '&:hover': {
            backgroundColor: 'darkred',
          },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Box>
  ))}

            </Box>
          </Box>

          {/* Second Input Container: Facilities */}
          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Facilities
            </Typography>
            <TextField
              size="small"
              placeholder="Add facility"
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
          </Box>
        </Grid>

        {/* Right Grid (One Input Container) */}
        <Grid item xs={4} sx={{ marginLeft: '0.5in' }}>
          <Box sx={{ marginBottom: '30px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Facilities to be added
            </Typography>
            <Box sx={{ marginBottom: '20px' }}>
              <TextField
                size="small"
                placeholder="Add new facility"
                value={facilityInputValue}
                onChange={(e) => setFacilityInputValue(e.target.value)}
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
                        onClick={() => setIsExtraFacilityOpen(true)}
                        sx={{ textTransform: 'none', borderColor: 'white', color: 'gray' }}
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
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

      {/* Add Facility Popup */}
      <AddFacility
        open={isAddFacilityOpen}
        onClose={() => setIsAddFacilityOpen(false)}
        onAddFacility={handleAddFacility}
      />

      {/* Extra Facility Popup */}
      <ExtraFacility
        open={isExtraFacilityOpen}
        onClose={() => setIsExtraFacilityOpen(false)}
        onAddFacility={handleAddFacility}
      />

      {/* Add User Popup */}
      <AddUser
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Save Button */}
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          textTransform: 'none',
          backgroundColor: '#006400',
          marginTop: '20px',
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default FacilityType;
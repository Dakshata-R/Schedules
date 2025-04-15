import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import Basic from "../InfraPage/basic";
import VenueType from "../InfraPage/venuetype";
import FacilityType from "../InfraPage/facility";

const steps = ["Basic", "Venue Type", "Facilities"];

const CustomStepIcon = ({ active, completed, icon }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: completed ? "green" : "white",
      border: `2px solid ${completed || active ? "green" : "gray"}`,
      color: completed ? "white" : "black",
      fontWeight: "bold",
    }}
  >
    {completed ? <CheckIcon sx={{ color: "white", fontSize: 16 }} /> : icon}
  </Box>
);

const Infra = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [basicData, setBasicData] = useState({
    uniqueId: '',
    venueName: '',
    location: '',
    priority: '',
    primaryPurpose: '',
    responsiblePersons: [],
    image: null
  });
  const [venueTypeData, setVenueTypeData] = useState({
    capacity: '',
    floor: '',
    ventilationType: '',
    accessibilityOptions: [],
  });
  const [facilityData, setFacilityData] = useState({
    roles: [],
    facilities: [],
    accessibilityOptions: [],
    selectedFacilities: [],
    selectedUsers: [],
  });
  const [combinedData, setCombinedData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const fetchCombinedData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fetch-combined-data');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      
      if (Array.isArray(data)) {
        // Ensure all JSON fields are properly parsed
        const parsedData = data.map(item => ({
          ...item,
          responsible_persons: Array.isArray(item.responsible_persons) 
            ? item.responsible_persons 
            : JSON.parse(item.responsible_persons || "[]"),
          assigned_users: Array.isArray(item.assigned_users)
            ? item.assigned_users
            : JSON.parse(item.assigned_users || "[]")
        }));
        setCombinedData(parsedData);
      } else {
        console.error('API data is not an array:', data);
        setCombinedData([]);
      }
    } catch (error) {
      console.error('Error fetching combined data:', error);
      setCombinedData([]);
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= activeStep || stepIndex === activeStep + 1) {
      setActiveStep(stepIndex);
      setErrors({});
      if (stepIndex > activeStep) {
        setCompletedSteps((prevCompleted) => [...prevCompleted, activeStep]);
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!basicData.uniqueId) newErrors.uniqueId = "Unique ID is required";
      if (!basicData.venueName) newErrors.venueName = "Venue Name is required";
      if (!basicData.location) newErrors.location = "Location is required";
      if (!basicData.priority) newErrors.priority = "Priority is required";
      if (!basicData.primaryPurpose) newErrors.primaryPurpose = "Primary Purpose is required";
      if (basicData.responsiblePersons?.length === 0) newErrors.responsiblePersons = "At least one responsible person is required";
    } else if (activeStep === 1) {
      if (!venueTypeData.capacity) newErrors.capacity = "Capacity is required";
      if (!venueTypeData.floor) newErrors.floor = "Floor is required";
      if (!venueTypeData.ventilationType) newErrors.ventilationType = "Ventilation Type is required";
    } else if (activeStep === 2) {
      if (facilityData.accessibilityOptions?.length === 0) newErrors.accessibility = "At least one accessibility option is required";
      if (facilityData.facilities?.length === 0 && facilityData.selectedFacilities?.length === 0) newErrors.facilities = "At least one facility is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep()) {
      try {
        if (activeStep === steps.length - 1) {
          const formData = new FormData();
          formData.append('unique_id', basicData.uniqueId);
          formData.append('venue_name', basicData.venueName);
          formData.append('location', basicData.location);
          formData.append('priority', basicData.priority);
          formData.append('primary_purpose', basicData.primaryPurpose);
          formData.append('responsible_persons', JSON.stringify(basicData.responsiblePersons));
          
          // Venue type data
          formData.append('capacity', venueTypeData.capacity);
          formData.append('floor', venueTypeData.floor);
          formData.append('maintenance_frequency', JSON.stringify(venueTypeData.maintenanceFrequency || []));
          formData.append('usage_frequency', JSON.stringify(venueTypeData.usageFrequency || []));
          formData.append('ventilation_type', venueTypeData.ventilationType);
          formData.append('accessibility_options', JSON.stringify(venueTypeData.accessibilityOptions));
          
          // Facility data
          formData.append('facilities', JSON.stringify(facilityData.facilities));
          formData.append('selected_facilities', JSON.stringify(facilityData.selectedFacilities));
          formData.append('assigned_users', JSON.stringify(facilityData.assignedUsers || []));
          
          if (basicData.image) {
            formData.append('image', basicData.image);
          }
  
          // Debug: Log form data before sending
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
  
          const saveResponse = await fetch("http://localhost:8000/api/save-infrastructure", {
            method: "POST",
            body: formData,
          });
  
          if (!saveResponse.ok) {
            const errorData = await saveResponse.json().catch(() => ({}));
            throw new Error(
              errorData.message || 
              `Failed to save infrastructure (Status: ${saveResponse.status})`
            );
          }
  
          const responseData = await saveResponse.json();
          console.log('Save successful:', responseData);
          
          setShowTable(true);
          fetchCombinedData();
        } else {
          setActiveStep((prevStep) => prevStep + 1);
          setCompletedSteps((prevCompleted) => [...prevCompleted, activeStep]);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert(`Save failed: ${error.message}`);
      }
    }
  };


  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (uniqueId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete-row/${uniqueId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCombinedData((prevData) => prevData.filter((row) => row.unique_id !== uniqueId));
      } else {
        console.error("Failed to delete row");
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const filteredData = combinedData.filter((row) => {
    const matchesSearch = row.venue_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "All" || row.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Paper
      sx={{
        width: "70vw",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      {!showTable && (
        <>
          <Stepper alternativeLabel activeStep={activeStep} sx={{ width: "100%", marginBottom: "20px" }}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: "pointer" }}>
                <StepLabel
                  StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: activeStep === index ? "green" : "black",
                      fontWeight: activeStep === index ? "bold" : "normal",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ marginTop: "20px" }}>
            {activeStep === 0 && <Basic errors={errors} setErrors={setErrors} setBasicData={setBasicData} basicData={basicData} />}
            {activeStep === 1 && <VenueType errors={errors} setVenueTypeData={setVenueTypeData} venueTypeData={venueTypeData} />}
            {activeStep === 2 && (
              <FacilityType errors={errors} setFacilityData={setFacilityData} facilityData={facilityData} />
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{
                backgroundColor: "#e0e0e0",
                color: "black",
                textTransform: "none",
                "&:hover": { backgroundColor: "#bdbdbd" },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                textTransform: "none",
                "&:hover": { backgroundColor: "#45a049" },
              }}
            >
              {activeStep === steps.length - 1 ? "Save" : "Next"}
            </Button>
          </Box>
        </>
      )}

      {showTable && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => {
                setShowTable(false);
                setActiveStep(0);
                setBasicData({
                  uniqueId: '',
                  venueName: '',
                  location: '',
                  priority: '',
                  primaryPurpose: '',
                  responsiblePersons: [],
                  image: null
                });
                setVenueTypeData({
                  capacity: '',
                  floor: '',
                  ventilationType: '',
                  accessibilityOptions: [],
                });
                setFacilityData({
                  roles: [],
                  facilities: [],
                  accessibilityOptions: [],
                  selectedFacilities: [],
                  selectedUsers: [],
                });
              }}
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                textTransform: "none",
                "&:hover": { backgroundColor: "#45a049" },
              }}
            >
              +Infrastructure
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography variant="h6">Infra list</Typography>
              <Chip
                label={`${filteredData.length} Infra`}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Keep track of infrastructure
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button
                variant="contained"
                onClick={() => setFilterCategory("All")}
                sx={{
                  backgroundColor: "#f8f8f8",
                  color: "black",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                View All
              </Button>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={filterCategory}
                  onChange={handleCategoryChange}
                  size="small"
                  sx={{
                    backgroundColor: "#f8f8f8",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="All">Category</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  size="small"
                  sx={{
                    backgroundColor: "#f8f8f8",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  startAdornment={  
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All">Filter</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Unique ID</TableCell>
                  <TableCell>Venue Name</TableCell>
                  <TableCell>Venue Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Access to</TableCell>
                  <TableCell>Responsible Persons</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.unique_id}>
                    <TableCell>{row.unique_id}</TableCell>
                    <TableCell>{row.venue_name}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.priority}
                        sx={{
                          backgroundColor:
                            row.priority === "High"
                              ? "#ffcdd2"
                              : row.priority === "Medium"
                              ? "#fff9c4"
                              : "#c8e6c9",
                          color:
                            row.priority === "High"
                              ? "#c62828"
                              : row.priority === "Medium"
                              ? "#f9a825"
                              : "#2e7d32",
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.primary_purpose}</TableCell>
                    <TableCell>
                      {row.assigned_users?.slice(0, 2).map((user, index) => (
                        <Chip
                          key={index}
                          label={typeof user === 'object' 
                            ? `${user.first_name || ''} ${user.last_name || ''}` 
                            : user}
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            margin: "2px",
                          }}
                        />
                      ))}
                      {row.assigned_users?.length > 2 && (
                        <Chip
                          label={`+${row.assigned_users.length - 2}`}
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            margin: "2px",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(row.responsible_persons)
                        ? row.responsible_persons.join(", ")
                        : JSON.parse(row.responsible_persons || "[]").join(", ")}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(row.unique_id)}>
                        <DeleteIcon sx={{ color: "#1976d2" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
            <Typography variant="body2" sx={{ color: "grey" }}>
              Page {page} of {totalPages}
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                sx={{
                  backgroundColor: "#f8f8f8",
                  color: "black",
                  textTransform: "none",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                sx={{
                  backgroundColor: "#f8f8f8",
                  color: "black",
                  textTransform: "none",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Infra;
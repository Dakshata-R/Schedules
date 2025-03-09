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
  const [basicData, setBasicData] = useState({});
  const [venueTypeData, setVenueTypeData] = useState({
    accessibilityOptions: [],
  });
  const [facilityData, setFacilityData] = useState({
    roles: [],
    facilities: [],
    accessibilityOptions: [],
    selectedFacilities: [],
    selectedUsers: [],
  });
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
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
      const response = await fetch("http://localhost:5000/api/fetch-combined-data");
      const data = await response.json();
      setCombinedData(data);
    } catch (error) {
      console.error("Error fetching combined data:", error);
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

  const handleSaveAndNext = async () => {
    if (validateStep()) {
      setLoading(true);
      try {
        let response;
        if (activeStep === 0) {
          const formData = new FormData();
          formData.append("uniqueId", basicData.uniqueId);
          formData.append("venueName", basicData.venueName);
          formData.append("location", basicData.location);
          formData.append("priority", basicData.priority);
          formData.append("primaryPurpose", basicData.primaryPurpose);
          formData.append("responsiblePersons", JSON.stringify(basicData.responsiblePersons));
          if (basicData.image) {
            formData.append("image", basicData.image);
          }

          response = await fetch("http://localhost:5000/api/save-basic", {
            method: "POST",
            body: formData,
          });
        } else if (activeStep === 1) {
          const payload = {
            ...venueTypeData,
            accessibilityOptions: venueTypeData.accessibilityOptions || [],
          };

          response = await fetch("http://localhost:5000/api/save-venue-type", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } else if (activeStep === 2) {
          const payload = {
            ...facilityData,
            roles: facilityData.roles || [],
            facilities: facilityData.facilities || [],
            accessibilityOptions: facilityData.accessibilityOptions || [],
            selectedFacilities: facilityData.selectedFacilities || [],
            selectedUsers: facilityData.selectedUsers || [],
          };

          response = await fetch("http://localhost:5000/api/save-facility", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }

        if (response.ok) {
          if (activeStep === steps.length - 1) {
            setShowContent(false);
            setShowTable(true);
            fetchCombinedData();
          } else {
            setActiveStep((prevStep) => prevStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, activeStep]);
          }
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleSave = async () => {
    const facilityData = {
      id: basicData.id, // Ensure id is included
      roles: roles,
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

  const handleCreate = async () => {
    console.log("Create button clicked");
  
    // Validate data for all steps
    if (validateStep()) {
      setLoading(true);
      try {
        // Save Basic Data
        const basicFormData = new FormData();
        basicFormData.append("uniqueId", basicData.uniqueId);
        basicFormData.append("venueName", basicData.venueName);
        basicFormData.append("location", basicData.location);
        basicFormData.append("priority", basicData.priority);
        basicFormData.append("primaryPurpose", basicData.primaryPurpose);
        basicFormData.append("responsiblePersons", JSON.stringify(basicData.responsiblePersons));
        if (basicData.image) {
          basicFormData.append("image", basicData.image);
        }
  
        const basicResponse = await fetch("http://localhost:5000/api/save-basic", {
          method: "POST",
          body: basicFormData,
        });
  
        if (!basicResponse.ok) {
          console.error("Failed to save basic data");
          return;
        }
  
        // Save Venue Type Data
        const venueTypePayload = {
          ...venueTypeData,
          accessibilityOptions: venueTypeData.accessibilityOptions || [],
        };
  
        const venueTypeResponse = await fetch("http://localhost:5000/api/save-venue-type", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(venueTypePayload),
        });
  
        if (!venueTypeResponse.ok) {
          console.error("Failed to save venue type data");
          return;
        }
  
        // Save Facility Data
        const facilityPayload = {
          ...facilityData,
          roles: facilityData.roles || [],
          facilities: facilityData.facilities || [],
          accessibilityOptions: facilityData.accessibilityOptions || [],
          selectedFacilities: facilityData.selectedFacilities || [],
          selectedUsers: facilityData.selectedUsers || [],
        };
  
        const facilityResponse = await fetch("http://localhost:5000/api/save-facility", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(facilityPayload),
        });
  
        if (!facilityResponse.ok) {
          console.error("Failed to save facility data");
          return;
        }
  
        // Fetch updated data to refresh the table
        await fetchCombinedData();
  
        // Reset the form and show the table
        setShowContent(false);
        setShowTable(true);
        setActiveStep(0); // Reset the stepper to the first step
        setBasicData({}); // Clear basic data
        setVenueTypeData({ accessibilityOptions: [] }); // Clear venue type data
        setFacilityData({ // Clear facility data
          roles: [],
          facilities: [],
          accessibilityOptions: [],
          selectedFacilities: [],
          selectedUsers: [],
        });
  
        // Show success message
        alert("Infrastructure created successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred while saving the infrastructure.");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDraft = () => {
    console.log("Draft button clicked");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (uniqueId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-row/${uniqueId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted row from the frontend state
        setCombinedData((prevData) => prevData.filter((row) => row.uniqueId !== uniqueId));
        console.log("Row deleted successfully!");
      } else {
        console.error("Failed to delete row");
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const filteredData = combinedData.filter((row) => {
    const matchesSearch = row.venueName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || row.category === filterCategory;
    const matchesPriority = priorityFilter === "All" || row.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <Paper
      sx={{
        width: "70%",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      {!showContent && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowContent(true);
              setShowTable(false);
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
      )}

      {showContent && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
            <Button
              variant="contained"
              onClick={handleDraft}
              sx={{
                backgroundColor: "#f0f0f0",
                color: "black",
                textTransform: "none",
                "&:hover": { backgroundColor: "#d0d0d0" },
              }}
            >
              Draft
            </Button>
            <Button
  variant="contained"
  onClick={handleCreate}
  sx={{
    backgroundColor: "#4caf50",
    color: "white",
    textTransform: "none",
    "&:hover": { backgroundColor: "#45a049" },
  }}
>
  Create
</Button>
          </Box>

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
            {activeStep === 0 && <Basic errors={errors} setErrors={setErrors} setBasicData={setBasicData} />}
            {activeStep === 1 && <VenueType errors={errors} setVenueTypeData={setVenueTypeData} venueTypeData={venueTypeData} />}
            {activeStep === 2 && (
              <FacilityType errors={errors} setFacilityData={setFacilityData} facilityData={facilityData} />
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{
                backgroundColor: "#e0e0e0",
                color: "black",
                textTransform: "none",
                "&:hover": { backgroundColor: "#bdbdbd" },
              }}
            >
              Back
            </Button>
            {activeStep !== steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleSaveAndNext}
                disabled={loading}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                {loading ? "Saving..." : "Save & Next"}
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleSaveAndNext}
                disabled={loading}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </Box>
        </>
      )}

      {showTable && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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
                  inputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterListIcon />
                      </InputAdornment>
                    ),
                  }}
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
                  <TableCell>Location</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Access to Roles</TableCell>
                  <TableCell>Responsible Persons</TableCell>
                
                </TableRow>
              </TableHead>
              <TableBody>
  {paginatedData.map((row) => {
    // Parse the accessToRoles if it's a string
    const accessToRoles = typeof row.accessToRoles === 'string' 
      ? JSON.parse(row.accessToRoles) 
      : row.accessToRoles || [];

    // Split roles into the first two and the remaining
    const firstTwoRoles = accessToRoles.slice(0, 2);
    const remainingRoles = accessToRoles.slice(2);

    return (
      <TableRow key={row.uniqueId}>
        <TableCell>{row.uniqueId}</TableCell>
        <TableCell>{row.venueName}</TableCell>
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
        <TableCell>{row.primaryPurpose}</TableCell>
        <TableCell>
          {/* Display the first two roles */}
          {firstTwoRoles.map((role, index) => (
            <Chip
              key={index}
              label={role}
              sx={{
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                margin: "2px",
              }}
            />
          ))}
          {/* Display the count of remaining roles */}
          {remainingRoles.length > 0 && (
            <Chip
              label={`+${remainingRoles.length} `}
              sx={{
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                margin: "2px",
                cursor: "pointer", // Add pointer cursor
              }}
              onClick={() => alert(`Remaining Roles: ${remainingRoles.join(", ")}`)} // Show remaining roles on click
            />
          )}
        </TableCell>
        <TableCell>
          {Array.isArray(row.responsiblePersons)
            ? row.responsiblePersons.join(", ")
            : JSON.parse(row.responsiblePersons || "[]").join(", ")}
        </TableCell>
        <TableCell>
          <IconButton onClick={() => handleDelete(row.uniqueId)}>
            <DeleteIcon sx={{ color: "#1976d2" }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  })}
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
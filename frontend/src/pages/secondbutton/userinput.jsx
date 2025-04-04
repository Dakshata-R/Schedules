import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import Personal from "./personal";
import Academic from "./academics";
import Communication from "./communication";
import Health from "./health";
import Additional from "./additional";
import ClassAdvisor from "./classadvisor";

const steps = [
  { id: "personal", label: "Personal" },
  { id: "academic", label: "Academic" },
  { id: "communication", label: "Communication" },
  { id: "advisor", label: "Class Advisor" },
  { id: "health", label: "Health" },
  { id: "additional", label: "Additional Info" },
];

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

const UserInput = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isFormStarted, setIsFormStarted] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [displayedUsers, setDisplayedUsers] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/fetch-data");
        if (response.ok) {
          const data = await response.json();
          setFetchedData(data);
          setDisplayedUsers(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search query and category
  const filterUsers = () => {
    const filtered = fetchedData.filter((user) => {
      const userString = JSON.stringify(user).toLowerCase();
      const matchesSearchQuery = userString.includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory
        ? user.role === filterCategory
        : true;
      return matchesSearchQuery && matchesCategory;
    });

    setDisplayedUsers(filtered);
    setCurrentPage(1);
  };

  // Reset to show all users
  const handleViewAll = () => {
    setSearchQuery("");
    setFilterCategory("");
    setDisplayedUsers(fetchedData);
    setCurrentPage(1);
  };

  // Re-filter users whenever searchQuery or filterCategory changes
  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterCategory]);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(displayedUsers.length / rowsPerPage);

  // Slice the displayedUsers array to show only the rows for the current page
  const paginatedUsers = displayedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleUpdate = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const handleCreate = async () => {
    try {
      const combinedData = { ...formData };
      const response = await fetch("http://localhost:8000/api/save-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        console.log("Final Save:", combinedData);
        setIsFormStarted(false);
        setActiveStep(0);
        setFormData({});
        fetchData();
      } else {
        const errorData = await response.json();
        console.error("Failed to save student data:", errorData.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving final form data:", error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const combinedData = { ...formData };
      const response = await fetch("http://localhost:8000/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        console.log("Draft Saved:", combinedData);
        alert("Draft saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save draft: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("An error occurred while saving the draft.");
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      {/* Create Button (Only when form is not started) */}
      {!isFormStarted && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              width: "10%",
              textTransform: "none",
              "&:hover": { backgroundColor: "#45a049" },
            }}
            onClick={() => setIsFormStarted(true)}
          >
            + User
          </Button>
        </Box>
      )}

      {/* User List and Details Section */}
      {!isFormStarted && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* User List Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Typography variant="h5" component="div">
              User list
            </Typography>
            <Chip
              label={`${fetchedData.length} Roles`}
              sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
            />
          </Box>

          <Typography variant="body1">
            Keep track of Roles and permissions
          </Typography>

          {/* Search and Filter Section */}
          <Grid container spacing={2}>
            {/* View All Button and Category Filter on the Left */}
            <Grid item xs={4} sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="contained"
                onClick={handleViewAll}
                sx={{
                  backgroundColor: "#f8f8f8",
                  color: "black",
                  textTransform: "none",
                  fontSize: "1rem",
                  padding: "10px 20px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                View All
              </Button>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Faculty">Faculty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Search and Filter on the Right */}
            <Grid item xs={8} sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ maxWidth: "600px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Display Users in a Table */}
          
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Class Advisor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.dob}</TableCell>
                    <TableCell>{user.bloodGroup}</TableCell>
                    <TableCell>{user.contactNumber1}</TableCell>
                    <TableCell>{user.classAdvisor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          

          {/* Pagination Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              padding: "10px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {/* Page Number Display on the Left */}
            <Typography variant="body2" sx={{ color: "grey" }}>
              Page {currentPage} of {totalPages}
            </Typography>

            {/* Previous and Next Buttons in a Container on the Right */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "8px 16px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                sx={{
                  color: "grey",
                  textTransform: "none",
                  minWidth: "auto",
                  "&:disabled": {
                    color: "#e0e0e0",
                  },
                }}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                sx={{
                  color: "grey",
                  textTransform: "none",
                  minWidth: "auto",
                  "&:disabled": {
                    color: "#e0e0e0",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Stepper and Form Content (Only when form is started) */}
      {isFormStarted && (
        <>
          {/* Draft and Create Buttons at Top-Right Corner */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginBottom: "20px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#e0e0e0",
                color: "black",
                "&:hover": { backgroundColor: "#bdbdbd" },
              }}
              onClick={handleSaveDraft}
            >
              Draft
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              onClick={handleCreate}
            >
              Create
            </Button>
          </Box>

          <Stepper alternativeLabel activeStep={activeStep} sx={{ width: "100%" }}>
            {steps.map((step, index) => (
              <Step key={step.id} onClick={() => setActiveStep(index)} sx={{ cursor: "pointer" }}>
                <StepLabel
                  StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: activeStep === index ? "green" : "black",
                      fontWeight: activeStep === index ? "bold" : "normal",
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          <Box sx={{ marginTop: "20px" }}>
            {activeStep === 0 && <Personal onUpdate={handleUpdate} />}
            {activeStep === 1 && <Academic onUpdate={handleUpdate} />}
            {activeStep === 2 && <Communication onUpdate={handleUpdate} />}
            {activeStep === 3 && <ClassAdvisor onUpdate={handleUpdate} />}
            {activeStep === 4 && <Health onUpdate={handleUpdate} />}
            {activeStep === 5 && <Additional onUpdate={handleUpdate} />}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Save & Next
              </Button>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default UserInput;
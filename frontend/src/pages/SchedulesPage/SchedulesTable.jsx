// SchedulesTable.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search,
  FilterList,
} from "@mui/icons-material";

const SchedulesTable = ({ onNewButtonClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterType, setFilterType] = useState("");

  // Mock data for schedules
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: "Schedule 1",
      priority: "High",
      type: "Type A",
      frequency: "Weekly",
      responsiblePerson: "John Doe",
      status: "Active",
    },
    {
      id: 2,
      name: "Schedule 2",
      priority: "Medium",
      type: "Type B",
      frequency: "Monthly",
      responsiblePerson: "Jane Smith",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Schedule 3",
      priority: "Low",
      type: "Type C",
      frequency: "Once",
      responsiblePerson: "Alice Johnson",
      status: "Active",
    },
  ]);

  const [displayedSchedules, setDisplayedSchedules] = useState(schedules);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(displayedSchedules.length / rowsPerPage);

  // Slice the displayedSchedules array to show only the rows for the current page
  const paginatedSchedules = displayedSchedules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Filter schedules based on search query, priority, and type
  const filterSchedules = () => {
    const filtered = schedules.filter((schedule) => {
      const matchesSearchQuery =
        schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = filterPriority
        ? schedule.priority === filterPriority
        : true;

      const matchesType = filterType
        ? schedule.type === filterType
        : true;

      return matchesSearchQuery && matchesPriority && matchesType;
    });

    setDisplayedSchedules(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Reset to show all schedules
  const handleViewAll = () => {
    setSearchQuery("");
    setFilterPriority("");
    setFilterType("");
    setDisplayedSchedules(schedules);
    setCurrentPage(1); // Reset to the first page
  };

  // Re-filter schedules whenever searchQuery, filterPriority, or filterType changes
  React.useEffect(() => {
    filterSchedules();
  }, [searchQuery, filterPriority, filterType]);

  // Function to get priority color and background color
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return { color: "red", backgroundColor: "#ffebee" };
      case "Medium":
        return { color: "blue", backgroundColor: "#e3f2fd" };
      case "Low":
        return { color: "green", backgroundColor: "#e8f5e9" };
      default:
        return { color: "inherit", backgroundColor: "#f5f5f5" };
    }
  };

  // Function to delete a schedule
  const handleDeleteSchedule = (id) => {
    const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
    setSchedules(updatedSchedules);
    setDisplayedSchedules(updatedSchedules);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Paper
        sx={{
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
          width: "94%",
          minHeight: "300px",
        }}
      >
        {/* Schedules List Heading with Schedule Count and +New Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Typography variant="h5" component="div">
              Schedules List
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "12px",
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              {schedules.length} Schedules
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={onNewButtonClick} // Use the passed prop here
            sx={{
              backgroundColor: "darkgreen", // Dark green color
              color: "white",
              textTransform: "none",
              fontSize: "1rem",
              padding: "6px 20px",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#1b5e20", // Darker green on hover
              },
            }}
          >
            +New Template
          </Button>
        </Box>

        <Typography variant="body1" sx={{ marginBottom: "50px" }}>
          Keep track of schedules and their dates.
        </Typography>

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {/* View All Button and Type Filter on the Left */}
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
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Type A">Type A</MenuItem>
                <MenuItem value="Type B">Type B</MenuItem>
                <MenuItem value="Type C">Type C</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search and Filter on the Right */}
          <Grid item xs={8} sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search schedules..."
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
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FilterList fontSize="small" />
                  Filter
                </Box>
              </InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Filter"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Display Schedules in a Table */}
        <Table sx={{ width: "100%", marginTop: "20px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Responsible Person</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      ...getPriorityStyles(schedule.priority),
                    }}
                  >
                    {schedule.priority}
                  </Box>
                </TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.frequency}</TableCell>
                <TableCell>{schedule.responsiblePerson}</TableCell>
                <TableCell>{schedule.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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
      </Paper>
    </Box>
  );
};

export default SchedulesTable;
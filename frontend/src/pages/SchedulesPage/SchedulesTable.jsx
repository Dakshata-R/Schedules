// SchedulesTable.jsx
import React, { useState, useEffect } from "react";
import SelectTemplate from "../../components/schedules_template/SelectTemplate";
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
  CircularProgress
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search,
  FilterList,
} from "@mui/icons-material";
import { fetchSlotSchedules, deleteSlotSchedule } from "../../services/slotScheduleService";

const SchedulesTable = ({ onNewButtonClick, onTemplateSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);

  // Fetch schedules from API
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const data = await fetchSlotSchedules();
        setSchedules(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadSchedules();
  }, []);

  // Filter schedules based on search query and priority
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearchQuery = 
      schedule.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (schedule.open_to && schedule.open_to.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = filterPriority
      ? schedule.priority === filterPriority
      : true;

    return matchesSearchQuery && matchesPriority;
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);

  // Slice the schedules array to show only the rows for the current page
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Reset to show all schedules
  const handleViewAll = () => {
    setSearchQuery("");
    setFilterPriority("");
    setCurrentPage(1);
  };

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
  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSlotSchedule(id);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: "30px" }}>
        <Typography color="error" variant="h6">
          Error loading schedules: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "30px" }}>
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
          onClick={() => setOpenTemplateDialog(true)}
          sx={{
            backgroundColor: "darkgreen",
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
            padding: "6px 20px",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#1b5e20",
            },
          }}
        >
          +New Schedule
        </Button>
      </Box>
      <SelectTemplate 
        open={openTemplateDialog} 
        handleClose={() => setOpenTemplateDialog(false)}
        onTemplateSelect={onTemplateSelect}
      />

      <Typography variant="body1" sx={{ marginBottom: "50px" }}>
        Keep track of schedules and their dates.
      </Typography>

      {/* Search and Filter Section */}
      <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
        {/* View All Button on the Left */}
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
            <TableCell>Template Name</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Slot Duration</TableCell>
            <TableCell>Open To</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedSchedules.length > 0 ? (
            paginatedSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.template_name}</TableCell>
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
                <TableCell>{formatDate(schedule.start_datetime)}</TableCell>
                <TableCell>{formatDate(schedule.end_datetime)}</TableCell>
                <TableCell>
                  {schedule.slot_duration} {schedule.duration_unit}
                </TableCell>
                <TableCell>{schedule.open_to}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No schedules found
              </TableCell>
            </TableRow>
          )}
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
            disabled={currentPage === totalPages || totalPages === 0}
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
  );
};

export default SchedulesTable;
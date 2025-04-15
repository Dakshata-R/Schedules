import React, { useState, useEffect } from "react";
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
  TableContainer,
  Chip,
  CircularProgress
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search,
  FilterList,
  MoreVert,
  Visibility as ViewIcon
} from "@mui/icons-material";
import axios from "axios";
import SelectTemplate from "../components/schedules_template/SelectTemplate";
import SlotTemplate from "../components/template/SlotTemplate";
import FacultyRequests from "./Facultyrequest";
import FacultyResponses from "./FacultyResponses";

const FacultySchedules = () => {
  const [currentView, setCurrentView] = useState('schedules');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [filterPriority, setFilterPriority] = useState("");
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [displayedSchedules, setDisplayedSchedules] = useState([]);
  const [hasStudentRequestPermission, setHasStudentRequestPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const loggedInEmail = localStorage.getItem("userEmail");
      if (!loggedInEmail) {
        setError("No email found in localStorage");
        setLoading(false);
        return;
      }
    
      try {
        // Check permission
        const permissionResponse = await axios.get(
          `http://localhost:8000/api/faculty/has-student-request-role?email=${loggedInEmail}`
        );
        setHasStudentRequestPermission(permissionResponse.data.hasPermission);
    
        // Get both schedule types
        const [slotResponse, faResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/slot-schedules/created-by?email=${loggedInEmail}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`http://localhost:8000/api/fa-schedules/created-by?email=${loggedInEmail}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
    
        const slotSchedules = (slotResponse.data?.data?.schedules || []).map(schedule => ({
          id: schedule.id,
          name: schedule.template_name || 'Slot Schedule',
          priority: schedule.priority,
          date: new Date(schedule.start_datetime).toLocaleDateString(),
          venue: (() => {
            try {
              const venues = typeof schedule.venues === 'string' ? JSON.parse(schedule.venues) : schedule.venues;
              return venues[0]?.name || 'Multiple Venues';
            } catch {
              return 'Multiple Venues';
            }
          })(),
          responsiblePerson: schedule.created_by,
          status: new Date(schedule.end_datetime) > new Date() ? 'Active' : 'Expired',
          start_datetime: schedule.start_datetime,
          end_datetime: schedule.end_datetime
        }));
    
        const faSchedules = (faResponse.data?.data?.schedules || []).map(schedule => ({
          id: schedule.id,
          name: schedule.fa_type || "FA Schedule",
          priority: schedule.priority,
          date: new Date(schedule.start_date).toLocaleDateString(),
          venue: (() => {
            try {
              const venues = typeof schedule.venues === 'string' ? JSON.parse(schedule.venues) : schedule.venues;
              return venues[0]?.name || 'Multiple Venues';
            } catch {
              return 'Multiple Venues';
            }
          })(),
          responsiblePerson: schedule.created_by,
          status: "Active",
          start_datetime: schedule.start_date + "T" + schedule.start_time,
          end_datetime: "" // optionally compute using duration if needed
        }));
    
        const combinedSchedules = [...slotSchedules, ...faSchedules];
        setSchedules(combinedSchedules);
        setDisplayedSchedules(combinedSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load schedules. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleNextPageSchedules = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPageSchedules = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const filterSchedules = () => {
    const filtered = schedules.filter((schedule) => {
      const matchesSearchQuery =
        schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = filterPriority
        ? schedule.priority === filterPriority
        : true;

      return matchesSearchQuery && matchesPriority;
    });

    setDisplayedSchedules(filtered);
    setCurrentPage(1);
  };

  const handleViewAllSchedules = () => {
    setSearchQuery("");
    setFilterPriority("");
    setDisplayedSchedules(schedules);
    setCurrentPage(1);
  };

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

  const totalPagesSchedules = Math.ceil(displayedSchedules.length / rowsPerPage);
  const paginatedSchedules = displayedSchedules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const navigateToResponses = (scheduleId, scheduleName) => {
    setSelectedSchedule({ id: scheduleId, name: scheduleName });
    setCurrentView('responses');
  };

  const navigateToSchedules = () => {
    setCurrentView('schedules');
    setCurrentPage(1);
  };
  const handleTemplateSelect = (selectedTemplate) => {
    // Handle the selected template here
    console.log("Selected template:", selectedTemplate);
    setOpenTemplateDialog(false);
    // You might want to add additional logic here to handle the selected template
  };
  
  
  const navigateToRequests = () => {
    setCurrentView('requests');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      margin: '24px',
      width:'72vw',
    }}>
      {currentView === 'schedules' && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography variant="h5" component="div">
                My Schedules
              </Typography>
              <Chip
                label={`${schedules.length} Schedules`}
                sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
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
          </Box>
          <SelectTemplate 
  open={openTemplateDialog} 
  handleClose={() => setOpenTemplateDialog(false)}
  onTemplateSelect={handleTemplateSelect}
/>

          <Typography variant="body1" sx={{ marginBottom: "50px" }}>
            Manage your created schedules.
          </Typography>

          <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
            <Grid item xs={4} sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="contained"
                onClick={handleViewAllSchedules}
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
              {hasStudentRequestPermission && (
                <Button
                  variant="outlined"
                  onClick={navigateToRequests}
                  sx={{
                    color: "#2e7d32",
                    borderColor: "#2e7d32",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#1b5e20",
                    },
                  }}
                >
                  Student Requests
                </Button>
              )}
            </Grid>

            <Grid item xs={8} sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && filterSchedules()}
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
              <Button 
                variant="contained" 
                onClick={filterSchedules}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>

          {displayedSchedules.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No schedules found. Create your first schedule!</Typography>
            </Box>
          ) : (
            <>
              <Table sx={{ width: "100%", marginTop: "20px" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={schedule.priority}
                          sx={{
                            ...getPriorityStyles(schedule.priority),
                            borderRadius: "12px",
                          }}
                        />
                      </TableCell>
                      <TableCell>{schedule.date}</TableCell>
                      <TableCell>{schedule.venue}</TableCell>
                      <TableCell>{schedule.responsiblePerson}</TableCell>
                      <TableCell>{schedule.status}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => navigateToResponses(schedule.id, schedule.name)}
                          color="primary"
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Page {currentPage} of {totalPagesSchedules}
                </Typography>

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
                    onClick={handlePreviousPageSchedules}
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
                    onClick={handleNextPageSchedules}
                    disabled={currentPage === totalPagesSchedules}
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
            </>
          )}
        </>
      )}

      {currentView === 'requests' && (
        <FacultyRequests
          navigateToSchedules={navigateToSchedules}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentView === 'responses' && (
        <FacultyResponses
          scheduleId={selectedSchedule.id}
          scheduleName={selectedSchedule.name}
          navigateToSchedules={navigateToSchedules}
        />
      )}
    </Box>
  );
};

export default FacultySchedules;
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Grid,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";

const StudentFiles = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slotDetailsDialogOpen, setSlotDetailsDialogOpen] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);
  const loggedInEmail = localStorage.getItem("userEmail");
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('Fetching requests for:', loggedInEmail);
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/requests/with-slots/${loggedInEmail}`,
          { headers: { 'Cache-Control': 'no-cache' } } // Disable client-side caching
        );
  
        console.log('API Response:', response.data);
        
        const processedRequests = response.data.map(request => ({
          ...request,
          status: request.status || "Pending",
          skills: typeof request.skills === "string" 
            ? JSON.parse(request.skills) 
            : Array.isArray(request.skills) ? request.skills : []
        }));
  
        console.log('Processed Requests:', processedRequests);
        setRequests(processedRequests);
      } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, [loggedInEmail, refreshKey]);
  const handleFilter = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/requests/${id}`);
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      setSnackbar({
        open: true,
        message: "Request deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete request",
        severity: "error"
      });
    }
  };

  const handleViewSlot = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request?.slots?.length > 0) {
      const bookedSlot = request.slots.find(slot => 
        slot.status === 'Booked' || slot.isBooked
      );
      if (bookedSlot) {
        setSelectedSlotDetails({
          ...bookedSlot,
          skillName: request.skills.join(', ') // Combine skills if multiple
        });
        setSlotDetailsDialogOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: "No booked slot found for this request",
          severity: "info"
        });
      }
    }
  };

  const handleDeleteClick = (id) => {
    setRequestToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (requestToDelete) {
      await handleDelete(requestToDelete);
    }
    setDeleteConfirmOpen(false);
  };

  const handleBookSlot = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request?.slots?.length > 0) {
      // Filter slots that are available (status Available or isBooked false)
      const availableSlots = request.slots.filter(slot => 
        slot.status === 'Available' || !slot.isBooked
      );
      
      if (availableSlots.length > 0) {
        setSelectedSlots(availableSlots);
        setSlotModalOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: "No available slots to book",
          severity: "info"
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "No slots available for this request",
        severity: "info"
      });
    }
  };
  const handleSlotSelect = async (slotId) => {
    try {
      setBookingInProgress(true);
      setSelectedSlotId(slotId);
      
      // Corrected API endpoint path
      const response = await axios.post(
        `http://localhost:8000/api/slots/${slotId}/book`, 
        { email: loggedInEmail }
      );
  
      if (response.data.success) {
        // Update the state to reflect the booked status
        setRequests(prevRequests => 
          prevRequests.map(request => ({
            ...request,
            slots: request.slots?.map(slot => 
              slot.id === slotId 
                ? { ...slot, status: 'Booked', isBooked: true } 
                : slot
            )
          }))
        );
        
        setSnackbar({
          open: true,
          message: "Slot booked successfully!",
          severity: "success"
        });
        setSlotModalOpen(false);
        setRefreshKey(prev => prev + 1); // Force refresh
      } else {
        throw new Error(response.data.message || "Failed to book slot");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to book slot",
        severity: "error"
      });
    } finally {
      setBookingInProgress(false);
      setSelectedSlotId(null);
    }
  };
  const handleSlotModalClose = () => {
    setSlotModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesFilter = filter === "all" || 
                         request.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      request.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.roll_number && request.roll_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.department && request.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bgcolor: '#fff3e0', color: '#ff6d00', dotColor: '#ff6d00' };
      case 'approved':
        return { bgcolor: '#e8f5e9', color: '#2e7d32', dotColor: '#2e7d32' };
      case 'rejected':
        return { bgcolor: '#ffebee', color: '#d32f2f', dotColor: '#d32f2f' };
      default:
        return { bgcolor: '#e3f2fd', color: '#1976d2', dotColor: '#1976d2' };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f6fa", minHeight: "100vh", padding: "16px", width: "88vw" }}>
      <Box
        sx={{
          padding: "6px",
          marginTop: "45px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5" }}>My Requests</Typography>
            <Chip label={`${filteredRequests.length} Requests`} sx={{ backgroundColor: "#e3f2fd", color: "#2196f3", fontWeight: "bold" }} />
          </Box>
        </Box>

        <Box sx={{ padding: "0 16px 16px 16px" }}>
          <Typography variant="body1" sx={{ color: "#616161" }}>View and manage your schedule requests.</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 16px 16px" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: "120px" }}>
              <Select
                value={filter}
                onChange={handleFilter}
                displayEmpty
                sx={{ borderRadius: "20px" }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search by name, roll or department"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{ 
                startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
                sx: { borderRadius: "20px" }
              }}
              sx={{ backgroundColor: "#ffffff", width: "300px" }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ marginBottom: "16px", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>User Details</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Requested Skills</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => {
                  const statusColors = getStatusColor(request.status);
                  const hasSlots = request.slots?.length > 0;
                 // Replace all slot status checks with consistent logic
const isBooked = request.slots?.some(slot => slot.status === 'Booked' || slot.isBooked);
                  const hasBookableSlots = hasSlots && request.slots.some(slot => !slot.isBooked);

                  return (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "#3f51b5" }}>
                            {request.student_name?.charAt(0) || "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>{request.student_name}</Typography>
                            {request.roll_number && (
                              <Typography variant="body2" sx={{ color: "#616161" }}>Roll: {request.roll_number}</Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={request.department || 'N/A'} 
                          size="small" 
                          sx={{ backgroundColor: "#e0f7fa", color: "#00838f" }} 
                        />
                      </TableCell>
                      <TableCell>
                        {request.skills.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {request.skills.map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill} 
                                size="small" 
                                sx={{ backgroundColor: '#e3f2fd', color: "#1e88e5" }} 
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">No skills</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: statusColors.bgcolor,
                          padding: "4px 8px",
                          borderRadius: "12px",
                          width: "fit-content",
                        }}>
                          <Box sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: statusColors.dotColor,
                          }} />
                          <Typography variant="body1" sx={{ color: statusColors.color, fontWeight: "medium" }}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </Typography>
                        </Box>
                      </TableCell>
<TableCell sx={{ display: 'flex', gap: 1 }}>

<Button 
  variant="contained"
  sx={{
    backgroundColor: request.status === 'Approved'
      ? request.slots?.some(slot => slot.status === 'Booked' || slot.isBooked)
        ? '#1b5e20' // Dark green for booked
        : '#2e7d32' // Green for available
      : '#e0e0e0', // Gray for pending/rejected
    color: '#ffffff',
    textTransform: 'none',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: request.status === 'Approved'
        ? request.slots?.some(slot => slot.status === 'Booked' || slot.isBooked)
          ? '#1b5e20'
          : '#1b5e20'
        : '#e0e0e0',
    },
    minWidth: '120px',
    boxShadow: 'none',
    '&:disabled': {
      backgroundColor: '#e0e0e0',
      color: '#9e9e9e'
    }
  }}
  onClick={() => {
    const bookedSlot = request.slots?.find(slot => 
      slot.status === 'Booked' || slot.isBooked
    );
    if (bookedSlot) {
      handleViewSlot(request.id);
    } else {
      handleBookSlot(request.id);
    }
  }}
  disabled={request.status !== 'Approved'}
  startIcon={request.slots?.some(slot => 
    slot.status === 'Booked' || slot.isBooked
  ) ? <EventIcon /> : null}
>
  {request.status === 'Approved'
    ? request.slots?.some(slot => 
        slot.status === 'Booked' || slot.isBooked
      )
      ? 'View Slot'
      : 'Book Slot'
    : 'Pending Approval'}
</Button>
  <IconButton 
    onClick={() => handleDeleteClick(request.id)} 
    sx={{ 
      color: "#d32f2f",
      '&:hover': {
        backgroundColor: 'rgba(211, 47, 47, 0.08)'
      }
    }}
    disabled={request.status !== 'Pending'}
  >
    <DeleteIcon />
  </IconButton>
</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No requests found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRequests.length > 0 && (
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}>
            <Typography variant="body1" sx={{ color: "#616161" }}>
              Showing {paginatedRequests.length} of {filteredRequests.length} requests (Page {page} of {totalPages})
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => handlePageChange(page + 1)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Slot Selection Dialog */}
      <Dialog 
        open={slotModalOpen} 
        onClose={handleSlotModalClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Available Slots</DialogTitle>
        <DialogContent>
          {selectedSlots.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Skill</TableCell>
                    <TableCell>Faculty</TableCell>
                    <TableCell>Date Range</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSlots.map((slot) => (
                   <TableRow key={slot.id}>
                   <TableCell>{slot.skillName}</TableCell>
                   <TableCell>{slot.facultyIncharge}</TableCell>
                   <TableCell>{slot.startDate} to {slot.endDate}</TableCell>
                   <TableCell>{formatTime(slot.fromTime)} - {formatTime(slot.toTime)}</TableCell>
                   <TableCell>{slot.location}</TableCell>
                   <TableCell>
                   <Button 
  variant="contained" 
  color="primary"
  onClick={() => handleSlotSelect(slot.id)}
  disabled={slot.status === 'Booked' || (bookingInProgress && selectedSlotId === slot.id)}
  startIcon={
    bookingInProgress && selectedSlotId === slot.id ? 
      <CircularProgress size={20} /> : 
      null
  }
  sx={{
    textTransform: 'none',
    borderRadius: '20px',
    '&:disabled': {
      backgroundColor: '#e0e0e0',
      color: '#9e9e9e'
    }
  }}
>
  {slot.status === 'Booked' ? 'Booked' : 
   (bookingInProgress && selectedSlotId === slot.id ? 'Booking...' : 'Book This Slot')}
</Button>
                   </TableCell>
                 </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>No slots available for booking</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSlotModalClose}>Close</Button>
        </DialogActions>
      </Dialog>

    {/* Booked Slot Details Dialog */}
<Dialog
  open={slotDetailsDialogOpen}
  onClose={() => setSlotDetailsDialogOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden'
    }
  }}
>
  {selectedSlotDetails && (
    <>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <CheckCircleIcon sx={{ 
            mr: 2, 
            fontSize: '2.5rem',
            color: '#a5d6a7'
          }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Your Booked Session
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {selectedSlotDetails.skillName} Training
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ 
          padding: '24px',
          background: 'white',
          margin: '16px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <PersonIcon sx={{ 
                  mr: 2, 
                  color: '#2e7d32',
                  fontSize: '2rem'
                }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Faculty Incharge
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedSlotDetails.facultyIncharge}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <EventIcon sx={{ 
                  mr: 2, 
                  color: '#2e7d32',
                  fontSize: '2rem'
                }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatDate(selectedSlotDetails.startDate)} - {formatDate(selectedSlotDetails.endDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <ScheduleIcon sx={{ 
                  mr: 2, 
                  color: '#2e7d32',
                  fontSize: '2rem'
                }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Time
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatTime(selectedSlotDetails.fromTime)} - {formatTime(selectedSlotDetails.toTime)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <LocationOnIcon sx={{ 
                  mr: 2, 
                  color: '#2e7d32',
                  fontSize: '2rem'
                }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedSlotDetails.location}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                textAlign: 'center',
                mt: 2,
                padding: '16px',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px'
              }}>
                <Chip 
                  label={selectedSlotDetails.skillName} 
                  color="success" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    padding: '8px 16px',
                    height: 'auto'
                  }} 
                />
                <Typography variant="body2" sx={{ mt: 1, color: '#2e7d32' }}>
                  Your session has been successfully booked!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        padding: '16px 24px', 
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button 
          onClick={() => setSlotDetailsDialogOpen(false)}
          variant="contained"
          color="success"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            padding: '8px 24px',
            fontWeight: 'bold',
            boxShadow: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '8px' }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentFiles;
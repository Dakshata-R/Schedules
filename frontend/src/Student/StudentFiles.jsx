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
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
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
      if (!loggedInEmail) {
        console.error("No logged-in email provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/requests/with-slots/${loggedInEmail}`
        );

        // Process skills to always be an array and ensure status exists
        const processedRequests = response.data.map(request => ({
          ...request,
          status: request.status || "Pending",
          skills: typeof request.skills === "string" 
            ? JSON.parse(request.skills) 
            : Array.isArray(request.skills) ? request.skills : []
        }));

        setRequests(processedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch requests",
          severity: "error"
        });
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
      // Find the booked slot (assuming only one slot can be booked per request)
      const bookedSlot = request.slots.find(slot => slot.isBooked);
      if (bookedSlot) {
        setSelectedSlotDetails(bookedSlot);
        setSlotDetailsDialogOpen(true);
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
      setSelectedSlots(request.slots);
      setSlotModalOpen(true);
    }
  };

  const handleSlotSelect = async (slotId) => {
    try {
      setBookingInProgress(true);
      setSelectedSlotId(slotId);
      
      const response = await axios.post(`http://localhost:8000/api/slots/${slotId}/book`, {
        email: loggedInEmail
      });
      
      // Update the requests state to reflect the booked slot
      setRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.slots?.some(slot => slot.id === slotId)) {
            return {
              ...request,
              slots: request.slots.map(slot => 
                slot.id === slotId ? { ...slot, isBooked: true } : slot
              ),
              status: "Approved" // Ensure status is set to Approved after booking
            };
          }
          return request;
        })
      );
      
      setSnackbar({
        open: true,
        message: "Slot booked successfully!",
        severity: "success"
      });
      
      setSlotModalOpen(false);
      setRefreshKey(prev => prev + 1); // Refresh data after booking
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
    setRefreshKey(prev => prev + 1); // Refresh data when modal closes
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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>My Requests</Typography>
            <Chip label={`${filteredRequests.length} Requests`} sx={{ backgroundColor: "#e3f2fd", color: "#2196f3" }} />
          </Box>
        </Box>

        <Box sx={{ padding: "0 16px 16px 16px" }}>
          <Typography variant="body1">View and manage your schedule requests.</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 16px 16px" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: "120px" }}>
              <Select
                value={filter}
                onChange={handleFilter}
                displayEmpty
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
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{ startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} /> }}
              sx={{ backgroundColor: "#ffffff", borderRadius: "30px", width: "300px" }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ marginBottom: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Request for</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => {
                  const statusColors = getStatusColor(request.status);
                  const hasSlots = request.slots?.length > 0;
                  const isBooked = request.slots?.some(slot => slot.isBooked);
                  const hasBookableSlots = hasSlots && request.slots.some(slot => !slot.isBooked);

                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{request.student_name}</Typography>
                        {request.roll_number && (
                          <Typography variant="body2">Roll: {request.roll_number}</Typography>
                        )}
                      </TableCell>
                      <TableCell>{request.department || 'N/A'}</TableCell>
                      <TableCell>
                        {request.skills.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {request.skills.map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill} 
                                size="small" 
                                sx={{ backgroundColor: '#e3f2fd' }} 
                              />
                            ))}
                          </Box>
                        ) : (
                          'No skills'
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
                          <Typography variant="body1" sx={{ color: statusColors.color }}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained"
                          sx={{
                            backgroundColor: request.status === 'Approved' 
                              ? (isBooked ? '#1b5e20' : (hasBookableSlots ? '#2e7d32' : '#ff9800'))
                              : request.status === 'Pending'
                                ? '#ff9800'
                                : '#e0e0e0',
                            color: '#ffffff',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: request.status === 'Approved'
                                ? (isBooked ? '#1b5e20' : (hasBookableSlots ? '#1b5e20' : '#e65100'))
                                : '#e0e0e0',
                            },
                            minWidth: '100px'
                          }}
                          onClick={() => isBooked ? handleViewSlot(request.id) : handleBookSlot(request.id)}
                          disabled={request.status !== 'Approved' || (!isBooked && !hasBookableSlots)}
                        >
                          {request.status === 'Approved'
                            ? (isBooked 
                                ? 'View Slot' 
                                : (hasBookableSlots ? 'Book Slot' : 'No Slots'))
                            : request.status === 'Pending'
                              ? 'Pending Approval'
                              : 'Rejected'}
                        </Button>
                        <IconButton 
                          onClick={() => handleDeleteClick(request.id)} 
                          sx={{ color: "#d32f2f" }}
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
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No requests found
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
            <Typography variant="body1">
              Page {page} of {totalPages}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => handlePageChange(page + 1)}
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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Slot Details Dialog */}
      <Dialog 
        open={slotDetailsDialogOpen} 
        onClose={() => setSlotDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Booked Slot Details</DialogTitle>
        <DialogContent>
          {selectedSlotDetails && (
            <Box sx={{ mt: 2 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Skill</TableCell>
                      <TableCell>{selectedSlotDetails.skill_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Faculty</TableCell>
                      <TableCell>{selectedSlotDetails.faculty_incharge}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date Range</TableCell>
                      <TableCell>{selectedSlotDetails.start_date} to {selectedSlotDetails.end_date}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell>{selectedSlotDetails.from_time} - {selectedSlotDetails.to_time}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell>{selectedSlotDetails.location}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSlotDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Slot Selection Dialog */}
      <Dialog open={slotModalOpen} onClose={handleSlotModalClose} maxWidth="md" fullWidth>
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
                      <TableCell>{slot.skill_name}</TableCell>
                      <TableCell>{slot.faculty_incharge}</TableCell>
                      <TableCell>{slot.start_date} to {slot.end_date}</TableCell>
                      <TableCell>{slot.from_time} - {slot.to_time}</TableCell>
                      <TableCell>{slot.location}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleSlotSelect(slot.id)}
                          disabled={slot.isBooked || (bookingInProgress && selectedSlotId === slot.id)}
                          startIcon={
                            bookingInProgress && selectedSlotId === slot.id ? 
                              <CircularProgress size={20} /> : 
                              null
                          }
                        >
                          {slot.isBooked ? 'Booked' : 
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentFiles;
import React, { useState, useEffect, useRef } from "react";
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
  TextField,
  CircularProgress,
  Chip,
  Avatar,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import axios from "axios";

const StudentAvailableSlots = () => {
  const [viewSlotDialogOpen, setViewSlotDialogOpen] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [slotDetailsDialogOpen, setSlotDetailsDialogOpen] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [bookedSlotDetails, setBookedSlotDetails] = useState(null);
  const loggedInEmail = localStorage.getItem("userEmail");
  const rowsPerPage = 7;
  const scrollRef = useRef(null);

  const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    
    // Ensure we're working with a string
    const str = String(dateTimeStr);
    
    // Handle ISO format (from backend)
    if (str.includes('T')) {
      return new Date(str);
    }
    
    // Handle backend format "2025-04-10 08:45:00" if needed
    const [datePart, timePart] = str.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart?.split(':').map(Number) || [0, 0, 0];
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/slot-bookings/all'
        );
        setAllBookings(response.data.data || []);
      } catch (error) {
        console.error("Error fetching all bookings:", error);
      }
    };
  
    fetchAllBookings();
  }, []);
  
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/slot-schedules/for-student/${loggedInEmail}`
        );
        
        setSlots(response.data.data?.slots || []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch available slots",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchAvailableSlots();
  }, [loggedInEmail]); // ✅ Only fetch slots initially, without bookings
  
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  const handleBookSlot = async (slotId, selectedTiming = null) => {
    try {
      setBookingInProgress(true);
      setSelectedSlotId(slotId);
      
      const bookingData = {
        email: loggedInEmail,
        selectedTiming: selectedTiming ? {
          start: selectedTiming.start.toISOString(),
          end: selectedTiming.end.toISOString()
        } : null
      };
  
      const response = await axios.post(
        `http://localhost:8000/api/slot-bookings/${slotId}/book`, 
        bookingData
      );
  
      if (response.data.success) {
        // ✅ Fetch only bookings after a slot is booked
        const bookingsResponse = await axios.get('http://localhost:8000/api/slot-bookings/all');
        setAllBookings(bookingsResponse.data.data || []);
  
        setSnackbar({
          open: true,
          message: "Slot booked successfully!",
          severity: "success"
        });
  
        setPreviewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error booking slot:", error);
    } finally {
      setBookingInProgress(false);
      setSelectedSlotId(null);
      setSlotDetailsDialogOpen(false);
    }
  };
  
  const handleOpenBookingDialog = async (slot) => {
    try {
      // Fetch the latest bookings only when checking for booked status
      const bookingsResponse = await axios.get('http://localhost:8000/api/slot-bookings/all');
      const updatedBookings = bookingsResponse.data.data || [];
      setAllBookings(updatedBookings);
  
      const userBooking = updatedBookings.find(booking => 
        booking.slot_id === slot.id && 
        booking.student_email === loggedInEmail && 
        booking.status === 'booked'
      );
  
      if (userBooking) {
        setBookedSlotDetails({
          ...slot,
          specific_start: userBooking.specific_start,
          specific_end: userBooking.specific_end,
          booked_date: userBooking.booked_date,
          booked_time_slot: userBooking.booked_time_slot
        });
        setViewSlotDialogOpen(true);
      } else {
        setSelectedSlotDetails({
          ...slot,
          id: slot.id,
          templateName: slot.template_name,
          priority: slot.priority,
          slotDuration: `${slot.slot_duration} ${slot.duration_unit}`,
          facultyIncharge: slot.faculties.map(f => f.name).join(', '),
          startDate: formatDate(slot.start_datetime),
          endDate: formatDate(slot.end_datetime),
          fromTime: formatTime(slot.start_datetime),
          toTime: formatTime(slot.end_datetime),
          location: slot.venues.map(v => v.name).join(', '),
          openTo: slot.open_to,
          numberOfSlots: slot.number_of_slots
        });
        setSlotDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error checking booking status:", error);
    }
  };
  

  const formatDate = (dateString) => {
    const date = parseDateTime(dateString);
    if (!date || isNaN(date.getTime())) return 'Invalid date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateTimeString) => {
    const date = parseDateTime(dateTimeString);
    if (!date || isNaN(date.getTime())) return '';
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;
    return `${hours}:${minutes} ${ampm}`;
  };
 
  const calculateSlotTimings = (slot) => {
    if (!slot.start_datetime || !slot.slot_duration || !slot.number_of_slots) return [];
    
    const startDateTime = parseDateTime(slot.start_datetime);
    if (!startDateTime || isNaN(startDateTime.getTime())) return [];
  
    const timings = [];
    let currentTime = new Date(startDateTime);
    let slotsRemaining = parseInt(slot.number_of_slots);
    const durationInMinutes = slot.duration_unit === "Hours" ? 
      parseInt(slot.slot_duration) * 60 : parseInt(slot.slot_duration);
  
    const breaks = [
      { start: 10 + 35/60, end: 10 + 50/60 },  // 10:35-10:50
      { start: 12 + 30/60, end: 13 + 30/60 },  // 12:30-13:30
      { start: 15 + 20/60, end: 15 + 35/60 }   // 15:20-15:35
    ];
    const workingHours = { start: 9, end: 16 + 30/60 }; // 9:00-16:30
  
    while (slotsRemaining > 0) {
      const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
      
      // Skip weekends
      if (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Check if within working hours
      if (currentHour < workingHours.start) {
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
      if (currentHour >= workingHours.end) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Skip break times
      const currentBreak = breaks.find(b => currentHour >= b.start && currentHour < b.end);
      if (currentBreak) {
        currentTime.setHours(
          Math.floor(currentBreak.end),
          (currentBreak.end % 1) * 60,
          0, 0
        );
        continue;
      }
  
      // Calculate end time for the slot
      const endTime = new Date(currentTime);
      endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
      const endHour = endTime.getHours() + (endTime.getMinutes() / 60);
  
      // Check if slot would overlap with a break
      const overlappingBreak = breaks.find(b => currentHour < b.end && endHour > b.start);
      if (overlappingBreak) {
        currentTime.setHours(
          Math.floor(overlappingBreak.end),
          (overlappingBreak.end % 1) * 60,
          0, 0
        );
        continue;
      }
  
      // Ensure slot does not go past working hours
      if (endHour > workingHours.end) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Check if this specific timing has reached max capacity
      const timingBookings = slot.bookings ? 
        slot.bookings.filter(b => 
          b.specific_start && 
          new Date(b.specific_start).getTime() === currentTime.getTime() &&
          b.status === 'booked'
        ).length : 0;
  
      const isFullyBooked = timingBookings >= (slot.max_capacity || 3); // Default to 3 if not set
  
      timings.push({
        date: new Date(currentTime),
        start: new Date(currentTime),
        end: endTime,
        booked: isFullyBooked,
        available: !isFullyBooked,
        remaining: (slot.max_capacity || 3) - timingBookings
      });
      
      currentTime = new Date(endTime);
      slotsRemaining--;
    }
  
    return timings;
  };
  

  const groupSlotsByDate = (slotTimings) => {
    const groups = {};
    slotTimings.forEach(slot => {
      const dateKey = slot.date.toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(slot);
    });
    return groups;
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      if (direction === "left") {
        scrollRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const filteredSlots = slots.filter((slot) => {
    const matchesSearch = 
      slot.template_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (slot.faculties && slot.faculties.some(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (slot.venues && slot.venues.some(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      slot.priority?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSlots.length / rowsPerPage);
  const paginatedSlots = filteredSlots.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { bgcolor: '#ffebee', color: '#d32f2f' };
      case 'medium':
        return { bgcolor: '#fff8e1', color: '#ff8f00' };
      case 'low':
        return { bgcolor: '#e8f5e9', color: '#2e7d32' };
      default:
        return { bgcolor: '#e3f2fd', color: '#1976d2' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "16px" }}>
      {/* Main content */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Available Training Slots
          </Typography>
          <Chip 
            label={`${filteredSlots.length} Slots`} 
            sx={{ backgroundColor: "#e3f2fd", color: "#2196f3", fontWeight: "bold" }} 
          />
        </Box>
        
        <TextField
          size="small"
          placeholder="Search by skill, faculty or venue"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{ 
            startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
            sx: { borderRadius: "20px" }
          }}
          sx={{ backgroundColor: "#ffffff", width: "300px" }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "8px", mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Skill/Template</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Faculty</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSlots.length > 0 ? (
              paginatedSlots.map((slot) => {
                const priorityColors = getPriorityColor(slot.priority);
                const faculties = (slot.faculties);
                const venues = (slot.venues);
                const isBooked = slot.bookings && slot.bookings.some(b => b.student_email === loggedInEmail);

                return (
                  <TableRow key={slot.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {slot.template_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {slot.number_of_slots} slots available
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {slot.slot_duration} {slot.duration_unit}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {formatDate(slot.start_datetime)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatTime(slot.start_datetime)} 
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {faculties.slice(0, 2).map((faculty, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: "0.75rem" }}>
                            {faculty.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {faculty.name}
                          </Typography>
                        </Box>
                      ))}
                      {faculties.length > 2 && (
                        <Typography variant="body2" color="textSecondary">
                          +{faculties.length - 2} more
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {venues.slice(0, 2).map((venue, index) => (
                        <Chip
                          key={index}
                          label={venue.name}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                      {venues.length > 2 && (
                        <Typography variant="body2" color="textSecondary">
                          +{venues.length - 2} more
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={slot.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityColors.bgcolor,
                          color: priorityColors.color,
                          fontWeight: "bold"
                        }}
                      />
                    </TableCell>
                    <TableCell>
                    <Button
  variant="contained"
  size="small"
  color={slot.isBooked ? "success" : "primary"}
  onClick={() => handleOpenBookingDialog(slot)}
  disabled={!slot.isBooked && (bookingInProgress && selectedSlotId === slot.id)}
  sx={{ borderRadius: '20px' }}
>
  {slot.isBooked ? "View Slot" : bookingInProgress && selectedSlotId === slot.id ? (
    <>
      <CircularProgress size={20} sx={{ mr: 1 }} />
      Booking...
    </>
  ) : "Book Slot"}
</Button>

                </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No available slots found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredSlots.length > 0 && (
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}>
          <Typography variant="body1" sx={{ color: "#616161" }}>
            Showing {paginatedSlots.length} of {filteredSlots.length} slots (Page {page} of {totalPages})
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
      {/* View Slot Dialog (for already booked slots) */}
      <Dialog
  open={viewSlotDialogOpen}
  onClose={() => setViewSlotDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">Your Booked Slot</Typography>
      <IconButton onClick={() => setViewSlotDialogOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent>
    {bookedSlotDetails && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {bookedSlotDetails.template_name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon color="primary" sx={{ mr: 1 }} />
          <Typography>
  <strong>Booked Date:</strong> {bookedSlotDetails.booked_date ? 
    new Date(bookedSlotDetails.booked_date).toLocaleDateString() : 'Not Available'}
</Typography>


        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScheduleIcon color="primary" sx={{ mr: 1 }} />
          <Typography>
            <strong>Time Slot:</strong> {bookedSlotDetails.booked_time_slot}
          </Typography>
        </Box>
        
        {bookedSlotDetails.specific_start && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon color="primary" sx={{ mr: 1 }} />
            <Typography>
              <strong>Specific Timing:</strong> {formatTime(bookedSlotDetails.specific_start)} - {formatTime(bookedSlotDetails.specific_end)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
          <Typography>
            <strong>Location:</strong> {bookedSlotDetails.venues?.map(v => v.name).join(', ')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography>
            <strong>Faculty:</strong> {bookedSlotDetails.faculties?.map(f => f.name).join(', ')}
          </Typography>
        </Box>
        
        <Box sx={{ 
          backgroundColor: '#e8f5e9', 
          p: 2, 
          borderRadius: 1,
          textAlign: 'center',
          mt: 2
        }}>
          <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            ✅ You have successfully booked this slot
          </Typography>
        </Box>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => setViewSlotDialogOpen(false)}
      sx={{ borderRadius: '20px' }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      {/* Booking Dialog */}
      <Dialog
        open={slotDetailsDialogOpen}
        onClose={() => setSlotDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedSlotDetails && (
          <>
            <DialogTitle sx={{ 
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '16px 24px'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {selectedSlotDetails.templateName}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {selectedSlotDetails.booked ? 'Your Booking Details' : 'Available Slot Timings'}
                    </Typography>
                    <Chip
                      label={selectedSlotDetails.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(selectedSlotDetails.priority).bgcolor,
                        color: getPriorityColor(selectedSlotDetails.priority).color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.slotDuration}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Open To
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.openTo}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date Range
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.startDate} - {selectedSlotDetails.endDate}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Time
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.fromTime} - {selectedSlotDetails.toTime}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
  <Typography variant="subtitle2" color="textSecondary">
    {selectedSlotDetails.booked ? 'Your Slot Timing' : 'Available Slot Timings'}
  </Typography>
  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
    {Object.entries(groupSlotsByDate(calculateSlotTimings(selectedSlotDetails))).length > 0 ? (
      Object.entries(groupSlotsByDate(calculateSlotTimings(selectedSlotDetails))).map(([date, slots]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {date}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
  {slots.map((slot, index) => (
    <Tooltip 
      key={index} 
      title={slot.booked ? 
        "This timing is fully booked" : 
        `${slot.remaining} spots remaining`}
      placement="top"
    >
      <Chip
        label={`${formatTime(slot.start)} - ${formatTime(slot.end)}`}
        onClick={() => {
          if (slot.booked) {
            setSnackbar({
              open: true,
              message: "This timing is fully booked. Please select another time.",
              severity: "error"
            });
          } else {
            setSelectedTiming(slot);
          }
        }}
        sx={{
          backgroundColor: selectedTiming?.start === slot.start ? '#bbdefb' : 
                          slot.booked ? '#ffebee' : '#e8f5e9',
          border: selectedTiming?.start === slot.start ? '2px solid #1976d2' : 
                 slot.booked ? '1px solid #d32f2f' : '1px solid #2e7d32',
          cursor: slot.booked ? 'not-allowed' : 'pointer',
          color: slot.booked ? '#d32f2f' : '#2e7d32',
          '&:hover': {
            backgroundColor: slot.booked ? '#ffebee' : 
                           selectedTiming?.start === slot.start ? '#bbdefb' : '#e8f5e9'
          }
        }}
        disabled={slot.booked}
      />
    </Tooltip>
  ))}
</Box>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No valid slot timings could be calculated.
      </Typography>
    )}
  </Box>
</Grid>

  
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Faculty Incharge
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.facultyIncharge}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSlotDetails.location}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
           
    
            {!selectedSlotDetails.booked && (
  <Button 
    variant="contained"
    onClick={() => {
      if (!selectedTiming) {
        setSnackbar({
          open: true,
          message: "Please select a timing first",
          severity: "error"
        });
        return;
      }
      if (selectedTiming.booked) {
        setSnackbar({
          open: true,
          message: "This timing is no longer available. Please select another time.",
          severity: "error"
        });
        return;
      }
      handleBookSlot(selectedSlotDetails.id, selectedTiming);
    }}
    disabled={bookingInProgress || !selectedTiming || selectedTiming.booked}
    sx={{ borderRadius: '20px', textTransform: 'none' }}
  >
    {bookingInProgress ? (
      <>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        Booking...
      </>
    ) : (
      "Confirm Booking"
    )}
  </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Booking Preview Dialog */}
      {bookedSlotDetails && (
        <Dialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: "70%",
            },
          }}
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Slot Booking Confirmation
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setPreviewDialogOpen(false)}
                sx={{
                  border: "1px solid red",
                  borderRadius: "50%",
                  color: "red",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {/* Success Message */}
            <Typography 
              variant="body1" 
              sx={{ 
                color: "green",
                fontWeight: 600,
                textAlign: "center",
                width: "100%",
                mb: 3,
                mt: 2
              }}
            >
              ✅ Slot booked successfully!
            </Typography>

            {/* Date, Duration, and Calendar Icon */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Date: <span style={{ fontWeight: 400 }}>
                  {bookedSlotDetails.start_datetime ? new Date(bookedSlotDetails.start_datetime).toLocaleDateString() : 'Not specified'}
                </span>
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Duration: <span style={{ fontWeight: 400 }}>
                  {bookedSlotDetails.slot_duration ? `${bookedSlotDetails.slot_duration} ${bookedSlotDetails.duration_unit.toLowerCase()}` : 'Not specified'}
                </span>
              </Typography>
            </Box>

            {/* Venues List with Arrows */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <IconButton
                onClick={() => handleScroll("left")}
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "5px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>

              <Box
                ref={scrollRef}
                sx={{
                  display: "flex",
                  gap: 1,
                  flexGrow: 1,
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {bookedSlotDetails.venues.map((venue, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: 2,
                      backgroundColor: "#e0f7fa",
                      borderRadius: 2,
                      textAlign: "center",
                      minWidth: "120px",
                      border: "2px solid darkgreen",
                      flexShrink: 0,
                      boxShadow: "0 0 8px rgba(0, 128, 0, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color:"inherit"
                      }}
                    >
                      {venue.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <IconButton
                onClick={() => handleScroll("right")}
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "5px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Slot Timings */}
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
              Your Slot Timing
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
              }}
            >
              {selectedTiming && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedTiming.start.toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={`${formatTime(selectedTiming.start)} - ${formatTime(selectedTiming.end)}`}
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        border: "1px solid darkgreen",
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button 
              variant="contained"
              onClick={() => setPreviewDialogOpen(false)}
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none',
                backgroundColor: "darkgreen",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

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

export default StudentAvailableSlots;
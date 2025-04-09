import React, { useState, useEffect, useRef, useMemo } from "react";
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
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";

const SlotPreview = ({ 
  open, 
  onClose, 
  slot,
  onConfirm,
  loggedInEmail
}) => {
  const scrollRef = useRef(null);
  const [allVenues, setAllVenues] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSubSlots, setAvailableSubSlots] = useState([]);
  const [selectedSubSlot, setSelectedSubSlot] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Extract slot details
  const startDateTime = slot?.start_datetime;
  const endDateTime = slot?.end_datetime;
  const selectedVenues = slot?.venues 
    ? (typeof slot.venues === 'string' ? JSON.parse(slot.venues) : slot.venues)
    : [];
  const slotDuration = slot?.duration || 30; // Default to 30 minutes if not provided
  const durationUnit = "Minutes";
  const numberOfSlots = slot?.number_of_slots || 1; // Default to 1 if not provided
  const breaks = slot?.breaks ? (typeof slot.breaks === 'string' ? JSON.parse(slot.breaks) : slot.breaks) : [];
  const workingHours = slot?.working_hours ? (typeof slot.working_hours === 'string' ? JSON.parse(slot.working_hours) : slot.working_hours) : {};

  // Calculate highlighted dates range
  const highlightedDates = useMemo(() => {
    if (!startDateTime || !endDateTime) return [];
    
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    const dates = [];
    
    // If same day, just return that date
    if (startDate.toDateString() === endDate.toDateString()) {
      return [startDate];
    }
    
    // Add all dates in the range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }, [startDateTime, endDateTime]);

  // Calculate day count for the calendar icon badge
  const dayCount = useMemo(() => {
    return highlightedDates.length;
  }, [highlightedDates]);

  // Calculate available sub-slots
  useEffect(() => {
    if (!startDateTime || !endDateTime) return;

    const calculateSubSlots = () => {
      const subSlots = [];
      let currentTime = new Date(startDateTime);
      const endTime = new Date(endDateTime);
      
      // Default breaks if not provided
      const defaultBreaks = [
        { start: 10 + 35/60, end: 10 + 50/60 },  // 10:35-10:50
        { start: 12 + 30/60, end: 13 + 30/60 },   // 12:30-13:30
        { start: 15 + 20/60, end: 15 + 35/60 }    // 15:20-15:35
      ];
      
      const effectiveBreaks = breaks.length > 0 ? breaks : defaultBreaks;
      
      // Default working hours if not provided (9:00-16:30)
      const defaultWorkingHours = { 
        start: 9, 
        end: 16 + 30/60 
      };
      
      const effectiveWorkingHours = workingHours.start ? workingHours : defaultWorkingHours;
      
      // Calculate all possible slots first
      const allPossibleSlots = [];
      
      while (currentTime < endTime) {
        const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
        
        // Check working hours and weekends
        if (currentHour < effectiveWorkingHours.start || currentHour >= effectiveWorkingHours.end || 
            currentTime.getDay() === 0) {
          currentTime.setDate(currentTime.getDate() + 1);
          currentTime.setHours(effectiveWorkingHours.start, 0, 0, 0);
          continue;
        }
    
        // Check if currently in a break
        const currentBreak = effectiveBreaks.find(b => currentHour >= b.start && currentHour < b.end);
        if (currentBreak) {
          currentTime.setHours(
            Math.floor(currentBreak.end),
            (currentBreak.end % 1) * 60,
            0, 0
          );
          continue;
        }
    
        // Calculate potential end time for this slot
        const slotEnd = new Date(currentTime);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
        
        // If slot would go past our overall end time, stop
        if (slotEnd > endTime) break;
        
        const endHour = slotEnd.getHours() + (slotEnd.getMinutes() / 60);
    
        // Check if slot would cross a break
        const overlappingBreak = effectiveBreaks.find(b => {
          const slotStart = currentHour;
          const slotEnd = endHour;
          return slotStart < b.end && slotEnd > b.start;
        });
    
        if (overlappingBreak) {
          // If we can complete the slot before break starts
          if (currentHour <= overlappingBreak.start && 
              (currentHour + slotDuration/60) <= overlappingBreak.start) {
            allPossibleSlots.push({
              start: new Date(currentTime),
              end: slotEnd,
              id: `${slot.id}_${currentTime.getTime()}`
            });
            currentTime = new Date(slotEnd);
          } 
          // If slot would span the break
          else {
            // Move to after break
            currentTime.setHours(
              Math.floor(overlappingBreak.end),
              (overlappingBreak.end % 1) * 60,
              0, 0
            );
          }
          continue;
        }
    
        // Check if would go past working hours
        if (endHour > effectiveWorkingHours.end) {
          currentTime.setDate(currentTime.getDate() + 1);
          currentTime.setHours(effectiveWorkingHours.start, 0, 0, 0);
          continue;
        }
    
        // Valid slot - add it
        allPossibleSlots.push({
          start: new Date(currentTime),
          end: slotEnd,
          id: `${slot.id}_${currentTime.getTime()}`
        });
        
        currentTime = new Date(slotEnd);
      }
      
      // Now filter based on number_of_slots
      const availableSlots = allPossibleSlots.slice(0, numberOfSlots);
      setAvailableSubSlots(availableSlots);
    };

    calculateSubSlots();
  }, [startDateTime, endDateTime, slotDuration, numberOfSlots, breaks, workingHours, slot?.id]);

  // Fetch all venues from backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/venues');
        const venuesData = response.data.map(v => ({
          id: v.venue_id || v.id,
          name: v.venue_name || v.name,
          isSelected: false
        }));
        
        if (selectedVenues && selectedVenues.length > 0) {
          const selectedIds = selectedVenues.map(v => v.id || v.venue_id);
          const selectedNames = selectedVenues.map(v => v.name || v.venue_name);
          venuesData.forEach(venue => {
            venue.isSelected = selectedIds.includes(venue.id) || 
                              selectedNames.includes(venue.name);
          });
        }
        
        setAllVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setAllVenues([]);
      }
    };

    if (open) {
      fetchVenues();
    }
  }, [open, selectedVenues]);

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

  const handleConfirmAndClose = async () => {
    if (!selectedSubSlot) {
      setSnackbar({
        open: true,
        message: "Please select a time slot",
        severity: "error"
      });
      return;
    }

    try {
      await onConfirm(selectedSubSlot);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error confirming booking:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to book slot",
        severity: "error"
      });
    }
  };

  // Format time as "h:mm am/pm"
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            Book Training Slot
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
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
        {/* Date, Duration, and Calendar Icon */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 2,
            paddingTop: 2,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Date: <span style={{ fontWeight: 400 }}>
              {startDateTime ? new Date(startDateTime).toLocaleDateString() : 'Not specified'}
            </span>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "relative",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            <CalendarTodayIcon sx={{ color: "darkgreen" }} />
            {dayCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "darkgreen",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  zIndex: 1,
                }}
              >
                {dayCount}
              </Box>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Duration: <span style={{ fontWeight: 400 }}>
              {slotDuration} {durationUnit.toLowerCase()}
            </span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Available Slots: <span style={{ fontWeight: 400 }}>
              {numberOfSlots}
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
            {allVenues.map((venue, index) => (
              <Box
                key={index}
                sx={{
                  padding: 2,
                  backgroundColor: venue.isSelected ? "#e0f7fa" : "#f5f5f5",
                  borderRadius: 2,
                  textAlign: "center",
                  minWidth: "120px",
                  border: venue.isSelected ? "2px solid darkgreen" : "2px solid transparent",
                  flexShrink: 0,
                  boxShadow: venue.isSelected ? "0 0 8px rgba(0, 128, 0, 0.2)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: venue.isSelected ? "darkgreen" : "inherit"
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

        {/* Available Sub-Slots */}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
          Available Time Slots ({availableSubSlots.length} of {numberOfSlots})
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {availableSubSlots.length > 0 ? (
            availableSubSlots.map((subSlot) => (
              <Button
                key={subSlot.id}
                variant={selectedSubSlot?.id === subSlot.id ? "contained" : "outlined"}
                color="primary"
                onClick={() => setSelectedSubSlot(subSlot)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: '120px',
                  backgroundColor: selectedSubSlot?.id === subSlot.id ? '#3f51b5' : 'transparent',
                  '&:hover': {
                    backgroundColor: selectedSubSlot?.id === subSlot.id ? '#303f9f' : '#f5f5f5',
                  }
                }}
              >
                {formatTime(subSlot.start)} - {formatTime(subSlot.end)}
              </Button>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No available time slots found for this session.
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                borderColor: "red",
                color: "red",
                width: "48%",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmAndClose}
              disabled={!selectedSubSlot}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: "darkgreen",
                width: "48%",
                "&:hover": {
                  backgroundColor: "green",
                },
                "&:disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#a0a0a0"
                }
              }}
            >
              Confirm Booking
            </Button>
          </Box>
          
          {/* Success Message */}
          {showSuccess && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: "green",
                fontWeight: 600,
                textAlign: "center",
                width: "100%",
              }}
            >
              ✅ Slot booked successfully!
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const StudentAvailableSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const loggedInEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/slot-schedules/for-student/${loggedInEmail}`
        );
        console.log("Available slots response:", response.data);
        setSlots(response.data.data?.slots || []);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch available slots",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (loggedInEmail) {
      fetchAvailableSlots();
    }
  }, [loggedInEmail]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No time';
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      
      // Handle HH:MM strings
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      console.error("Error formatting time:", e);
      return timeString;
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
  };

  const handleConfirmBooking = async (subSlot) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/slot-schedules/book-slot`,
        {
          slotId: selectedSlot.id,
          studentEmail: loggedInEmail,
          startTime: subSlot.start.toISOString(),
          endTime: subSlot.end.toISOString()
        }
      );
      
      setSnackbar({
        open: true,
        message: "Slot booked successfully!",
        severity: "success"
      });
      
      // Refresh the slots list
      const refreshResponse = await axios.get(
        `http://localhost:8000/api/slot-schedules/for-student/${loggedInEmail}`
      );
      setSlots(refreshResponse.data.data?.slots || []);
      
      return response.data;
    } catch (error) {
      console.error("Error booking slot:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to book slot. Please try again.",
        severity: "error"
      });
      throw error;
    }
  };

  const filteredSlots = slots.filter((slot) => {
    return (
      slot.template_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (slot.faculties && typeof slot.faculties === 'string' 
        ? JSON.parse(slot.faculties).some(f => 
            f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : Array.isArray(slot.faculties) 
          ? slot.faculties.some(f => 
              f.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : false) ||
      (slot.venues && typeof slot.venues === 'string' 
        ? JSON.parse(slot.venues).some(v => 
            v.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : Array.isArray(slot.venues) 
          ? slot.venues.some(v => 
              v.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : false)
    );
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f6fa", minHeight: "100vh", padding: "16px", width: "88vw" }}>
      {/* Header Section */}
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
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
              Available Training Slots
            </Typography>
            <Chip 
              label={`${filteredSlots.length} Slots`} 
              sx={{ backgroundColor: "#e3f2fd", color: "#2196f3", fontWeight: "bold" }} 
            />
          </Box>
        </Box>

        <Box sx={{ padding: "0 16px 16px 16px" }}>
          <Typography variant="body1" sx={{ color: "#616161" }}>
            View and book available training slots for your year.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ padding: "0 16px 16px 16px" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by skill, faculty or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ 
              startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
              sx: { borderRadius: "20px" }
            }}
            sx={{ backgroundColor: "#ffffff" }}
          />
        </Box>

        {/* Slots Table */}
        <TableContainer component={Paper} sx={{ marginBottom: "16px", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Skill</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Faculty</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Available Slots</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Open To</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => {
                  const faculties = slot.faculties 
                    ? (typeof slot.faculties === 'string' 
                        ? JSON.parse(slot.faculties) 
                        : slot.faculties)
                    : [];
                  const venues = slot.venues 
                    ? (typeof slot.venues === 'string' 
                        ? JSON.parse(slot.venues) 
                        : slot.venues)
                    : [];

                  return (
                    <TableRow key={slot.id} hover>
                      <TableCell>
                        <Chip 
                          label={slot.template_name || 'No Skill'} 
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        {faculties.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {faculties.map((faculty, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#3f51b5', fontSize: '0.8rem' }}>
                                  {faculty.name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{faculty.name}</Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">No faculty</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(slot.start_datetime)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {formatTime(slot.start_datetime)} - {formatTime(slot.end_datetime)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {venues.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {venues.map((venue, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon color="primary" fontSize="small" />
                                <Typography variant="body2">{venue.name}</Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">No location</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={slot.number_of_slots || 'N/A'} 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={slot.open_to || 'All students'} 
                          sx={{ 
                            backgroundColor: slot.open_to === 'All students' 
                              ? '#e3f2fd' 
                              : '#e8f5e9',
                            color: slot.open_to === 'All students' 
                              ? '#2196f3' 
                              : '#2e7d32'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<BookIcon />}
                          onClick={() => handleBookSlot(slot)}
                          sx={{ textTransform: 'none', borderRadius: '20px' }}
                          disabled={slot.number_of_slots <= 0}
                        >
                          {slot.number_of_slots <= 0 ? "No Slots" : "Book Slot"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {searchQuery ? "No slots match your search" : "No available slots found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Slot Booking Preview Dialog */}
      {selectedSlot && (
        <SlotPreview
          open={openDialog}
          onClose={handleCloseDialog}
          slot={selectedSlot}
          onConfirm={handleConfirmBooking}
          loggedInEmail={loggedInEmail}
        />
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
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Calendar from "../schedules_template/Calendar";
import axios from "axios";

const SlotPreview = ({ 
  open, 
  onClose, 
  selectedVenues,
  startDateTime,
  slotDuration,
  durationUnit,
  endDateTime,
  numberOfSlots,
  onConfirm,
  onCancel 
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const scrollRef = useRef(null);
  const [allVenues, setAllVenues] = useState([]);
  const navigate = useNavigate(); 
  const [showSuccess, setShowSuccess] = useState(false); 
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

  // Calculate slot timings based on start time, duration, and number of slots
  const slotTimings = useMemo(() => {
    if (!startDateTime || !slotDuration || !numberOfSlots) return [];
  
    const timings = [];
    let currentTime = new Date(startDateTime);
    let slotsRemaining = parseInt(numberOfSlots);
    const durationInMinutes = durationUnit === "Hours" ? 
      parseInt(slotDuration) * 60 : parseInt(slotDuration);
  
    const breaks = [
      { start: 10 + 35/60, end: 10 + 50/60 },  // 10:35-10:50
      { start: 12 + 30/60, end: 13 + 30/60 },   // 12:30-13:30
      { start: 15 + 20/60, end: 15 + 35/60 }    // 15:20-15:35
    ];
    const workingHours = { start: 9, end: 16 + 30/60 }; // 9:00-16:30
  
    while (slotsRemaining > 0) {
      const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
      
      // Check if it's a weekend
      if (currentTime.getDay() === 0) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Check if outside working hours
      if (currentHour < workingHours.start) {
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
      
      if (currentHour >= workingHours.end) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Check if currently in a break
      const currentBreak = breaks.find(b => currentHour >= b.start && currentHour < b.end);
      if (currentBreak) {
        currentTime.setHours(
          Math.floor(currentBreak.end),
          (currentBreak.end % 1) * 60,
          0, 0
        );
        continue;
      }
  
      // Calculate potential end time
      const endTime = new Date(currentTime);
      endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
      const endHour = endTime.getHours() + (endTime.getMinutes() / 60);
  
      // Check if slot would cross a break
      const overlappingBreak = breaks.find(b => {
        return (currentHour < b.end && endHour > b.start);
      });
  
      if (overlappingBreak) {
        // Move to after the break
        currentTime.setHours(
          Math.floor(overlappingBreak.end),
          (overlappingBreak.end % 1) * 60,
          0, 0
        );
        continue;
      }
  
      // Check if would go past working hours
      if (endHour > workingHours.end) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Valid slot - add it
      timings.push({
        date: new Date(currentTime),
        start: new Date(currentTime),
        end: endTime
      });
      
      // Move to next slot time (immediately after this slot ends)
      currentTime = new Date(endTime);
      slotsRemaining--;
    }
  
    return timings;
  }, [startDateTime, slotDuration, durationUnit, numberOfSlots]);
  // Group slots by date
  const groupedSlots = useMemo(() => {
    const groups = {};
    slotTimings.forEach(slot => {
      const dateKey = slot.date.toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(slot);
    });
    return groups;
  }, [slotTimings]);

  // Format time as "h:mm am/pm"
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

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
    try {
      await onConfirm();
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose(); // Close the preview dialog
        // Now properly call onCancel to navigate back to SchedulesManager
        if (onCancel) {
          onCancel();
        }
      }, 3000);
    } catch (error) {
      console.error('Error confirming slots:', error);
    }
  };

  return (
    <>
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
              Slot Creation Preview
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
              onClick={() => setCalendarOpen(true)}
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
                {slotDuration ? `${slotDuration} ${durationUnit.toLowerCase()}` : 'Not specified'}
              </span>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Slots: <span style={{ fontWeight: 400 }}>
                {numberOfSlots || '0'}
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
                    border:  "2px solid darkgreen" ,
                    flexShrink: 0,
                    boxShadow: venue.isSelected ? "0 0 8px rgba(0, 128, 0, 0.2)" : "none",
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
            Slot Timings ({slotTimings.length} slots)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 3,
            }}
          >
            {Object.entries(groupedSlots).length > 0 ? (
              Object.entries(groupedSlots).map(([date, slots]) => (
                <Box key={date}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {date}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {slots.map((slot, index) => (
                      <Chip
                        key={index}
                        label={`${formatTime(slot.start)} - ${formatTime(slot.end)}`}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 2,
                          border: "1px solid darkgrey",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No valid slot timings calculated. Please check your inputs.
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
              onClick={handleConfirmAndClose} // Use the new handler
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: "darkgreen",
                width: "48%",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
            >
              Confirm Slots
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
              ✅ Slots published Successfully!
            </Typography>
          )}
        </Box>
        </DialogContent>
      </Dialog>

      {/* Calendar Popup */}
      <Calendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDates={highlightedDates}
      />
    </>
  );
};

export default SlotPreview;
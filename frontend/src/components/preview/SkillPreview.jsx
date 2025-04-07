import React, { useState, useRef } from "react";
import axios from "axios";
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

const SkillPreview = ({ open, onClose, data, onTabChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const scrollRef = useRef(null);

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

  const handleConfirm = async () => {
    if (!data.templateName || !data.skill || !data.priority || 
        !data.selectedDates || data.selectedDates.length === 0 || 
        !data.startTime || !data.duration || 
        !data.assignedLevels || data.assignedLevels.length === 0) {
      setErrorMessage("❌ Fill all fields before confirming schedule");
      setSuccessMessage("");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/skill-schedules", {
        templateName: data.templateName,
        skillName: data.skill,
        priority: data.priority,
        selectedDates: data.selectedDates.map(date => new Date(date).toISOString().split('T')[0]),
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        status: "Confirmed",
        level: data.assignedLevels[0].level, // Assuming same level for all
        venues: data.assignedLevels.map(level => ({
          venue_id: level.venueId,
          venue_name: level.venue
        })),
        faculties: data.assignedLevels.map(level => ({
          id: level.facultyId,
          name: level.faculty
        }))
      });
  
      setSuccessMessage("✅ Skill Scheduled Successfully!");
      setErrorMessage("");
  
      setTimeout(() => {
        if (onTabChange) {
          onTabChange("schedules");
        }
      }, 3000);
    } catch (error) {
      console.error("Error confirming schedule:", error);
      setErrorMessage("❌ Failed to confirm schedule. Please try again.");
      setSuccessMessage("");
    }
  };

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get all unique venues (both selected and available)
  const allVenues = [...new Set([
    ...data.assignedLevels.map(level => level.venueId),
    ...data.availableVenues?.map(venue => venue.venue_id) || []
  ])].map(venueId => {
    const assignedVenue = data.assignedLevels.find(level => level.venueId === venueId);
    const availableVenue = data.availableVenues?.find(v => v.venue_id === venueId);
    
    return {
      venueId,
      venueName: assignedVenue?.venue || availableVenue?.venue_name || "Unknown Venue",
      isSelected: !!assignedVenue,
      level: assignedVenue?.level || "",
      faculty: assignedVenue?.faculty || ""
    };
  });

  const firstDate = data.selectedDates.length > 0 
    ? new Date(data.selectedDates[0]).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : "No date selected";

  const dayCount = data.selectedDates.length;

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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Skill Schedule Preview
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                border: "1px solid red",
                borderRadius: "50%",
                color: "red",
                padding: "4px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Template Name and Skill */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Template: <span style={{ fontWeight: 400 }}>{data.templateName}</span>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Skill: <span style={{ fontWeight: 400 }}>{data.skill}</span>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Priority: <span style={{ 
                fontWeight: 400, 
                color: data.priority === "High" ? "red" : 
                      data.priority === "Medium" ? "orange" : "blue"
              }}>
                {data.priority}
              </span>
            </Typography>
          </Box>

          {/* Date, Duration, and Calendar Icon */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, paddingTop: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Date: <span style={{ fontWeight: 400 }}>{firstDate}</span>
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative", 
                   marginLeft: "10px", cursor: "pointer" }}
              onClick={() => setCalendarOpen(true)}
            >
              <CalendarTodayIcon sx={{ color: "darkgreen" }} />
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
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Duration: <span style={{ fontWeight: 400 }}>{data.duration}</span>
            </Typography>
          </Box>

          {/* Venues List with Arrows */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <IconButton
              onClick={() => handleScroll("left")}
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "5px",
                "&:hover": { backgroundColor: "#e0e0e0" },
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
                "&::-webkit-scrollbar": { display: "none" },
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
                    border: "2px solid darkgreen",
                    flexShrink: 0,
                    boxShadow: venue.isSelected ? "0 0 8px rgba(0, 128, 0, 0.2)" : "none",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {venue.venueName}
                  </Typography>
                </Box>
              ))}
            </Box>

            <IconButton
              onClick={() => handleScroll("right")}
              sx={{
                backgroundColor: "#f5f5f5",
                padding: "5px",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Schedule Details */}
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            Schedule Details
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Chip
              label={`${formatTime12Hour(data.startTime)} - ${formatTime12Hour(data.endTime)}`}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                border: "1px solid darkgrey",
                fontWeight: 100,
                fontSize: "0.875rem",
              }}
            />
          </Box>

          {/* Error and Success Messages */}
          {errorMessage && (
            <Typography variant="body2" sx={{ color: "red", fontWeight: 600, textAlign: "right", mb: 1 }}>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body2" sx={{ color: "darkgreen", fontWeight: 600, textAlign: "right", mb: 1 }}>
              {successMessage}
            </Typography>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                borderColor: "red",
                color: "red",
                width: "48%",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: "darkgreen",
                width: "48%",
                "&:hover": { backgroundColor: "green" },
              }}
            >
              Confirm Schedule
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Calendar Popup */}
      <Calendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDates={data.selectedDates}
      />
    </>
  );
};

export default SkillPreview;
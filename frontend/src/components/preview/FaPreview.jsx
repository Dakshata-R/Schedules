import React, { useState, useRef } from "react";
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

const FaPreview = ({
  open,
  onClose,
  selectedVenues,
  startDate,
  duration,
  durationUnit,
  startTime,
  mode,
  venues,
  year,
  department,
  syllabusTopic,
  courseCode,
  faType,
  priority,
  selectedFaculties,
  onTabChange,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const scrollRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const date = new Date(`01/01/2000 ${time} GMT+0530`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const calculateEndTime = () => {
    if (!startTime || !duration) return "";
    const start = new Date(`01/01/2000 ${startTime} GMT+0530`);
    const durationInMinutes = durationUnit === "Hours" ? duration * 60 : duration;
    const end = new Date(start.getTime() + durationInMinutes * 60000);
    return formatTime12Hour(end.toLocaleTimeString("en-IN", { hour12: false }));
  };

  const endTime = calculateEndTime();

  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formattedDate = isValidDate(startDate) 
    ? new Date(startDate).toLocaleDateString("en-GB") 
    : "No date selected";

  const validStartDate = isValidDate(startDate) 
    ? new Date(startDate) 
    : new Date();
  const localStartDate = new Date(validStartDate);
  localStartDate.setHours(0, 0, 0, 0);

  const handleConfirmSchedule = async () => {
    if (!startDate || !startTime || !duration || !year || !department || 
        (!syllabusTopic && !courseCode) || (mode === "Offline" && selectedVenues.length === 0)) {
      setErrorMessage("❌ Please fill all required fields before confirming");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const faData = {
        fa_type: faType,
        priority: priority,
        start_date: startDate,
        start_time: startTime,
        duration: duration,
        duration_unit: durationUnit,
        year: parseInt(year),
        department: department,
        course_code: courseCode || null,
        syllabus_topic: syllabusTopic || null,
        mode: mode,
        venues: mode === "Offline" ? JSON.stringify(selectedVenues) : null,
        faculties: JSON.stringify(selectedFaculties)
      };

      const response = await axios.post("http://localhost:8000/api/fa-schedules", faData);
      console.log("✅ FA Scheduled:", response.data);
      
      setSuccessMessage("✅ FA Scheduled Successfully!");
      setErrorMessage("");

      setTimeout(() => {
        onClose();
        if (onTabChange) {
          onTabChange("schedules");
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Error saving FA:", error);
      setErrorMessage("❌ Failed to schedule FA. Please try again.");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
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
              FA Creation Preview
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
              Date: <span style={{ fontWeight: 400 }}>{formattedDate}</span>
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
                1
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Duration: <span style={{ fontWeight: 400 }}>{duration} {durationUnit}</span>
            </Typography>
          </Box>

          {/* Venues List with Arrows (Only for Offline Mode) */}
          {mode === "Offline" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              {selectedVenues.length > 0 && (
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
              )}

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
                {selectedVenues.length > 0 ? (
                  selectedVenues.map((venue, index) => (
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
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {venue.venue_name}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary", alignSelf: "center" }}>
                    No venues selected
                  </Typography>
                )}
              </Box>

              {selectedVenues.length > 0 && (
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
              )}
            </Box>
          )}

          {/* Slot Timings */}
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            Slot Timings
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Chip
              label={`${formatTime12Hour(startTime)} - ${endTime}`}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                border: "1px solid darkgrey",
              }}
            />
          </Box>

          {/* Additional FA Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              FA Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1">
                <strong>Type:</strong> {faType || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Priority:</strong> {priority || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {year || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong> {department || 'Not specified'}
              </Typography>
              {courseCode && (
                <Typography variant="body1">
                  <strong>Course Code:</strong> {courseCode}
                </Typography>
              )}
              {syllabusTopic && (
                <Typography variant="body1">
                  <strong>Syllabus Topic:</strong> {syllabusTopic}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
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
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: "darkgreen",
                width: "48%",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
              onClick={handleConfirmSchedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </Box>

          {/* Success and Error Messages */}
          {successMessage && (
            <Typography
              variant="body1"
              sx={{ color: "green", fontWeight: "bold", mt: 2, textAlign: "center" }}
            >
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography
              variant="body1"
              sx={{ color: "red", fontWeight: "bold", mt: 2, textAlign: "center" }}
            >
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar Popup */}
      <Calendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDates={isValidDate(startDate) ? [startDate] : []}
      />
    </>
  );
};

export default FaPreview;
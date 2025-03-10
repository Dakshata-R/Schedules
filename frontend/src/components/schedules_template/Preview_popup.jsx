import React, { useState } from "react";
import { useRef } from "react";
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
import Calendar from "./Calendar"; // Ensure this path is correct

const Preview_popup = ({ open, onClose }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const startDate = new Date(2025, 0, 14); // 14/01/2025
  const dayCount = 3; // Number of days to highlight
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150; // Adjust scroll amount as needed
      if (direction === "left") {
        scrollRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };
  // Mock data for venues (replace with actual data from template_area)
  const venues = ["Hall A", "Room 101", "Conference Room", "Auditorium", "Seminar Hall", "Main Auditorium"];

  // Mock data for slot timings (replace with actual data from template_area)
  const slotTimings = ["09:00 am", "10:00 am", "11:00 am", "12:00 pm"];

  return (
    <>
      {/* Main Dialog */}
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
              Date: <span style={{ fontWeight: 400 }}>14/01/2025</span>
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
                {dayCount}
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Duration: <span style={{ fontWeight: 400 }}>30 mins</span>
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
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                "&::-webkit-scrollbar": {
                  display: "none", // Hide scrollbar for Chrome/Safari
                },
              }}
            >
              {venues.map((venue, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: "120px",
                    border: "1px solid darkgreen",
                    flexShrink: 0, // Prevents items from resizing
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {venue}
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
            {slotTimings.map((time, index) => (
              <Chip
                key={index}
                label={time}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  border: "1px solid darkgrey",
                }}
              />
            ))}
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
            >
              Confirm Slots
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Calendar Popup */}
      <Calendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={startDate}
        dayCount={dayCount}
      />
    </>
  );
};

export default Preview_popup;
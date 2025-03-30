import React, { useState, useRef, useEffect } from "react";
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
import axios from "axios";
import Calendar from "../schedules_template/Calendar";

const Meetingpreview = ({ open, onClose, meetingDetails }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(meetingDetails.venue);
  const [fetchedVenues, setFetchedVenues] = useState([]);
  const scrollRef = useRef(null);

  // Destructure meeting details
  const { meetingTitle, meetingAgenda, date, startTime, endTime, venue } = meetingDetails;

  // Fetch venues from the backend when dialog opens
  useEffect(() => {
    if (open) {
      axios
        .get("http://localhost:5000/api/venues")
        .then((response) => setFetchedVenues(response.data))
        .catch((error) => console.error("Error fetching venues:", error));
    }
  }, [open]);

  // Handle scroll for venues
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollLeft += direction === "right" ? scrollAmount : -scrollAmount;
    }
  };

  // Calculate meeting duration
  const calculateDuration = (start, end) => {
    const startTime = new Date(`01/01/2000 ${start}`);
    const endTime = new Date(`01/01/2000 ${end}`);
    return `${(endTime - startTime) / (1000 * 60)} mins`;
  };

  const duration = calculateDuration(startTime, endTime);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, width: "70%" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Meeting Title */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Meeting Title
            </Typography>
            <Typography>{meetingTitle}</Typography>
          </Box>

          {/* Meeting Agenda */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Meeting Agenda
            </Typography>
            <Typography>{meetingAgenda}</Typography>
          </Box>

          {/* Date, Duration, and Calendar Icon */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, paddingTop: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Date: <span style={{ fontWeight: 400 }}>{date}</span>
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
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Duration: <span style={{ fontWeight: 400 }}>{duration}</span>
            </Typography>
          </Box>

          {/* Venues List with Arrows */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <IconButton onClick={() => handleScroll("left")} sx={{ backgroundColor: "#f5f5f5", padding: "5px" }}>
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
              {fetchedVenues.map((venueItem, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedVenue(venueItem.name)}
                  sx={{
                    padding: 2,
                    backgroundColor: venueItem.name === selectedVenue ? "darkgreen" : "white",
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: "120px",
                    border: `1px solid ${venueItem.name === selectedVenue ? "darkgreen" : "darkgrey"}`,
                    flexShrink: 0,
                    cursor: "pointer",
                    color: venueItem.name === selectedVenue ? "white" : "inherit",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {venueItem.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            <IconButton onClick={() => handleScroll("right")} sx={{ backgroundColor: "#f5f5f5", padding: "5px" }}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Time Information */}
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            Time
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Chip label={`Start: ${startTime}`} sx={{ backgroundColor: "white", borderRadius: 2, border: "1px solid darkgrey" }} />
            <Chip label={`End: ${endTime}`} sx={{ backgroundColor: "white", borderRadius: 2, border: "1px solid darkgrey" }} />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 1, textTransform: "none", borderColor: "red", color: "red" }}>
              Cancel
            </Button>
            <Button variant="contained" sx={{ borderRadius: 1, textTransform: "none", backgroundColor: "darkgreen" }}>
              Confirm Slots
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog */}
      <Calendar open={calendarOpen} onClose={() => setCalendarOpen(false)} startDate={new Date(date)} dayCount={1} />
    </>
  );
};

export default Meetingpreview;
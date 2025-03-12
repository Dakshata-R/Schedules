import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select } from "@mui/material";
import Add_venue_popup from "./Add_venue_popup";

const Template_area = () => {
  const [priority, setPriority] = useState(""); // State for priority selection
  const [frequency, setFrequency] = useState("Once"); // State for frequency selection
  const [slotDuration, setSlotDuration] = useState(""); // State for slot duration (empty initially)
  const [numberOfSlots, setNumberOfSlots] = useState(""); // State for number of slots (empty initially)
  const [durationUnit, setDurationUnit] = useState("Minutes"); // State for duration unit (Minutes/Hours)
  const [startDateTime, setStartDateTime] = useState(""); // State for start date-time
  const [endDateTime, setEndDateTime] = useState(""); // State for end date-time
  const [venue, setVenue] = useState(""); // State for venue
  const [openTo, setOpenTo] = useState("All students"); // State for "Open to" dropdown
  const [participants, setParticipants] = useState(""); // State for participants/roles
  const [slotsPerStudent, setSlotsPerStudent] = useState(""); // State for slots per student
  const [slotsPerFaculty, setSlotsPerFaculty] = useState(""); // State for slots per faculty

  // Function to calculate end date and time
  const calculateEndDateTime = () => {
    if (!slotDuration || !numberOfSlots || !startDateTime) {
      return; // Skip calculation if any input is missing
    }

    let currentDate = new Date(startDateTime);
    let slotsRemaining = parseInt(numberOfSlots);
    let duration = parseInt(slotDuration);

    // Convert duration based on selected unit (Minutes or Hours)
    let durationInMinutes = durationUnit === "Hours" ? duration * 60 : duration;

    while (slotsRemaining > 0) {
      // Move to the next slot
      currentDate.setMinutes(currentDate.getMinutes() + durationInMinutes);

      // Check if the new time falls in non-working hours
      let hours = currentDate.getHours();
      let isNonWorkingHours = hours < 9 || hours >= 16.5; // 16.5 means 4:30 PM

      // Check if the day is Sunday (0 = Sunday)
      let isSunday = currentDate.getDay() === 0;

      if (isNonWorkingHours || isSunday) {
        // Move to next working day at 9:00 AM
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(9, 0, 0, 0); // Reset time to 9:00 AM
      } else {
        // Valid working time, decrease the slots count
        slotsRemaining--;
      }
    }

    // ✅ Ensure correct format for datetime-local input
    const formatDateForInput = (date) => {
      let yyyy = date.getFullYear();
      let mm = String(date.getMonth() + 1).padStart(2, "0");
      let dd = String(date.getDate()).padStart(2, "0");
      let hh = String(date.getHours()).padStart(2, "0");
      let min = String(date.getMinutes()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };

    setEndDateTime(formatDateForInput(currentDate));
  };

  // Trigger calculation when slot duration, number of slots, or start date changes
  useEffect(() => {
    calculateEndDateTime();
  }, [slotDuration, numberOfSlots, startDateTime, durationUnit]);

  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);

  // Dummy venues data
  const venues = [
    { id: 1, name: "SF Seminar hall", capacity: "300", type: "Seminar Hall" },
    { id: 2, name: "WW101", capacity: "60", type: "Lab" },
    { id: 3, name: "IT lab 01", capacity: "60 per lab", type: "Lab" },
    { id: 4, name: "Mech Drawing hall", capacity: "100", type: "Drawing Hall" },
    { id: 5, name: "Textile seminar hall", capacity: "100", type: "Seminar Hall" },
    { id: 6, name: "EEE Seminar hall", capacity: "300", type: "Seminar Hall" },
    { id: 7, name: "EW101", capacity: "60", type: "Lab" },
    { id: 8, name: "CSE lab 01", capacity: "60 per lab", type: "Lab" },
    { id: 9, name: "SF Drawing hall", capacity: "100", type: "Drawing Hall" },
    { id: 10, name: "CSE seminar hall", capacity: "100", type: "Seminar Hall" }, 
  ];

  // Handle venue selection from popup
  const handleVenueSelection = (selectedVenues) => {
    setSelectedVenues(selectedVenues);
    setVenuePopupOpen(false);};

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%", // Full width
        p: 3, // Padding around
      }}
    >
      <Box
        sx={{
          width: "90%", // Adjust width as needed
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 3, // Padding inside
        }}
      >
        {/* Schedule Template Name */}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Schedule Template Name
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter template name"
          variant="outlined"
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 1,
            mb: 2, // Space below
          }}
        />

        {/* Set Priority */}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Set Priority
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { label: "High", color: "red" },
            { label: "Medium", color: "orange" },
            { label: "Low", color: "blue" },
          ].map((item) => (
            <Button
              key={item.label}
              variant={priority === item.label ? "contained" : "outlined"}
              sx={{
                color: priority === item.label ? "white" : item.color,
                borderColor: item.color,
                backgroundColor: priority === item.label ? item.color : "transparent",
                "&:hover": { backgroundColor: item.color, color: "white" },
                borderRadius: 2,
                mb: 2, // Space below
              }}
              onClick={() => setPriority(item.label)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Frequency of Schedule */}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Frequency of Schedule
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            aria-label="frequency"
            name="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            sx={{ display: "flex", flexDirection: "row", gap: 2 }}
          >
            <FormControlLabel value="Once" control={<Radio sx={{color: "darkgreen", "&.Mui-checked": {color: "darkgreen"}}}/>} label="Once" />
            <FormControlLabel value="Weekly" control={<Radio sx={{color: "darkgreen", "&.Mui-checked": {color: "darkgreen"}}}/>} label="Weekly" />
            <FormControlLabel value="Monthly" control={<Radio sx={{color: "darkgreen", "&.Mui-checked": {color: "darkgreen"}}}/>} label="Monthly" />
          </RadioGroup>
        </FormControl>

        {/* Set Slot Duration and Number of Slots */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          {/* Set Slot Duration */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Set Slot Duration
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                sx={{
                  width: "100px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "40px", // Reduced height
                  },
                }}
              />
              <FormControl sx={{ minWidth: "120px" }}>
                <Select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  sx={{
                    height: "40px", // Reduced height
                    backgroundColor: "#f8f9fa",
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="Minutes">Minutes</MenuItem>
                  <MenuItem value="Hours">Hours</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Number of Slots */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Number of Slots
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                type="number"
                value={numberOfSlots}
                onChange={(e) => setNumberOfSlots(e.target.value)}
                sx={{
                  width: "100px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "40px", // Reduced height
                  },
                }}
              />
              <Typography variant="body1">slots</Typography>
            </Box>
          </Box>
        </Box>

        {/* Start and End Date-Time Fields */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          {/* Start Date-Time */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Start
            </Typography>
            <TextField
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: "40px", // Reduced height
                },
              }}
            />
          </Box>

          {/* End Date-Time */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              End
            </Typography>
            <TextField
              type="datetime-local"
              value={endDateTime}
              disabled // Disable the end date-time field as it's calculated automatically
              sx={{
                width: "100%",
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: "40px", // Reduced height
                },
              }}
            />
          </Box>
        </Box>

        {/* Add Location/Venue Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Add Location/Venue
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Venue"
            value={selectedVenues.map((venue) => venue.name).join(", ")}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "40px",
              },
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "darkgreen",
                    border: "1px solid darkgreen",
                    height: "30px",
                    minWidth: "20%",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                      color: "white",
                    },
                  }}
                  onClick={() => setVenuePopupOpen(true)} // Open the popup
                >
                  Add Venue
                </Button>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Add Venue Popup */}
      <Add_venue_popup
        open={venuePopupOpen}
        onClose={handleVenueSelection}
        venues={venues}
      />


        {/* Open to and Participants/Roles */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          {/* Open to */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Open to
            </Typography>
            <FormControl fullWidth>
              <Select
                value={openTo}
                onChange={(e) => setOpenTo(e.target.value)}
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "36px", // Reduced height
                  },
                }}
              >
                <MenuItem value="All students">All students</MenuItem>
                <MenuItem value="1st Year">1st Year</MenuItem>
                <MenuItem value="2nd Year">2nd Year</MenuItem>
                <MenuItem value="3rd Year">3rd Year</MenuItem>
                <MenuItem value="Final Year">Final Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Participants/Roles */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Participants/Roles
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Participants/Roles"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "40px", // Reduced height
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "darkgreen",
                        border: "1px solid darkgreen",
                        height: "30px", // Reduced height
                        minWidth: "10%", // Adjusted width
                        "&:hover": {
                          backgroundColor: "darkgreen",
                          color: "white",
                        },
                      }}
                    >
                      Add
                    </Button>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Set Criteria */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            Set Criteria
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            {/* No. of slots per student */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                No. of slots per student
              </Typography>
              <TextField
                type="number"
                value={slotsPerStudent}
                onChange={(e) => setSlotsPerStudent(e.target.value)}
                sx={{
                  width: "100%",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "40px", // Reduced height
                  },
                }}
              />
            </Box>

            {/* No. of slots per faculty */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                No. of slots per faculty
              </Typography>
              <TextField
                type="number"
                value={slotsPerFaculty}
                onChange={(e) => setSlotsPerFaculty(e.target.value)}
                sx={{
                  width: "100%",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  "& .MuiInputBase-root": {
                    height: "40px", // Reduced height
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Template_area;
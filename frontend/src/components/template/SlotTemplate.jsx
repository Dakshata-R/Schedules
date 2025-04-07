import React, { useState, useEffect } from "react";
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  FormControl, 
  MenuItem, 
  Select,
  Alert,
  Snackbar
} from "@mui/material";
import Add_venue_popup from "../schedules_template/Add_venue_popup";
import SlotPreview from "../preview/SlotPreview";
import Add_Faculty_popup from "../schedules_template/Add_Faculty_popup";
import axios from "axios";

const SlotTemplate = ({ onCancel }) => {
  // State for form fields
  const [templateName, setTemplateName] = useState("");
  const [priority, setPriority] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [numberOfSlots, setNumberOfSlots] = useState("");
  const [durationUnit, setDurationUnit] = useState("Minutes");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [openTo, setOpenTo] = useState("All students");
  const [yearOptions, setYearOptions] = useState(['All students']);
  const [slotsPerStudent, setSlotsPerStudent] = useState("");
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  
  // State for validation
  const [errors, setErrors] = useState({});
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Other state variables
  const [openPreview, setOpenPreview] = useState(false);
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [facultyPopupOpen, setFacultyPopupOpen] = useState(false);
  const [availableFaculties, setAvailableFaculties] = useState([]);
  const [venues, setVenues] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultiesRes, venuesRes, yearsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/faculties"),
          axios.get('http://localhost:8000/api/venues'),
          axios.get('http://localhost:8000/api/student-categories/student-years')
        ]);
        setAvailableFaculties(facultiesRes.data);
        setVenues(venuesRes.data);
        
        // Map years to dropdown options
        const yearOptions = ['All students', ...yearsRes.data.map(year => {
          switch(year) {
            case 1: return '1st Year';
            case 2: return '2nd Year';
            case 3: return '3rd Year';
            case 4: return 'Final Year';
            default: return `${year} Year`;
          }
        })];
        setYearOptions(yearOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Calculate end date time
  useEffect(() => {
    if (startDateTime && slotDuration && numberOfSlots) {
      calculateEndDateTime();
    }
  }, [slotDuration, numberOfSlots, startDateTime, durationUnit]);

  const calculateEndDateTime = () => {
    if (!startDateTime || !slotDuration || !numberOfSlots) return;
  
    const durationInMinutes = durationUnit === "Hours" ? 
      parseInt(slotDuration) * 60 : parseInt(slotDuration);
    
    // For single slot, simply add duration to start time
    if (parseInt(numberOfSlots) === 1) {
      const endTime = new Date(startDateTime);
      endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
      setEndDateTime(formatDateForInput(endTime));
      return;
    }
  
    // Original logic for multiple slots
    const breaks = [
      { start: 10 + 35/60, end: 10 + 50/60 },  // 10:35-10:50
      { start: 12 + 30/60, end: 13 + 30/60 },   // 12:30-13:30
      { start: 15 + 20/60, end: 15 + 35/60 }    // 15:20-15:35
    ];
    const workingHours = { start: 9, end: 16 + 30/60 }; // 9:00-16:30
  
    let currentTime = new Date(startDateTime);
    let slotsRemaining = parseInt(numberOfSlots);
  
    while (slotsRemaining > 0) {
      const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
      
      // Check working hours and weekends
      if (currentHour < workingHours.start || currentHour >= workingHours.end || 
          currentTime.getDay() === 0) {
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
        const slotStart = currentHour;
        const slotEnd = endHour;
        return slotStart < b.end && slotEnd > b.start;
      });
  
      if (overlappingBreak) {
        // If we can complete the slot before break starts
        if (currentHour <= overlappingBreak.start && 
            (currentHour + durationInMinutes/60) <= overlappingBreak.start) {
          currentTime.setMinutes(currentTime.getMinutes() + durationInMinutes);
          slotsRemaining--;
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
      if (endHour > workingHours.end) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }
  
      // Valid slot
      currentTime.setMinutes(currentTime.getMinutes() + durationInMinutes);
      slotsRemaining--;
    }
  
    setEndDateTime(formatDateForInput(currentTime));
  };

  const formatDateForInput = (date) => {
    const pad = num => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!templateName.trim()) newErrors.templateName = "Template name is required";
    if (!priority) newErrors.priority = "Priority is required";
    if (!slotDuration || isNaN(slotDuration) || slotDuration <= 0) newErrors.slotDuration = "Valid duration is required";
    if (!numberOfSlots || isNaN(numberOfSlots) || numberOfSlots <= 0) newErrors.numberOfSlots = "Valid number of slots is required";
    if (!startDateTime) {
      newErrors.startDateTime = "Start date is required";
    } else {
      const selectedDate = new Date(startDateTime);
      if (selectedDate <= today) {
        newErrors.startDateTime = "Date must be in the future";
      }
    }
    if (selectedVenues.length === 0) newErrors.venues = "At least one venue is required";
    if (selectedFaculties.length === 0) newErrors.faculties = "At least one faculty is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle preview button click
  const handlePreview = () => {
    if (validateForm()) {
      setOpenPreview(true);
    } else {
      setErrorMessage("Please fill all required fields correctly");
      setOpenError(true);
    }
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setErrors({...errors, startDateTime: "Date must be in the future"});
    } else {
      const newErrors = {...errors};
      delete newErrors.startDateTime;
      setErrors(newErrors);
    }
    setStartDateTime(e.target.value);
  };

  const handleConfirmSlots = async () => {
    try {
      const slotData = {
        template_name: templateName,
        priority,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        slot_duration: parseInt(slotDuration),
        duration_unit: durationUnit,
        number_of_slots: parseInt(numberOfSlots),
        open_to: openTo,
        slots_per_student: slotsPerStudent ? parseInt(slotsPerStudent) : null,
        venues: selectedVenues,
        faculties: selectedFaculties
      };
  
      const response = await axios.post('http://localhost:8000/api/slot-schedules', slotData);
      console.log('Slots created successfully:', response.data);
      return response.data; // Return the response for the preview to handle
    } catch (error) {
      console.error('Error creating slots:', error);
      setErrorMessage('Failed to create slots. Please try again.');
      setOpenError(true);
      throw error; // Re-throw the error so the preview can handle it
    }
  };

  // Close error snackbar
  const handleCloseError = () => {
    setOpenError(false);
  };


  return (
    <Box sx={{ padding: "40px" }}>
      {/* Error Snackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Slot creation Template
        </Typography>
      </Box>

      {/* Template Name */}
      <Typography variant="body1" sx={{ fontWeight: 400, mb: 1, mt: "25px" }}>
        Enter template Name *
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter template name"
        variant="outlined"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        error={!!errors.templateName}
        helperText={errors.templateName}
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 1,
          mb: 2,
        }}
        required
      />

      {/* Priority */}
      <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
        Set Priority *
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
            }}
            onClick={() => setPriority(item.label)}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      {errors.priority && (
        <Typography color="error" variant="caption" sx={{ mt: -1, mb: 2, display: 'block' }}>
          {errors.priority}
        </Typography>
      )}

      {/* Slot Duration and Number of Slots */}
      <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
        {/* Slot Duration */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
            Set Slot Duration *
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              type="number"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              error={!!errors.slotDuration}
              helperText={errors.slotDuration}
              sx={{
                width: "100px",
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                "& .MuiInputBase-root": { height: "40px" },
              }}
              required
            />
            <FormControl sx={{ minWidth: "120px" }}>
              <Select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                sx={{
                  height: "40px",
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
          <Typography variant="body1" sx={{ mb: 1 }}>
            Number of Slots *
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              type="number"
              value={numberOfSlots}
              onChange={(e) => setNumberOfSlots(e.target.value)}
              error={!!errors.numberOfSlots}
              helperText={errors.numberOfSlots}
              sx={{
                width: "100px",
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                "& .MuiInputBase-root": { height: "40px" },
              }}
              required
            />
            <Typography variant="body1">slots</Typography>
          </Box>
        </Box>
      </Box>

      {/* Start and End Date-Time */}
      <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
        {/* Start Date-Time */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Start *
          </Typography>
          <TextField
            type="datetime-local"
            value={startDateTime}
            onChange={handleDateChange}
            error={!!errors.startDateTime}
            helperText={errors.startDateTime}
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: "40px" },
            }}
            required
            inputProps={{
              min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16)
            }}
          />
        </Box>

        {/* End Date-Time */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            End
          </Typography>
          <TextField
            type="datetime-local"
            value={endDateTime}
            disabled
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: "40px" },
            }}
          />
        </Box>
      </Box>

      {/* Open to */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Open to *
        </Typography>
        <FormControl fullWidth>
          <Select
            value={openTo}
            onChange={(e) => setOpenTo(e.target.value)}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              height: "40px",
              "& .MuiInputBase-root": { height: "40px" },
            }}
          >
            {yearOptions.map((year, index) => (
              <MenuItem key={index} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Venue */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Add Location/Venue *
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Venue"
            value={selectedVenues.map(v => v.name).join(", ")}
            error={!!errors.venues}
            helperText={errors.venues}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: "40px" },
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
                    "&:hover": { backgroundColor: "darkgreen", color: "white" },
                  }}
                  onClick={() => setVenuePopupOpen(true)}
                >
                  Add Venue
                </Button>
              ),
            }}
            required
          />
        </Box>
      </Box>

      {/* Faculty */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Assign Faculty *
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Faculty"
            value={selectedFaculties.map(f => f.name).join(", ")}
            error={!!errors.faculties}
            helperText={errors.faculties}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: "36px", padding: "6px 12px" },
              "& .MuiInputBase-input": { fontSize: "14px" },
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
                    "&:hover": { backgroundColor: "darkgreen", color: "white" },
                    padding: "6px 12px",
                    fontSize: "14px",
                  }}
                  onClick={() => setFacultyPopupOpen(true)}
                >
                  Add Faculty
                </Button>
              ),
            }}
            required
          />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: "red",
            borderColor: "red",
            "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.04)" },
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 24px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "red",
            borderColor: "red",
            "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.04)" },
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 24px",
          }}
        >
          Create Draft
        </Button>
        <Button
          variant="contained"
          onClick={handlePreview}
          sx={{
            backgroundColor: "darkgreen",
            color: "white",
            "&:hover": { backgroundColor: "green" },
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 24px",
          }}
        >
          Preview
        </Button>
      </Box>

      {/* Popups */}
      <Add_venue_popup
        open={venuePopupOpen}
        onClose={(selectedVenues = []) => {
          setSelectedVenues(selectedVenues);
          setVenuePopupOpen(false);
          if (selectedVenues.length > 0) {
            const newErrors = {...errors};
            delete newErrors.venues;
            setErrors(newErrors);
          }
        }}
        venues={venues}
      />

      <Add_Faculty_popup
        open={facultyPopupOpen}
        onClose={(selectedFaculties = []) => {
          setSelectedFaculties(selectedFaculties);
          setFacultyPopupOpen(false);
          if (selectedFaculties.length > 0) {
            const newErrors = {...errors};
            delete newErrors.faculties;
            setErrors(newErrors);
          }
        }}
        facultyList={availableFaculties}
      />

      <SlotPreview
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        selectedVenues={selectedVenues}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        slotDuration={slotDuration}
        durationUnit={durationUnit}
        numberOfSlots={numberOfSlots}
        onConfirm={handleConfirmSlots}
        onCancel={onCancel} 
      />
    </Box>
  );
};

export default SlotTemplate;
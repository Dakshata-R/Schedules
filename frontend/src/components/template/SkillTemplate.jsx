import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import Add_venue_popup from "../schedules_template/Add_venue_popup";
import Add_Faculty_popup from "../schedules_template/Add_Faculty_popup";
import SkillPreview from "../preview/SkillPreview";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css";

const SkillTemplate = ({ onCancel }) => {
  // Form state
  const [templateName, setTemplateName] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [timeError, setTimeError] = useState("");

  // Popup states
  const [openPreview, setOpenPreview] = useState(false);
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [facultyPopupOpen, setFacultyPopupOpen] = useState(false);

  // Selection states
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [availableFaculties, setAvailableFaculties] = useState([]);

  // Skill and level states
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [availableLevels, setAvailableLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState("");

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/skills");
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        showNotification("Failed to fetch skills", "error");
      }
    };

    fetchSkills();
  }, []);

  // Fetch levels when skill changes
  useEffect(() => {
    if (skill) {
      axios.get(`http://localhost:8000/api/levels/${skill}`)
        .then((response) => {
          setAvailableLevels(response.data);
        })
        .catch((error) => {
          console.error("Error fetching levels:", error);
          showNotification("Failed to fetch levels for selected skill", "error");
        });
    } else {
      setAvailableLevels([]);
    }
  }, [skill]);

  // Fetch available venues when venue popup opens
  useEffect(() => {
    if (venuePopupOpen) {
      axios.get("http://localhost:5000/api/venues")
        .then(response => setAvailableVenues(response.data))
        .catch(error => {
          console.error("Error fetching venues:", error);
          showNotification("Failed to fetch venues", "error");
        });
    }
  }, [venuePopupOpen]);

  // Fetch available faculties when faculty popup opens
  useEffect(() => {
    if (facultyPopupOpen) {
      axios.get("http://localhost:5000/api/faculties")
        .then(response => setAvailableFaculties(response.data))
        .catch(error => {
          console.error("Error fetching faculties:", error);
          showNotification("Failed to fetch faculties", "error");
        });
    }
  }, [facultyPopupOpen]);

  // Calculate duration based on start and end times
  const calculateDuration = () => {
    if (!startTime || !endTime) return;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Define break times (in minutes since midnight)
    const breaks = [
      { start: 12 * 60 + 30, end: 13 * 60 + 30 },   // Lunch break
      { start: 10 * 60 + 25, end: 10 * 60 + 40 },   // Morning break
      { start: 15 * 60 + 10, end: 15 * 60 + 25 },   // Afternoon break
    ];

    let totalDuration = (end - start) / (1000 * 60); // Convert to minutes

    // Subtract break times from total duration
    breaks.forEach((br) => {
      const breakStart = new Date(`1970-01-01T${Math.floor(br.start / 60)}:${br.start % 60}:00`);
      const breakEnd = new Date(`1970-01-01T${Math.floor(br.end / 60)}:${br.end % 60}:00`);

      if (start <= breakEnd && end >= breakStart) {
        const overlapStart = Math.max(start, breakStart);
        const overlapEnd = Math.min(end, breakEnd);
        totalDuration -= (overlapEnd - overlapStart) / (1000 * 60);
      }
    });

    const hours = Math.floor(totalDuration / 60);
    const minutes = Math.round(totalDuration % 60);
    setDuration(`${hours} hours ${minutes} minutes`);
  };

  useEffect(() => {
    calculateDuration();
  }, [startTime, endTime]);

  // Validate time input
  const validateTime = (time) => {
    const hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);
    if (hours < 9 || (hours === 16 && minutes > 30) || hours >= 17) {
      setTimeError("Time must be between 9:00 AM and 4:30 PM.");
      return false;
    }
    setTimeError("");
    return true;
  };

  // Handle venue selection from popup
  const handleVenueSelection = (selectedVenues) => {
    setSelectedVenues(selectedVenues);
    setVenuePopupOpen(false);
  };

  // Handle faculty selection from popup
  const handleFacultySelection = (selectedFacultyNames) => {
    const selectedFacs = availableFaculties.filter(faculty => 
      selectedFacultyNames.includes(faculty.name)
    );
    setSelectedFaculties(selectedFacs);
    setFacultyPopupOpen(false);
  };

  // Show notification
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Save as draft
  const saveAsDraft = async () => {
    if (!validateForm()) return;
  
    try {
      const response = await axios.post("http://localhost:5000/api/skill-schedules", {
        templateName,
        skillName: skill,
        priority,
        selectedDates: selectedDates.map(date => date.toISOString().split('T')[0]),
        startTime,
        endTime,
        duration,
        status: "Draft",
        level: currentLevel,
        venues: selectedVenues,
        faculties: selectedFaculties.map(faculty => ({
          id: faculty.id,
          name: faculty.name
        }))
      });
  
      showNotification("Schedule saved as draft successfully");
      onCancel();
    } catch (error) {
      console.error("Error saving draft:", error);
      showNotification("Failed to save draft", "error");
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!templateName) {
      showNotification("Please enter a template name", "error");
      return false;
    }
    if (!priority) {
      showNotification("Please select a priority", "error");
      return false;
    }
    if (selectedDates.length === 0) {
      showNotification("Please select at least one date", "error");
      return false;
    }
    if (!startTime || !endTime) {
      showNotification("Please select both start and end times", "error");
      return false;
    }
    if (timeError) {
      showNotification(timeError, "error");
      return false;
    }
    if (!skill) {
      showNotification("Please select a skill", "error");
      return false;
    }
    if (!currentLevel) {
      showNotification("Please select a level", "error");
      return false;
    }
    if (selectedVenues.length === 0) {
      showNotification("Please select at least one venue", "error");
      return false;
    }
    if (selectedFaculties.length === 0) {
      showNotification("Please select at least one faculty", "error");
      return false;
    }
    return true;
  };

  // Preview handler
  const handlePreview = () => {
    if (!validateForm()) return;
    setOpenPreview(true);
  };

  return (
    <Box>
      <Box sx={{ padding: "40px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Skill Schedule Template
          </Typography>
        </Box>

        {/* Template Name */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1, marginTop: "25px" }}>
          Enter template Name
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter template name"
          variant="outlined"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 1,
            mb: 2,
            "& .MuiInputBase-root": {
              height: "36px",
              padding: "6px 12px",
            },
            "& .MuiInputBase-input": {
              fontSize: "14px",
            },
          }}
        />

        {/* Set Priority */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
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
                mb: 2,
                height: "36px",
                padding: "6px 12px",
                fontSize: "14px",
              }}
              onClick={() => setPriority(item.label)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Date Selection */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
          Select Date(s)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div onBlur={() => console.log("DatePicker closed")}>
            <DatePicker
              multiple
              minDate={new Date()}
              value={selectedDates}
              onChange={(dates) => setSelectedDates(dates)}
              style={{ width: "100%", height: "36px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
            />
          </div>
          <Button
            variant="outlined"
            onClick={() => setSelectedDates([])}
            sx={{
              height: "36px",
              minWidth: "10%",
              color: "red",
              borderColor: "red",
              "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.04)" },
              padding: "6px 12px",
              fontSize: "14px",
              marginLeft: "10px"
            }}
          >
            Clear
          </Button>
        </Box>

        {/* Start Time, End Time, and Duration */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              Start Time
            </Typography>
            <TextField
              fullWidth
              type="time"
              value={startTime}
              onChange={(e) => {
                if (validateTime(e.target.value)) setStartTime(e.target.value);
              }}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                mb: 1,
                "& .MuiInputBase-root": {
                  height: "36px",
                  padding: "6px 12px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
              }}
            />
            {timeError && startTime && (
              <Typography variant="caption" color="error">
                {timeError}
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              End Time
            </Typography>
            <TextField
              fullWidth
              type="time"
              value={endTime}
              onChange={(e) => {
                if (validateTime(e.target.value)) setEndTime(e.target.value);
              }}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                mb: 1,
                "& .MuiInputBase-root": {
                  height: "36px",
                  padding: "6px 12px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
              }}
            />
            {timeError && endTime && (
              <Typography variant="caption" color="error">
                {timeError}
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              Duration (excluding breaks)
            </Typography>
            <TextField
              fullWidth
              value={duration}
              disabled
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                mb: 2,
                "& .MuiInputBase-root": {
                  height: "36px",
                  padding: "6px 12px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
              }}
            />
          </Box>
        </Box>

        {/* Select Skill and Level - Updated to be on the same line */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {/* Select Skill - 50% width */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              Select Skill
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Skill</InputLabel>
              <Select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                label="Skill"
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  height: "36px",
                  "& .MuiSelect-select": {
                    padding: "6px 12px",
                    fontSize: "14px",
                  },
                }}
              >
                {skills.length === 0 && (
                  <MenuItem disabled>No skills available</MenuItem>
                )}
                {skills.map((skillName) => (
                  <MenuItem key={skillName} value={skillName}>
                    {skillName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Select Level - 50% width */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              Select Level
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                label="Level"
                disabled={!skill}
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  height: "36px",
                  "& .MuiSelect-select": {
                    padding: "6px 12px",
                    fontSize: "14px",
                  },
                }}
              >
                {availableLevels.length === 0 && (
                  <MenuItem disabled>No levels available</MenuItem>
                )}
                {availableLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Assign Venue */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Assign Venue
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Venue"
            value={selectedVenues.map((venue) => venue.venue_name).join(", ")}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                padding: "6px 12px",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
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
                    padding: "6px 12px",
                    fontSize: "14px",
                  }}
                  onClick={() => setVenuePopupOpen(true)}
                >
                  Add Venue
                </Button>
              ),
            }}
          />
        </Box>

        {/* Add Venue Popup */}
        <Add_venue_popup
          open={venuePopupOpen}
          onClose={handleVenueSelection}
          availableVenues={availableVenues}
        />

        {/* Assign Faculty */}
        <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
          Assign Faculty
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Faculty"
            value={selectedFaculties.map(faculty => faculty.name).join(", ")}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                padding: "6px 12px",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
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
                    padding: "6px 12px",
                    fontSize: "14px",
                  }}
                  onClick={() => setFacultyPopupOpen(true)}
                >
                  Add Faculty
                </Button>
              ),
            }}
          />
        </Box>

        {/* Add Faculty Popup */}
        <Add_Faculty_popup
          open={facultyPopupOpen}
          onClose={handleFacultySelection}
          availableFaculties={availableFaculties}
          selectedFaculties={selectedFaculties}
        />

        {/* Cancel, Draft, and Preview Buttons */}
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
              height: "36px",
              fontSize: "14px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={saveAsDraft}
            sx={{
              color: "red",
              borderColor: "red",
              "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.04)" },
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 24px",
              height: "36px",
              fontSize: "14px",
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
              height: "36px",
              fontSize: "14px",
            }}
          >
            Preview
          </Button>
        </Box>

        {/* Preview Popup */}
        <SkillPreview 
          open={openPreview} 
          onClose={() => setOpenPreview(false)}
          onTabChange={() => onCancel()} 
          data={{
            templateName,
            skill,
            priority,
            selectedDates,
            startTime,
            endTime,
            duration,
            availableVenues,
            assignedLevels: selectedVenues.map((venue, index) => ({
              level: currentLevel,
              venueId: venue.venue_id,
              venue: venue.venue_name,
              faculty: selectedFaculties[index]?.name || "",
              facultyId: selectedFaculties[index]?.id || ""
            }))
          }}
        />
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SkillTemplate;
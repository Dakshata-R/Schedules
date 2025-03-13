import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Add_venue_popup from "../schedules_template/Add_venue_popup";
import Add_Faculty_popup from "../schedules_template/Add_Faculty_popup";
import SlotPreview from "../preview/SlotPreview";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css";

const SkillTemplate = ({ onCancel }) => {
  const [templateName, setTemplateName] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [skill, setSkill] = useState("");
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState("");
  const [currentVenue, setCurrentVenue] = useState("");
  const [currentFaculty, setCurrentFaculty] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [facultyPopupOpen, setFacultyPopupOpen] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [timeError, setTimeError] = useState("");

  const skills = {
    Python: ["Beginner", "Intermediate", "Advanced"],
    C: ["Beginner", "Intermediate", "Advanced"],
    Aptitude: ["Level 1", "Level 2", "Level 3"],
  };

  const venues = [
    { id: 1, name: "SF Seminar hall", capacity: "300", type: "Seminar Hall" },
    { id: 2, name: "WW101", capacity: "60", type: "Lab" },
    { id: 3, name: "IT lab 01", capacity: "60 per lab", type: "Lab" },
    { id: 4, name: "Mech Drawing hall", capacity: "100", type: "Drawing Hall" },
    { id: 5, name: "Textile seminar hall", capacity: "100", type: "Seminar Hall" },
  ];

  const facultyList = ["Dr. Smith", "Dr. Johnson", "Dr. Brown", "Dr. White"];

  const calculateDuration = () => {
    if (!startTime || !endTime) return;

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    const breaks = [
      { start: 12 * 60 + 30, end: 13 * 60 + 30 }, // 12:30 PM to 1:30 PM
      { start: 10 * 60 + 25, end: 10 * 60 + 40 }, // 10:25 AM to 10:40 AM
      { start: 15 * 60 + 10, end: 15 * 60 + 25 }, // 3:10 PM to 3:25 PM
    ];

    let totalDuration = (end - start) / (1000 * 60); // Total duration in minutes

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

  const addLevel = () => {
    if (currentLevel && currentVenue && currentFaculty) {
      setLevels((prev) => [
        ...prev,
        { level: currentLevel, venue: currentVenue, faculty: currentFaculty },
      ]);
      setCurrentLevel("");
      setCurrentVenue("");
      setCurrentFaculty("");
    }
  };

  const handleVenueSelection = (selectedVenues) => {
    setSelectedVenues(selectedVenues);
    setVenuePopupOpen(false);
  };

  const handleFacultySelection = (selectedFaculties) => {
    setSelectedFaculties(selectedFaculties);
    setFacultyPopupOpen(false);
  };

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
              height: "36px", // Reduce the height of the input field
              padding: "6px 12px", // Adjust padding to make it compact
            },
            "& .MuiInputBase-input": {
              fontSize: "14px", // Reduce font size for a smaller appearance
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
                padding: "6px 12px", // Adjust padding for smaller buttons
                fontSize: "14px", // Reduce font size for smaller buttons
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
          <DatePicker
            multiple
            minDate={new Date()}
            value={selectedDates}
            onChange={(dates) => setSelectedDates(dates)}
            style={{ width: "100%", height: "36px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
          />
          <Button
            variant="outlined"
            onClick={() => setSelectedDates([])}
            sx={{
              height: "36px",
              minWidth: "10%",
              color: "red",
              borderColor: "red",
              "&:hover": { borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.04)" },
              padding: "6px 12px", // Adjust padding for smaller buttons
              fontSize: "14px", // Reduce font size for smaller buttons
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
                mb: 1,
                "& .MuiInputBase-root": {
                  height: "36px", // Reduce the height of the input field
                  padding: "6px 12px", // Adjust padding to make it compact
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px", // Reduce font size for a smaller appearance
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
                mb: 1,
                "& .MuiInputBase-root": {
                  height: "36px", // Reduce the height of the input field
                  padding: "6px 12px", // Adjust padding to make it compact
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px", // Reduce font size for a smaller appearance
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
                mb: 2,
                "& .MuiInputBase-root": {
                  height: "36px", // Reduce the height of the input field
                  padding: "6px 12px", // Adjust padding to make it compact
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px", // Reduce font size for a smaller appearance
                },
              }}
            />
          </Box>
        </Box>

        {/* Select Skill and Level */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
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
                  height: "36px", // Reduce the height of the select field
                  "& .MuiSelect-select": {
                    padding: "6px 12px", // Adjust padding to make it compact
                    fontSize: "14px", // Reduce font size for a smaller appearance
                  },
                }}
              >
                {Object.keys(skills).map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
              Select Level
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                sx={{
                  height: "36px", // Reduce the height of the select field
                  "& .MuiSelect-select": {
                    padding: "6px 12px", // Adjust padding to make it compact
                    fontSize: "14px", // Reduce font size for a smaller appearance
                  },
                }}
              >
                {skills[skill]?.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Assign Venue */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Assign Venue
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
                  height: "36px", // Reduce the height of the input field
                  padding: "6px 12px", // Adjust padding to make it compact
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px", // Reduce font size for a smaller appearance
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
                      padding: "6px 12px", // Adjust padding for smaller buttons
                      fontSize: "14px", // Reduce font size for smaller buttons
                    }}
                    onClick={() => setVenuePopupOpen(true)}
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

        {/* Assign Faculty */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Assign Faculty
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Faculty"
              value={selectedFaculties.join(", ")}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: "36px", // Reduce the height of the input field
                  padding: "6px 12px", // Adjust padding to make it compact
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px", // Reduce font size for a smaller appearance
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
                      padding: "6px 12px", // Adjust padding for smaller buttons
                      fontSize: "14px", // Reduce font size for smaller buttons
                    }}
                    onClick={() => setFacultyPopupOpen(true)}
                  >
                    Add Faculty
                  </Button>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Add Faculty Popup */}
        <Add_Faculty_popup
          open={facultyPopupOpen}
          onClose={(selectedFaculties) => {
            setSelectedFaculties(selectedFaculties);
            setFacultyPopupOpen(false);
          }}
          facultyList={["Dr. Smith", "Dr. Johnson", "Dr. Brown"]}
        />

        {/* Add Level Button */}
        <Button
          variant="contained"
          onClick={addLevel}
          sx={{
            backgroundColor: "darkgreen",
            color: "white",
            "&:hover": { backgroundColor: "green" },
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 24px",
            mt: 2,
            height: "36px",
            fontSize: "14px", // Reduce font size for smaller buttons
          }}
        >
          Add Level
        </Button>

        {/* Venue Allotments Table */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1, mt: 4 }}>
          Venue Allotments
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Faculty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {levels.map((level, index) => (
              <TableRow key={index}>
                <TableCell>{level.level}</TableCell>
                <TableCell>{level.venue}</TableCell>
                <TableCell>{level.faculty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
              fontSize: "14px", // Reduce font size for smaller buttons
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
              height: "36px",
              fontSize: "14px", // Reduce font size for smaller buttons
            }}
          >
            Create Draft
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "darkgreen",
              color: "white",
              "&:hover": { backgroundColor: "green" },
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 24px",
              height: "36px",
              fontSize: "14px", // Reduce font size for smaller buttons
            }}
            onClick={() => setOpenPreview(true)}
          >
            Preview
          </Button>
        </Box>

        {/* Preview Popup */}
        <SlotPreview open={openPreview} onClose={() => setOpenPreview(false)} />
      </Box>
    </Box>
  );
};

export default SkillTemplate;
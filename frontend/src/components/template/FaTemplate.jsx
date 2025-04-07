import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
} from "@mui/material";
import Add_venue_popup from "../schedules_template/Add_venue_popup";
import Add_Faculty_popup from "../schedules_template/Add_Faculty_popup";
import FaPreview from "../preview/FaPreview";
import axios from "axios";

const FaTemplate = ({ onCancel }) => {
  const [venues, setVenues] = useState([]);
  const [faType, setFaType] = useState("Academic FA");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("Minutes");
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [syllabusTopic, setSyllabusTopic] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [mode, setMode] = useState("Offline");
  const [venue, setVenue] = useState("");
  const [faculty, setFaculty] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [facultyPopupOpen, setFacultyPopupOpen] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [dateError, setDateError] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  const [successMessage, setSuccessMessage] = useState("");
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState(null);
   // Replace the existing fetchData useEffect with this:
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch venues
          // In the fetchData useEffect
          const venuesResponse = await axios.get("http://localhost:8000/api/venues");
          const normalizedVenues = venuesResponse.data.map(venue => ({
            venue_id: venue.id,
            venue_name: venue.name,
            // other properties
          }));
          setVenues(normalizedVenues || []);

          // Fetch years and departments from students table
          try {
            const yearsDeptsResponse = await axios.get("http://localhost:8000/api/students/years-departments");
            const data = yearsDeptsResponse.data || [];
            
            // Extract unique years and departments
            const uniqueYears = [...new Set(data.map(item => item.year))].sort();
            const uniqueDepartments = [...new Set(data.map(item => item.department))].sort();

            setYears(uniqueYears);
            setDepartments(uniqueDepartments);
          } catch (yearsDeptsError) {
            console.error("Error fetching years/departments:", yearsDeptsError);
            // Fallback to empty arrays if there's an error
            setYears([]);
            setDepartments([]);
          }

        } catch (error) {
          console.error("Error fetching data:", error);
          setVenues([]);
          setYears([]);
          setDepartments([]);
        }
      };

      fetchData();
    }, []); 

    useEffect(() => {
      if (!year || !department) {
        setFilteredCourses([]);
        return;
      }
    
      const fetchCourses = async () => {
        setCourseLoading(true);
        setCourseError(null);
        try {
          const response = await axios.get(`http://localhost:8000/api/courses`, {
            params: {
              year: year,
              department: department
            }
          });
          setFilteredCourses(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setCourseError("Failed to load courses");
          setFilteredCourses([]);
        } finally {
          setCourseLoading(false);
        }
      };
    
      fetchCourses();
    }, [year, department]);

  // Handle FA type change
  const handleFaTypeChange = (event) => {
    setFaType(event.target.value);
  };

  // Handle mode change
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  // Handle start date change (only future dates allowed)
  const handleStartDateChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (new Date(selectedDate) >= new Date(today)) {
      setStartDate(selectedDate);
      setDateError("");
    } else {
      setDateError("Please select a date after today.");
    }
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = () => {
    if (!startTime || !duration) return "";

    const start = new Date(`01/01/2000 ${startTime} GMT+0530`);
    const durationInMinutes = durationUnit === "Hours" ? duration * 60 : duration;
    const end = new Date(start.getTime() + durationInMinutes * 60000);
    const endTimeIST = end.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    return endTimeIST;
  };

  const endTime = calculateEndTime();

  useEffect(() => {
    calculateEndTime();
  }, [startTime, duration, durationUnit]);

  // In FaTemplate.jsx's handleVenueSelection:
  const handleVenueSelection = (selectedVenues = []) => {
    const normalizedVenues = selectedVenues.map(venue => ({
      venue_id: venue.id, // or venue.venue_id if that's what comes from the API
      venue_name: venue.name, // or venue.venue_name
    }));
    setSelectedVenues(normalizedVenues);
    setVenuePopupOpen(false);
  };
  // Handle faculty selection from popup
  const handleFacultySelection = (selectedFaculties) => {
    setSelectedFaculties(selectedFaculties || []);
    setFacultyPopupOpen(false);
  };

  useEffect(() => {
    console.log("Selected Venues:", selectedVenues);
  }, [selectedVenues]);


  return (
    <Box>
      <Box sx={{ padding: "40px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            FA Schedule Template
          </Typography>
        </Box>

        {/* FA Type Dropdown */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1, marginTop: "25px" }}>
          Select FA Type
        </Typography>
        <FormControl fullWidth>
          <Select
            value={faType}
            onChange={handleFaTypeChange}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              mb: 2,
              height: "36px",
            }}
          >
            <MenuItem value="Academic FA">Academic FA</MenuItem>
            <MenuItem value="Placement FA">Placement FA</MenuItem>
          </Select>
        </FormControl>

        {/* Priority Buttons */}
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
              }}
              onClick={() => setPriority(item.label)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Start Date */}
        <Typography variant="body1" sx={{ fontWeight: 400, mb: 1 }}>
          Start Date
        </Typography>
        <TextField
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          sx={{
            width: "100%",
            backgroundColor: "#f8f9fa",
            borderRadius: 1,
            mb: 1,
          }}
          InputProps={{
            style: {
              height: "36px",
            },
            inputProps: {
              style: {
                height: "36px",
                padding: "6px 12px",
              },
            },
          }}
          inputProps={{
            min: new Date().toISOString().split("T")[0],
          }}
        />
        {dateError && (
          <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
            {dateError}
          </Typography>
        )}

        {/* Start Time, Duration, and End Time */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          {/* Start Time */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Start Time
            </Typography>
            <TextField
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
              }}
              InputProps={{
                style: {
                  height: "36px",
                },
                inputProps: {
                  style: {
                    height: "36px",
                    padding: "6px 12px",
                  },
                },
              }}
            />
          </Box>

          {/* Duration */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Duration
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{
                  width: "100px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                }}
                InputProps={{
                  style: {
                    height: "36px",
                  },
                  inputProps: {
                    style: {
                      height: "36px",
                      padding: "6px 12px",
                    },
                  },
                }}
              />
              <FormControl sx={{ minWidth: "120px" }}>
                <Select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 1,
                    height: "36px",
                  }}
                >
                  <MenuItem value="Minutes">Minutes</MenuItem>
                  <MenuItem value="Hours">Hours</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* End Time */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              End Time
            </Typography>
            <TextField
              fullWidth
              value={endTime}
              disabled
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
              }}
              InputProps={{
                style: {
                  height: "36px",
                },
                inputProps: {
                  style: {
                    height: "36px",
                    padding: "6px 12px",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Year and Department Dropdowns */}
        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          {/* Year */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Year
            </Typography>
            <FormControl fullWidth>
            <Select
              value={year || ""}
              onChange={(e) => setYear(e.target.value)}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                height: "36px",
              }}
            >
              <MenuItem value="" disabled>Select Year</MenuItem>
              {years && years.map((yr) => (
                <MenuItem key={yr} value={yr}>
                  Year {yr}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Box>

          {/* Department */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Department
            </Typography>
            <FormControl fullWidth>
            <Select
              value={department || ""}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                height: "36px",
              }}
            >
              <MenuItem value="" disabled>Select Department</MenuItem>
              {departments && departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Syllabus Topic (Placement FA) or Course Code (Academic FA) */}
        {faType === "Placement FA" ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Syllabus Topic
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter syllabus topic"
              value={syllabusTopic}
              onChange={(e) => setSyllabusTopic(e.target.value)}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
              }}
              InputProps={{
                style: {
                  height: "36px",
                },
                inputProps: {
                  style: {
                    height: "36px",
                    padding: "6px 12px",
                  },
                },
              }}
            />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Course Code and Title
            </Typography>
            <FormControl fullWidth>
              <Select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                  height: "36px",
                }}
                disabled={courseLoading}
              >
                <MenuItem value="" disabled>Select a Course</MenuItem>
                {courseLoading ? (
                  <MenuItem disabled>Loading courses...</MenuItem>
                ) : courseError ? (
                  <MenuItem disabled>{courseError}</MenuItem>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <MenuItem key={course.id} value={course.course_code}>
                      {course.course_code} - {course.course_title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {year && department ? "No courses available" : "Select year and department first"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Mode Selection (Online/Offline) */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Mode
          </Typography>
          <RadioGroup row value={mode} onChange={handleModeChange}>
            <FormControlLabel
              value="Online"
              control={
                <Radio
                  sx={{
                    color: "darkgreen",
                    "&.Mui-checked": {
                      color: "darkgreen",
                    },
                  }}
                />
              }
              label="Online"
            />
            <FormControlLabel
              value="Offline"
              control={
                <Radio
                  sx={{
                    color: "darkgreen",
                    "&.Mui-checked": {
                      color: "darkgreen",
                    },
                  }}
                />
              }
              label="Offline"
            />
          </RadioGroup>
        </Box>

        {/* Venue and Faculty (Offline Mode) */}
        {mode === "Offline" && (
          <Box sx={{ mt: 2 }}>
            {/* Venue */}
            <Typography variant="body1" sx={{ mb: 1 }}>
              Venue
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Venue"
              value={selectedVenues.map((venue) => venue.venue_name).join(", ")}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
              }}
              InputProps={{
                style: {
                  height: "36px",
                },
                inputProps: {
                  style: {
                    height: "36px",
                    padding: "6px 12px",
                  },
                },
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
                    onClick={() => setVenuePopupOpen(true)}
                  >
                    Add Venue
                  </Button>
                ),
              }}
            />
            </Box>

            {/* Faculty */}
            <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
              Faculty
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Faculty"
              value={selectedFaculties.map(f => f.name).join(", ")}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
              }}
              InputProps={{
                style: {
                  height: "36px",
                },
                inputProps: {
                  style: {
                    height: "36px",
                    padding: "6px 12px",
                  },
                },
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
                    onClick={() => setFacultyPopupOpen(true)}
                  >
                    Add Faculty
                  </Button>
                ),
              }}
            />
            </Box>
          </Box>
        )}

        {/* Add Venue Popup */}
        <Add_venue_popup
          open={venuePopupOpen}
          onClose={handleVenueSelection}
          venues={venues} // Pass the actual venues data we fetched
        />

        {/* Add Faculty Popup */}
        <Add_Faculty_popup
          open={facultyPopupOpen}
          onClose={handleFacultySelection}
          // Remove facultyList prop if not used in Add_Faculty_popup
        />

        {/* Cancel, Create Draft, and Preview Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: "red",
              borderColor: "red",
              "&:hover": {
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.04)",
              },
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 24px",
              height: "36px",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "red",
              borderColor: "red",
              "&:hover": {
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.04)",
              },
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 24px",
              height: "36px",
            }}
          >
            Create Draft
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "darkgreen",
              color: "white",
              "&:hover": {
                backgroundColor: "green",
              },
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 24px",
              height: "36px",
            }}
            onClick={() => setOpenPreview(true)}
          >
            Preview
          </Button>
        </Box>

      

        {/* Preview Popup */}
        <FaPreview
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          selectedVenues={selectedVenues}
          startDate={startDate}
          duration={duration}
          durationUnit={durationUnit}
          startTime={startTime}
          mode={mode}
          venues={venues}
          year={year}
          department={department}
          syllabusTopic={syllabusTopic}
          courseCode={courseCode}
          faType={faType}
          priority={priority}
          selectedFaculties={selectedFaculties}
          onTabChange={(tab) => onCancel()}
        />

      </Box>
    </Box>
  );
};

export default FaTemplate;
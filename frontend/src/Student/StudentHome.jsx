import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from '@mui/icons-material/Close';
import RequestSchedule from "./request_schedule";
import axios from "axios";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';

// Color mapping for different event types
const eventTypeColors = {
  'Meeting': { border: '#3f51b5', background: '#e8eaf6' },
  'Consultation': { border: '#009688', background: '#e0f2f1' },
  'Office Hours': { border: '#ff5722', background: '#fbe9e7' },
  'Review': { border: '#673ab7', background: '#ede7f6' },
  'Discussion': { border: '#e91e63', background: '#fce4ec' },
  'Default': { border: '#9e9e9e', background: '#f5f5f5' }
};

// Helper function to get color based on event title
const getEventColor = (title) => {
  if (!title) return eventTypeColors['Default'];
  
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('meeting')) return eventTypeColors['Meeting'];
  if (lowerTitle.includes('consultation')) return eventTypeColors['Consultation'];
  if (lowerTitle.includes('office hours')) return eventTypeColors['Office Hours'];
  if (lowerTitle.includes('review')) return eventTypeColors['Review'];
  if (lowerTitle.includes('discussion')) return eventTypeColors['Discussion'];
  
  // Fallback: generate color based on title hash if not matched
  const colors = [
    { border: '#3f51b5', background: '#e8eaf6' },
    { border: '#009688', background: '#e0f2f1' },
    { border: '#ff5722', background: '#fbe9e7' },
    { border: '#673ab7', background: '#ede7f6' },
    { border: '#e91e63', background: '#fce4ec' },
    { border: '#00bcd4', background: '#e0f7fa' },
    { border: '#8bc34a', background: '#f1f8e9' },
    { border: '#ffc107', background: '#fff8e1' },
    { border: '#795548', background: '#efebe9' },
    { border: '#607d8b', background: '#eceff1' }
  ];
  
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Helper function for profile images
const getProfileImage = (facultyName) => {
  const names = facultyName?.split(' ') || ['F'];
  const initials = names.map(n => n[0]).join('').toUpperCase();
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607',
    '#8338EC', '#3A86FF', '#FF006E', '#A05195', '#FF7C43'
  ];
  const colorIndex = (initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0)) % colors.length;
  const color = colors[colorIndex];
  return `https://ui-avatars.com/api/?name=${initials}&background=${color.replace('#', '')}&color=fff&size=128`;
};

function EventChip({ event }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const eventColor = getEventColor(event.title);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px", // Reduced padding
          borderRadius: "8px",
          backgroundColor: eventColor.background,
          border: `2px solid ${eventColor.border}`,
          maxWidth: "100%", // Changed to 100%
          minWidth: "100%", // Changed to 100%
          width: "100%", // Added to ensure full width
          cursor: "pointer",
          transition: "all 0.2s ease",
          '&:hover': {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          },
          margin: "2px 0", // Reduced margin
          boxSizing: "border-box" // Added to include padding in width
        }}
      >
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden", // Prevent text overflow
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          <Typography sx={{ 
            fontSize: "16px", // Reduced font size
            fontWeight: "bold", 
            color: "#212121",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {event.title}
          </Typography>
          <Typography sx={{ 
            fontSize: "12px", // Reduced font size
            fontWeight: "500", 
            color: "#9E9E9E",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {new Date(event.start).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Kolkata' 
            })} - 
            {new Date(event.end).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Kolkata' 
            })}
          </Typography>
        </Box>
        <Avatar 
          src={getProfileImage(event.faculty)} 
          alt={event.faculty}
          sx={{ 
            width: 32, // Reduced size
            height: 32, // Reduced size
            ml: 1 // Added margin to separate from text
          }}
        />
      </Box>

      {/* Popover remains unchanged */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        {event.slotData && (
          <Box sx={{ 
            p: 2, 
            maxWidth: 300,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
          }}>
            <Box sx={{
              backgroundColor: eventColor.border,
              color: "#FFFFFF",
              padding: '8px 12px',
              borderRadius: '8px',
              mb: 1,
              fontWeight: 'bold'
            }}>
              {event.title}
            </Box>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: '24px 1fr',
              gap: '8px',
              alignItems: 'center',
              mt: 1
            }}>
              <CalendarTodayIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(event.slotData.start).toLocaleDateString([], { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Typography>
              
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(event.slotData.start).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Asia/Kolkata'
                })} - {new Date(event.slotData.end).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Asia/Kolkata'
                })}
              </Typography>
              
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2">{event.slotData.faculty}</Typography>
              
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2">{event.slotData.location}</Typography>
            </Box>

            {event.slotData.requestDetails && (
              <Box sx={{ 
                mt: 2, 
                pt: 1, 
                borderTop: '1px dashed #ddd',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)',
                borderRadius: '8px',
                padding: '8px'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Student Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '8px' }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">{event.slotData.requestDetails.student_name}</Typography>
                  
                  {event.slotData.requestDetails.roll_number && (
                    <>
                      <BadgeIcon fontSize="small" color="action" />
                      <Typography variant="body2">Roll: {event.slotData.requestDetails.roll_number}</Typography>
                    </>
                  )}
                  
                  {event.slotData.requestDetails.department && (
                    <>
                      <SchoolIcon fontSize="small" color="action" />
                      <Typography variant="body2">Dept: {event.slotData.requestDetails.department}</Typography>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Popover>
    </>
  );
}
function TimelineView({ timeRange, date, bookedSlots, loadingSlots }) {
  const selectedDate = date instanceof Date ? date : new Date(date);
  const [startHour, endHour] = timeRange.split("-").map(Number);

  // Generate time slots for the selected range (only full hours)
  const timeSlots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    timeSlots.push({
      hour,
      label: `${hour}:00`
    });
  }

  // Calculate column width and total width
  const columnWidth = 180; // Fixed width for each time slot column
  const totalWidth = timeSlots.length * columnWidth;

  // Filter events for the selected date
  const filteredEvents = bookedSlots.filter(slot => {
    const slotDate = new Date(slot.start).toDateString();
    return slotDate === selectedDate.toDateString();
  });

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        marginTop: "5px",
        minHeight: "400px",
        overflowX: "auto"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </Typography>

      {loadingSlots ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Time slot headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${timeSlots.length}, ${columnWidth}px)`,
              backgroundColor: "#f0f0f0",
              borderBottom: "1px solid #ddd",
              width: `${totalWidth}px`
            }}
          >
            {timeSlots.map((slot, index) => (
              <Box
                key={slot.label}
                sx={{
                  textAlign: "center",
                  padding: "8px 4px",
                  borderRight: index !== timeSlots.length - 1 ? "1px solid #ddd" : "none",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "12px" }}>
                  {slot.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Timeline content */}
          <Box
            sx={{
              position: "relative",
              minHeight: "300px",
              border: "1px solid #ddd",
              backgroundColor: "#f9f9f9",
              width: `${totalWidth}px`,
              padding: "8px 0"
            }}
          >
            {/* Time markers - now using fixed pixel positions */}
            {timeSlots.map((slot, index) => (
              <Box
                key={`marker-${slot.label}`}
                sx={{
                  position: "absolute",
                  left: `${index * columnWidth}px`,
                  height: "100%",
                  borderLeft: index > 0 ? "1px dashed #ccc" : "none",
                  width: "1px",
                }}
              />
            ))}

            {/* Render events - now using fixed pixel positioning */}
            {filteredEvents.map((event, index) => {
              const eventStart = new Date(event.start);
              const eventEnd = new Date(event.end);
              
              // Calculate minutes from start of our time range
              const rangeStartMinutes = startHour * 60;
              const rangeEndMinutes = endHour * 60;
              const totalMinutesInRange = rangeEndMinutes - rangeStartMinutes;
              
              const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
              const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
              
              // Calculate position in pixels
              const startPosition = ((eventStartMinutes - rangeStartMinutes) / totalMinutesInRange) * totalWidth;
              const endPosition = ((eventEndMinutes - rangeStartMinutes) / totalMinutesInRange) * totalWidth;
              const width = endPosition - startPosition;

              // Only render if the event is within our time range
              if (width <= 0 || startPosition >= totalWidth || endPosition <= 0) return null;

              return (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    left: `${Math.max(0, startPosition)}px`,
                    width: `${Math.min(totalWidth, width)}px`,
                    top: "10px",
                    padding: "0 4px",
                    boxSizing: "border-box"
                  }}
                >
                  <EventChip event={event} />
                </Box>
              );
            })}
          </Box>

          {!loadingSlots && filteredEvents.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
                width: `${totalWidth}px`
              }}
            >
              <Typography>No booked slots for this time period</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
function CalendarView({ calendarView, dateRange, bookedSlots, loadingSlots }) {
  const calendarEvents = bookedSlots.map(slot => ({
    date: new Date(slot.start).toISOString().split('T')[0],
    title: slot.title,
    start: slot.start,
    end: slot.end,
    faculty: slot.faculty,
    slotData: slot
  }));

  if (calendarView === "month") {
    const months = [];
    let current = new Date(dateRange.startDate);
    current.setDate(1);
    
    while (current <= dateRange.endDate) {
      months.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    const maxDays = Math.max(...months.map(month => 
      new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    ));

   
        return (
          <Box sx={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "8px", 
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
            padding: "16px", 
            marginTop: "5px",
            overflowX: 'auto' // Add horizontal scrolling if needed
          }}>
            {loadingSlots ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: `60px repeat(${months.length}, minmax(120px, 1fr))`, // Reduced date column width
                gap: "0px",
              }}>
                <Box sx={{ 
                  fontWeight: "bold", 
                  textAlign: "center", 
                  padding: "8px", 
                  backgroundColor: "#f0f0f0",
                  borderRight: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  position: 'sticky',
                  left: 0,
                  zIndex: 1
                }}>
                  Date
                </Box>
                {months.map((month, index) => (
                  <Box 
                    key={month.toISOString()}
                    sx={{ 
                      fontWeight: "bold", 
                      textAlign: "center", 
                      padding: "8px", 
                      backgroundColor: "#f0f0f0",
                      borderRight: index !== months.length - 1 ? "1px solid #ddd" : "none",
                      borderBottom: "1px solid #ddd",
                      minWidth: '120px' // Set minimum width for month columns
                    }}>
                    {month.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </Box>
                ))}
    
                {Array.from({ length: maxDays }, (_, index) => {
                  const day = index + 1;
                  return (
                    <React.Fragment key={day}>
                      <Box sx={{ 
                        textAlign: "center", 
                        padding: "8px", 
                        backgroundColor: "#f9f9f9",
                        borderRight: "1px solid #ddd",
                        position: 'sticky',
                        left: 0,
                        zIndex: 1
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {day}
                        </Typography>
                      </Box>
    
                      {months.map((month, monthIndex) => {
                        const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
                        const formattedDate = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayEvents = calendarEvents.filter(event => event.date === formattedDate);
    
                        return (
                          <Box
                            key={`${month.toISOString()}-${day}`}
                            sx={{
                              padding: "8px",
                              backgroundColor: "#ffffff",
                              minHeight: "40px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              borderRight: monthIndex !== months.length - 1 ? "1px solid #ddd" : "none",
                              minWidth: '120px' // Set minimum width for day cells
                            }}
                          >
                            {day <= daysInMonth ? (
                              dayEvents.map((event, idx) => (
                                <EventChip key={idx} event={event} />
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ color: "#ccc" }}>
                                -
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      } else {
        // Similar changes for week view
        const days = [];
        const currentDate = new Date(dateRange.startDate);
        
        while (currentDate <= dateRange.endDate) {
          days.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return (
          <Box sx={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "8px", 
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
            padding: "16px", 
            marginTop: "5px",
            overflowX: 'auto' // Add horizontal scrolling if needed
          }}>
            {loadingSlots ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: `60px repeat(${days.length}, minmax(120px, 1fr))`, // Reduced date column width
                gap: "0px",
              }}>
                <Box sx={{ 
                  fontWeight: "bold", 
                  textAlign: "center", 
                  padding: "8px", 
                  backgroundColor: "#f0f0f0",
                  borderRight: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  position: 'sticky',
                  left: 0,
                  zIndex: 1
                }}>
                  Date
                </Box>
                {days.map((day, index) => (
                  <Box 
                    key={day.toISOString()} 
                    sx={{ 
                      fontWeight: "bold", 
                      textAlign: "center", 
                      padding: "8px", 
                      backgroundColor: "#f0f0f0",
                      borderRight: index !== days.length - 1 ? "1px solid #ddd" : "none",
                      borderBottom: "1px solid #ddd",
                      minWidth: '120px' // Set minimum width for day headers
                    }}>
                    {day.toLocaleDateString("en-US", { weekday: 'short' })}-{day.getDate()}
                  </Box>
                ))}
    
                {days.map((day, dayIndex) => {
                  const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                  const dayEvents = calendarEvents.filter(event => event.date === formattedDate);
    
                  return (
                    <Box
                      key={formattedDate}
                      sx={{
                        padding: "8px",
                        backgroundColor: "#ffffff",
                        minHeight: "100px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        borderRight: dayIndex !== days.length - 1 ? "1px solid #ddd" : "none",
                        minWidth: '120px' // Set minimum width for day cells
                      }}
                    >
                      {dayEvents.map((event, idx) => (
                        <EventChip key={idx} event={event} />
                      ))}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      }
    }


function StudentHome() {
  const [view, setView] = useState("timeline");
  const [timeRange, setTimeRange] = useState("8-20");
  const [calendarView, setCalendarView] = useState("month");
  const [openRequestSchedule, setOpenRequestSchedule] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const loggedInEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!loggedInEmail) return;
      
      try {
        setLoadingSlots(true);
        const response = await axios.get(
          `http://localhost:8000/api/requests/booked-slots/${loggedInEmail}`
        );
        setBookedSlots(response.data);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setSnackbar({
          open: true,
          message: "Failed to load booked slots",
          severity: "error"
        });
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [loggedInEmail, dateRange, view, refreshKey]);

  const handleChange = (event, newValue) => {
    setView(newValue);
  };

  const handleOpenRequestSchedule = () => {
    setOpenRequestSchedule(true);
  };

  const handleCloseRequestSchedule = () => {
    setOpenRequestSchedule(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleCalendarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const handleStartDateChange = (date) => {
    setDateRange(prev => ({
      ...prev,
      startDate: date
    }));
  };

  const handleEndDateChange = (date) => {
    setDateRange(prev => ({
      ...prev,
      endDate: date
    }));
  };

  const handleApplyDateRange = () => {
    handleCalendarClose();
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ backgroundColor: "#f6f5fa", minHeight: "100vh", width: "88vw", padding: "18px" }}>
        <Box
          sx={{
            padding: "6px",
            marginTop: "45px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            <Tabs value={view} onChange={handleChange} sx={{ minHeight: "40px" }}>
              <Tab
                label="Calendar"
                value="calendar"
                icon={<CalendarTodayIcon sx={{ fontSize: "14px" }} />}
                iconPosition="start"
                sx={{ fontSize: "12px", minHeight: "40px", padding: "8px 12px" }}
              />
              <Tab
                label="Timeline"
                value="timeline"
                icon={<TimelineIcon sx={{ fontSize: "14px" }} />}
                iconPosition="start"
                sx={{ fontSize: "12px", minHeight: "40px", padding: "8px 12px" }}
              />
            </Tabs>
          
            <Box sx={{ display: "flex", alignItems: "center", gap: "1px"}}>
              <IconButton sx={{ padding: "6px" }}>
                <SearchIcon sx={{ fontSize: "21px", color: "#000" }} />
              </IconButton>
              <Typography variant="body2" sx={{ fontSize: "16px", color: "#000" }}>
                Search
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "12px", backgroundColor: "green", borderRadius: "20px", padding: "6px 16px" }}
                onClick={handleOpenRequestSchedule}
              >
                Request Schedule
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px" }}>
              {view === "timeline" 
                ? dateRange.startDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                : calendarView === "month" 
                  ? `${dateRange.startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })} - 
                     ${dateRange.endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                  : `${dateRange.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - 
                     ${dateRange.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </Typography>
            <IconButton onClick={handleCalendarClick} size="small" sx={{ padding: "6px" }}>
              <ArrowDropDownIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCalendarClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={{ padding: "16px", minWidth: "300px" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Select Date Range</Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <DatePicker
                    views={view === "timeline" ? undefined : calendarView === "month" ? ["month", "year"] : undefined}
                    label={view === "timeline" ? "Select Date" : "Start Date"}
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    sx={{ width: "100%" }}
                  />
                  {view !== "timeline" && (
                    <DatePicker
                      views={calendarView === "month" ? ["month", "year"] : undefined}
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={handleEndDateChange}
                      sx={{ width: "100%" }}
                    />
                  )}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleApplyDateRange}
                  sx={{ width: "100%", backgroundColor: "darkgreen" }}
                >
                  Apply
                </Button>
              </Box>
            </Popover>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {view === "calendar" ? (
              <FormControl variant="outlined" size="small" sx={{ minWidth: "120px", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <Select
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value)}
                  displayEmpty
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem value="month" sx={{ fontSize: "12px" }}>Month</MenuItem>
                  <MenuItem value="week" sx={{ fontSize: "12px" }}>Week</MenuItem>
                </Select>
              </FormControl>
            ) : (
            // In the StudentHome component's return statement, replace the FormControl for timeline view with:
// In the StudentHome component's return statement, replace the FormControl for timeline view with:
<FormControl variant="outlined" size="small" sx={{ minWidth: "180px", backgroundColor: "#ffffff", borderRadius: "4px" }}>
  <Select
    value={timeRange}
    onChange={(e) => setTimeRange(e.target.value)}
    displayEmpty
    sx={{ fontSize: "12px" }}
  >
    <MenuItem value="8-20" sx={{ fontSize: "12px" }}>8:00 AM - 8:00 PM (Full Day)</MenuItem>
  </Select>
</FormControl>
            )}

            <Box sx={{ padding: "6px 12px", backgroundColor: "#ffffff", borderRadius: "4px", border: "1px solid #ccc" }}>
              <Typography variant="body2" sx={{ fontSize: "12px" }}>Now</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          {view === "timeline" ? (
            <TimelineView 
              timeRange={timeRange} 
              date={dateRange.startDate} 
              bookedSlots={bookedSlots}
              loadingSlots={loadingSlots}
            />
          ) : (
            <CalendarView 
              calendarView={calendarView} 
              dateRange={dateRange} 
              bookedSlots={bookedSlots}
              loadingSlots={loadingSlots}
            />
          )}
        </Box>

        <RequestSchedule
          open={openRequestSchedule}
          handleClose={handleCloseRequestSchedule}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default StudentHome;

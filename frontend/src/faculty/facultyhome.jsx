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
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';

// Color mapping for different event types
// Color mapping for different event types
const eventTypeColors = {
  'Lecture': { border: '#3f51b5', background: '#e8eaf6' },
  'Consultation': { border: '#009688', background: '#e0f2f1' },
  'Office Hours': { border: '#ff5722', background: '#fbe9e7' },
  'Workshop': { border: '#673ab7', background: '#ede7f6' },
  'Meeting': { border: '#e91e63', background: '#fce4ec' },
  'Seminar': { border: '#00bcd4', background: '#e0f7fa' },
  'Lab Session': { border: '#8bc34a', background: '#f1f8e9' },
  'Review': { border: '#ffc107', background: '#fff8e1' },
  'Discussion': { border: '#795548', background: '#efebe9' },
  'Default': { border: '#9e9e9e', background: '#f5f5f5' }
};

const getEventColor = (title, id = '') => {
  if (!title) return eventTypeColors['Default'];

  const lowerTitle = title.toLowerCase();

  // Hardcoded types
  if (lowerTitle.includes('lecture')) return eventTypeColors['Lecture'];
  if (lowerTitle.includes('consultation')) return eventTypeColors['Consultation'];
  if (lowerTitle.includes('office hours')) return eventTypeColors['Office Hours'];
  if (lowerTitle.includes('workshop')) return eventTypeColors['Workshop'];
  if (lowerTitle.includes('meeting')) return eventTypeColors['Meeting'];
  if (lowerTitle.includes('seminar')) return eventTypeColors['Seminar'];
  if (lowerTitle.includes('lab session')) return eventTypeColors['Lab Session'];
  if (lowerTitle.includes('review')) return eventTypeColors['Review'];
  if (lowerTitle.includes('discussion')) return eventTypeColors['Discussion'];

  // Fallback: hash based on title + id
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

  const uniqueKey = `${title}-${id}`;
  const hash = uniqueKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

function EventChip({ event }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const eventColor = getEventColor(event.title, event.id);

  
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
          padding: "6px 8px",
          borderRadius: "8px",
          backgroundColor: eventColor.background,
          border: `2px solid ${eventColor.border}`,
          width: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease",
          '&:hover': {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          },
          margin: "2px 0",
          boxSizing: "border-box"
        }}
      >
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          <Typography sx={{ 
            fontSize: "16px",
            fontWeight: "bold", 
            color: "#212121",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {event.title}
          </Typography>
          <Typography sx={{ 
            fontSize: "12px",
            fontWeight: "500", 
            color: "#9E9E9E",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {event.time}
          </Typography>
        </Box>
      </Box>

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
<Typography sx={{ fontSize: "12px", fontWeight: "500", color: "action" }}>
  {event.startDate
    ? (event.spanDays > 1
        ? `${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}`
        : new Date(event.startDate).toLocaleDateString()
      )
    : 'Date not available'}
</Typography>
            
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {event.time}
            </Typography>
            
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {event.location || 'Location not specified'}
            </Typography>
            
            {event.students && (
              <>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Students: {event.students.length}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function TimelineView({ timeRange, date, bookedSlots, loadingSlots }) {
  const selectedDate = date instanceof Date ? date : new Date(date);
  const [startHour, endHour] = timeRange.split("-").map(Number);

  // Generate time slots for the selected range
  const timeSlots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    timeSlots.push({
      hour,
      label: `${hour}:00`
    });
  }

  // Calculate column width and total width
  const columnWidth = 180;
  const totalWidth = timeSlots.length * columnWidth;

  // Filter events that occur during the selected date (including multi-day events)
  const filteredEvents = bookedSlots.filter(slot => {
    const slotStart = new Date(slot.start_datetime);
    const slotEnd = new Date(slot.end_datetime);
    
    // Check if the event overlaps with the selected date
    return (
      (slotStart.toDateString() === selectedDate.toDateString()) || // Starts on this day
      (slotEnd.toDateString() === selectedDate.toDateString()) ||   // Ends on this day
      (slotStart <= selectedDate && slotEnd >= selectedDate)        // Spans across this day
    );
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
            {/* Time markers */}
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

            {/* Render events */}
            {filteredEvents.map((event, index) => {
              const start = new Date(event.start_datetime);
              const end = new Date(event.end_datetime);
              
              // Adjust start/end times to be within the current day's viewing hours
              const dayStart = new Date(selectedDate);
              dayStart.setHours(startHour, 0, 0, 0);
              
              const dayEnd = new Date(selectedDate);
              dayEnd.setHours(endHour, 0, 0, 0);
              
              const eventStart = start < dayStart ? dayStart : start;
              const eventEnd = end > dayEnd ? dayEnd : end;
              
              const pixelsPerMinute = columnWidth / 60;
              const minutesSinceStart = ((eventStart.getHours() - startHour) * 60) + eventStart.getMinutes();
              const eventDuration = (eventEnd - eventStart) / 60000; // duration in minutes

              const startPosition = minutesSinceStart * pixelsPerMinute;
              const width = eventDuration * pixelsPerMinute;

              // Only render if the event has duration on this day
              if (width <= 0) return null;
              
              return (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    left: `${startPosition}px`,
                    width: `${width}px`,
                    top: "10px",
                    padding: "0 4px",
                    boxSizing: "border-box",
                    zIndex: 2
                  }}
                >
                  <EventChip event={{
                    title: event.template_name,
                    time: `${eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${eventEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    date: selectedDate.toLocaleDateString(),
                    location: event.venue_name,
                    students: event.students || [],
                    startDate: event.start_datetime,
                    endDate: event.end_datetime,
                    spanDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                  }} />
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
              <Typography>No scheduled slots for this time period</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

function CalendarView({ calendarView, dateRange, bookedSlots, loadingSlots }) {
  // Process events to include multi-day information
  const calendarEvents = bookedSlots.map(slot => {
    const start = new Date(slot.start_datetime);
    const end = new Date(slot.end_datetime);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn("⚠️ Invalid date in slot:", slot);
      return null;
    }
  
    const isMultiDay = start.toDateString() !== end.toDateString();
    const spanDays = isMultiDay ? 
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : 1;
  
    return {
      id: slot.id || slot._id || Math.random().toString(36).substr(2, 9),
      title: slot.template_name,
      time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      location: slot.venue_name,
      students: slot.students || [],
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      isMultiDay,
      spanDays
    };
  }).filter(Boolean); // 👈 Remove nulls
  

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
        overflowX: 'auto'
      }}>
        {loadingSlots ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: `60px repeat(${months.length}, minmax(120px, 1fr))`,
            gap: "0px"
          }}>
            {/* Header row */}
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
                  minWidth: '120px'
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
                    
                    if (day > daysInMonth) {
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
                            minWidth: '120px'
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#ccc" }}>
                            -
                          </Typography>
                        </Box>
                      );
                    }

                    // Find events that occur on this date
                    const dayEvents = calendarEvents.filter(event => {
                      const eventStart = new Date(event.startDate);
                      const eventEnd = new Date(event.endDate);
                      const currentDate = new Date(formattedDate);
                      
                      return currentDate >= eventStart && currentDate <= eventEnd;
                    });

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
                          minWidth: '120px',
                          position: 'relative'
                        }}
                      >
                        {dayEvents.map((event) => {
                          const eventStart = new Date(event.startDate);
                          const currentDate = new Date(formattedDate);
                          const isFirstDay = eventStart.toDateString() === currentDate.toDateString();

                          if (isFirstDay && event.isMultiDay) {
                            return (
                              <Box
                                key={event.id}
                                sx={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  right: '8px',
                                  height: `calc(${event.spanDays * 100}% - 16px)`,
                                  zIndex: 2,
                                  display: 'flex'
                                }}
                              >
                                <EventChip 
                                  event={{
                                    ...event,
                                    displayTime: event.spanDays > 1 ? 
                                      `${event.startDate} to ${event.endDate}` : 
                                      event.time
                                  }}
                                  sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    borderRadius: '8px 8px 0 0',
                                    borderBottom: 'none',
                                    ...(event.spanDays > 1 && {
                                      borderBottomLeftRadius: 0,
                                      borderBottomRightRadius: 0
                                    })
                                  }}
                                />
                              </Box>
                            );
                          }

                          if (!isFirstDay && event.isMultiDay) {
                            return null; // Skip rendering for non-first days
                          }

                          // Regular single-day event
                          return <EventChip key={event.id} event={event} />;
                        })}
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
    // Week view implementation goes here
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
        marginBottom: "200px", // ✅ Added to give more space at the bottom
        overflowX: 'auto'
      }}>
        {loadingSlots ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: `60px repeat(${days.length}, minmax(120px, 1fr))`,
            gap: "0px",
          }}>
            {/* Week view header */}
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
                  minWidth: '120px'
                }}>
                {day.toLocaleDateString("en-US", { weekday: 'short' })}-{day.getDate()}
              </Box>
            ))}

            {/* Week view content */}
<Box sx={{ 
  display: "grid", 
  gridTemplateColumns: `60px repeat(${days.length}, minmax(120px, 1fr))`,
  gap: "0px",
  minHeight: '80px',
  alignItems: 'flex-start'
}}>
  {/* First column (label) */}
  <Box
    sx={{
      padding: '8px',
      backgroundColor: '#f9f9f9',
      fontWeight: 'bold',
      borderRight: '1px solid #ddd',
      position: 'sticky',
      left: 0,
      zIndex: 1,
      textAlign: 'center'
    }}
  >
    Events
  </Box>

  {/* One column per day */}
  {days.map((day, index) => {
    const formattedDate = day.toISOString().split('T')[0];
    const dayEvents = calendarEvents.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const current = new Date(formattedDate);
      return current >= start && current <= end;
    });

    return (
      <Box
        key={`event-cell-${index}`}
        sx={{
          padding: '8px',
          backgroundColor: '#ffffff',
          borderRight: index !== days.length - 1 ? '1px solid #ddd' : 'none',
          minWidth: '120px',
          minHeight: '60px',
          position: 'relative'
        }}
      >
        {dayEvents.map((event) => {
          const current = new Date(formattedDate);
          const eventStart = new Date(event.startDate);
          const isFirstDay = eventStart.toDateString() === current.toDateString();

          if (isFirstDay && event.isMultiDay) {
            return (
              <Box
                key={event.id}
                sx={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  width: `${event.spanDays * 120}px`, // ✅ spans horizontally 120px per day
                  height: 'fit-content', // ✅ make it adapt to content
                                    zIndex: 2,
                  display: 'flex'
                }}
              >
                <EventChip 
                  event={{
                    ...event,
                    displayTime: event.spanDays > 1 ? 
                      `${event.startDate} to ${event.endDate}` : 
                      event.time
                  }}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: 'none',
                    ...(event.spanDays > 1 && {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0
                    })
                  }}
                />
              </Box>
            );
          }

          if (!isFirstDay && event.isMultiDay) {
            return null; // Skip rendering for non-first days
          }

          // Regular single-day event
          return <EventChip key={event.id} event={event} />;
        })}
      </Box>
    );
  })}
</Box>
          </Box>
        )}
      </Box>
    );
  }
}

function FacultyHome() {
  const [view, setView] = useState("timeline");
  const [timeRange, setTimeRange] = useState("8-20");
  const [calendarView, setCalendarView] = useState("month");
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
  const [searchQuery, setSearchQuery] = useState('');
  const facultyEmail = localStorage.getItem("userEmail");

  // Filter booked slots based on search query
  const filteredBookedSlots = React.useMemo(() => {
    if (!searchQuery) return bookedSlots;
    return bookedSlots.filter(slot => 
      slot.template_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookedSlots, searchQuery]);

  useEffect(() => {
  
    // In the fetchFASchedules function:
const fetchFASchedules = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/fa-schedules/by-faculty-email/${facultyEmail}`
    );

    const schedules = response.data.data.schedules;

    const processedFASchedules = schedules.map(schedule => {
      let start, end;
    
      try {
        if (schedule.start_datetime) {
          const iso = typeof schedule.start_datetime === 'string' 
            ? schedule.start_datetime 
            : schedule.start_datetime.toISOString();
    
          // 👇 Convert to IST safely for display
          start = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        } else if (schedule.start_date && schedule.start_time) {
          const datePart = schedule.start_date.split("T")[0];
          const timePart = schedule.start_time.includes(":") ? schedule.start_time : `${schedule.start_time}:00`;
          start = new Date(`${datePart}T${timePart}`);
        } else {
          throw new Error("Missing date/time");
        }
    
        const duration = parseInt(schedule.duration);
        const durationMs = schedule.duration_unit === "Hours"
          ? duration * 60 * 60 * 1000
          : duration * 60 * 1000;
    
        end = new Date(start.getTime() + durationMs);
      } catch (err) {
        console.warn("❌ Invalid startDateTime:", schedule.start_date, schedule.start_time);
        start = new Date();
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
    
      return {
        ...schedule,
        template_name: schedule.fa_type || "FA Schedule",
        start_datetime: start,
        end_datetime: end,
        venue_name: Array.isArray(schedule.venues)
          ? schedule.venues.map(v => v.venue_name || v.name).join(", ")
          : "Location not specified",
        students: [],
        isFASchedule: true,
      };
    });
    
    
    return processedFASchedules;
  } catch (error) {
    console.error("Error fetching FA schedules:", error);
    return [];
  }
};
    
    const fetchFacultySlots = async () => {
      if (!facultyEmail) return;

      try {
        setLoadingSlots(true);
        
        const [slotsResponse, schedulesResponse, faSchedules] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/slots/faculty/${facultyEmail}`,
            {
              params: {
                startDate: dateRange.startDate.toISOString().split('T')[0],
                endDate: dateRange.endDate.toISOString().split('T')[0]
              }
            }
          ),
          axios.get(`http://localhost:8000/api/slot-schedules/by-faculty-email/${facultyEmail}`),
          fetchFASchedules()
        ]);
        
        const processedSlots = slotsResponse.data.map(slot => {
          const [startTime, endTime] = (slot.booked_time_slot || '09:00 - 10:00').split(' - ');
          const bookedDate = slot.booked_date || new Date().toISOString().split('T')[0];

          const start_datetime = new Date(`${bookedDate}T${startTime}`);
          const end_datetime = new Date(`${bookedDate}T${endTime}`);

          return {
            ...slot,
            booked_date: bookedDate,
            booked_time_slot: slot.booked_time_slot || '09:00 - 10:00',
            faculty_name: slot.faculty_incharge || 'Faculty not specified',
            venue_name: slot.venue_name || 'Location not specified',
            students: slot.students || [],
            start_datetime,
            end_datetime
          };
        });

        const processedSchedules = schedulesResponse.data.data.schedules.map(schedule => ({
          ...schedule,
          isSchedule: true
        }));

        setBookedSlots([...processedSlots, ...schedulesResponse.data.data.schedules, ...faSchedules]);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load scheduled slots",
          severity: "error"
        });
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchFacultySlots();
  }, [facultyEmail, dateRange, refreshKey]);

  const handleChange = (event, newValue) => {
    setView(newValue);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                padding: "0 8px",
                border: "1px solid #ccc"
              }}>
                <SearchIcon sx={{ fontSize: "18px", color: "#000", mr: 1 }} />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    border: "none",
                    outline: "none",
                    padding: "8px 0",
                    fontSize: "14px",
                    minWidth: "200px",
                    backgroundColor: "transparent"
                  }}
                />
              </Box>
              
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
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
              <FormControl variant="outlined" size="small" sx={{ minWidth: "180px", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  displayEmpty
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem value="8-20" sx={{ fontSize: "12px" }}>8:00 AM - 8:00 PM (Full Day)</MenuItem>
                  <MenuItem value="8-12" sx={{ fontSize: "12px" }}>8:00 AM - 12:00 PM (Morning)</MenuItem>
                  <MenuItem value="12-16" sx={{ fontSize: "12px" }}>12:00 PM - 4:00 PM (Afternoon)</MenuItem>
                  <MenuItem value="16-20" sx={{ fontSize: "12px" }}>4:00 PM - 8:00 PM (Evening)</MenuItem>
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
              bookedSlots={filteredBookedSlots}
              loadingSlots={loadingSlots}
            />
          ) : (
            <CalendarView 
              calendarView={calendarView} 
              dateRange={dateRange} 
              bookedSlots={filteredBookedSlots}
              loadingSlots={loadingSlots}
            />
          )}
        </Box>

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

export default FacultyHome;
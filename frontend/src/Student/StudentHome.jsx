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
import CloseIcon from '@mui/icons-material/Close';
import RequestSchedule from "./request_schedule";
import axios from "axios";

// Enhanced EventChip Component with Popover
function EventChip({ event }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'event-popover' : undefined;

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          backgroundColor: event.color,
          borderRadius: "4px",
          padding: "4px",
          fontSize: "12px",
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "pointer",
          '&:hover': {
            opacity: 0.9
          }
        }}
      >
        {event.title}
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {event.slotData && (
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
            <Typography variant="body2">Faculty: {event.slotData.faculty}</Typography>
            <Typography variant="body2">
              Time: {new Date(event.slotData.start).toLocaleTimeString()} - {new Date(event.slotData.end).toLocaleTimeString()}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(event.slotData.start).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">Location: {event.slotData.location}</Typography>
            {event.slotData.requestDetails && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Student: {event.slotData.requestDetails.student_name}
                </Typography>
                {event.slotData.requestDetails.roll_number && (
                  <Typography variant="body2">Roll: {event.slotData.requestDetails.roll_number}</Typography>
                )}
                {event.slotData.requestDetails.department && (
                  <Typography variant="body2">Dept: {event.slotData.requestDetails.department}</Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Popover>
    </>
  );
}

// TimelineView Component with Booked Slots
// TimelineView Component with Booked Slots
function TimelineView({ timeRange, date, bookedSlots, loadingSlots }) {
  // Ensure `date` is a valid Date object
  const selectedDate = date instanceof Date ? date : new Date(date);

  // Parse the time range
  const [startHour, endHour] = timeRange.split("-").map(Number);

  // Generate time slots for the selected range
  const timeSlots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    timeSlots.push(`${hour}:00`);
    if (hour !== endHour) {
      timeSlots.push(`${hour}:30`);
    }
  }

  // Filter events for the selected date and time range
  const dayEvents = bookedSlots.filter((slot) => {
    const slotDate = new Date(slot.start).toDateString();
    const slotHour = new Date(slot.start).getHours();
    return (
      slotDate === selectedDate.toDateString() &&
      slotHour >= startHour &&
      slotHour < endHour
    );
  });

  // Convert events to timeline format with actual start/end times
  const timelineEvents = dayEvents.map((event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

    return {
      startTime: startMinutes,
      endTime: endMinutes,
      title: event.title,
      duration: (endMinutes - startMinutes) / 60, // Duration in hours
      color: event.color || "#4CAF50",
      slotData: event,
    };
  });

  // Calculate total minutes in the time range for positioning
  const totalMinutes = (endHour - startHour) * 60;

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        marginTop: "5px",
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
              gridTemplateColumns: `repeat(${timeSlots.length}, 1fr)`,
              backgroundColor: "#ffffff",
            }}
          >
            {timeSlots.map((time, index) => (
              <Box
                key={time}
                sx={{
                  textAlign: "center",
                  padding: "4px",
                  borderRight:
                    index !== timeSlots.length - 1 ? "1px solid #ddd" : "none",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "10px" }}>
                  {time}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Timeline content */}
          <Box
            sx={{
              position: "relative",
              height: "60px",
              border: "1px solid #ddd",
              backgroundColor: "#f9f9f9",
              mt: 1,
            }}
          >
            {/* Time markers */}
            {timeSlots.map((time, index) => (
              <Box
                key={`marker-${time}`}
                sx={{
                  position: "absolute",
                  left: `${(index / timeSlots.length) * 100}%`,
                  height: "100%",
                  borderLeft: index > 0 ? "1px dashed #ccc" : "none",
                  width: "1px",
                }}
              />
            ))}

            {/* Events */}
            {timelineEvents.map((event, index) => {
              const startPos = ((event.startTime - startHour * 60) / totalMinutes) * 100;
              let width = ((event.endTime - event.startTime) / totalMinutes) * 100;
              width = width > 0 ? width : 2; // Ensure a minimum width to make events visible

              return (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    top: "10px",
                    left: `${startPos}%`,
                    width: `${width}%`,
                    backgroundColor: event.color,
                    borderRadius: "4px",
                    padding: "4px",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                  title={`${event.slotData.title} (${new Date(event.slotData.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(event.slotData.end).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })})`}
                >
                  {event.slotData.title}
                </Box>
              );
            })}
          </Box>

          {!loadingSlots && timelineEvents.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
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

// CalendarView Component with Booked Slots
function CalendarView({ calendarView, dateRange, bookedSlots, loadingSlots }) {
  // Process booked slots into calendar events
  const calendarEvents = bookedSlots.map(slot => ({
    date: new Date(slot.start).toISOString().split('T')[0],
    title: slot.title,
    color: slot.color || '#4CAF50',
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
      <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", padding: "16px", marginTop: "5px" }}>
        {loadingSlots ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${months.length + 1}, 1fr)`, 
            gap: "0px",
          }}>
            <Box sx={{ 
              fontWeight: "bold", 
              textAlign: "center", 
              padding: "8px", 
              backgroundColor: "#f0f0f0",
              borderRight: "1px solid #ddd",
              borderBottom: "1px solid #ddd"
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
                  borderBottom: "1px solid #ddd"
                }}>
                {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
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
                    borderRight: "1px solid #ddd"
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
                          borderRight: monthIndex !== months.length - 1 ? "1px solid #ddd" : "none"
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
    // Week view implementation
    const days = [];
    const currentDate = new Date(dateRange.startDate);
    
    while (currentDate <= dateRange.endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", padding: "16px", marginTop: "5px" }}>
        {loadingSlots ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${days.length}, 1fr)`, 
            gap: "0px",
          }}>
            {days.map((day, index) => (
              <Box 
                key={day.toISOString()} 
                sx={{ 
                  fontWeight: "bold", 
                  textAlign: "center", 
                  padding: "8px", 
                  backgroundColor: "#f0f0f0",
                  borderRight: index !== days.length - 1 ? "1px solid #ddd" : "none",
                  borderBottom: "1px solid #ddd"
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
                    borderRight: dayIndex !== days.length - 1 ? "1px solid #ddd" : "none"
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
  const [timeRange, setTimeRange] = useState("8-14");
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

  // Fetch booked slots when date range or view changes
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
    setRefreshKey(prev => prev + 1); // Refresh data when modal closes
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
        {/* Top Container */}
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

        {/* Date Range Selector */}
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
              // In StudentHome component, replace the timeRange MenuItems
<FormControl variant="outlined" size="small" sx={{ minWidth: "120px", backgroundColor: "#ffffff", borderRadius: "4px" }}>
  <Select
    value={timeRange}
    onChange={(e) => setTimeRange(e.target.value)}
    displayEmpty
    sx={{ fontSize: "12px" }}
  >
    <MenuItem value="8-14" sx={{ fontSize: "12px" }}>8:00 - 14:00</MenuItem>
    <MenuItem value="15-21" sx={{ fontSize: "12px" }}>15:00 - 21:00</MenuItem>
  </Select>
</FormControl>
            )}

            <Box sx={{ padding: "6px 12px", backgroundColor: "#ffffff", borderRadius: "4px", border: "1px solid #ccc" }}>
              <Typography variant="body2" sx={{ fontSize: "12px" }}>Now</Typography>
            </Box>
          </Box>
        </Box>

        {/* Content View */}
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

        {/* Request Schedule Dialog */}
        <RequestSchedule
          open={openRequestSchedule}
          handleClose={handleCloseRequestSchedule}
        />

        {/* Snackbar for notifications */}
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
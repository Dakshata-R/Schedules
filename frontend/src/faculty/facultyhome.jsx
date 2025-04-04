import React, { useState } from "react";
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
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SelectTemplate from "../../src/components/schedules_template/SelectTemplate";

// Reusable EventChip Component
function EventChip({ event }) {
  return (
    <Box
      sx={{
        backgroundColor: event.color,
        borderRadius: "4px",
        padding: "4px",
        fontSize: "12px",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {event.title}
    </Box>
  );
}

// TimelineView Component - Modified to show only one date
function TimelineView({ timeRange, date }) {
  const timeRanges = {
    "1-8": ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00"],
    "9-16": ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    "17-24": ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"],
  };

  const times = timeRanges[timeRange] || [];
  // Sample events filtered by the selected date
  const events = [
    { time: "2:00", title: "Lecture", duration: "1 hr", color: "#d8bfd8", borderColor: "#800080" },
    { time: "10:00", title: "Meeting", duration: "2 hr", color: "#add8e6", borderColor: "#00008b" },
    { time: "18:00", title: "Workshop", duration: "1.5 hr", color: "#90ee90", borderColor: "#006400" },
  ];

  return (
    <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", padding: "16px", marginTop: "5px" }}>
      {/* Date Header */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {date.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </Typography>
      
      {/* Time Row */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${times.length}, 1fr)`, 
        backgroundColor: "#ffffff",
      }}>
        {times.map((time, index) => (
          <Box key={time} sx={{
            textAlign: "center",
            padding: "8px",
            borderRight: index !== times.length - 1 ? "1px solid #ddd" : "none",
            backgroundColor: "#f0f0f0"
          }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "12px" }}>{time}</Typography>
          </Box>
        ))}
      </Box>

      {/* Event Row */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${times.length}, 1fr)`,
      }}>
        {times.map((time, index) => (
          <Box key={time} sx={{
            textAlign: "left",
            padding: "8px",
            borderRight: index !== times.length - 1 ? "1px solid #ddd" : "none",
            position: "relative",
            minHeight: "400px",
          }}>
            {events.filter(event => event.time === time).map((event, idx) => (
              <EventChip key={idx} event={event} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// CalendarView Component (unchanged)
function CalendarView({ calendarView, dateRange }) {
  // Sample events for demonstration
  const events = [
    { date: "2023-11-11", title: "Meeting", color: "#ff69b4" },
    { date: "2023-12-14", title: "Annual Day", color: "#87ceeb" },
    { date: "2024-01-16", title: "Workshop", color: "#90ee90" },
  ];

  if (calendarView === "month") {
    // Generate array of months between start and end dates
    const months = [];
    let current = new Date(dateRange.startDate);
    current.setDate(1); // Ensure we start at the beginning of the month
    
    while (current <= dateRange.endDate) {
      months.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    // Get max days in any month to determine how many rows we need
    const maxDays = Math.max(...months.map(month => 
      new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    ));

    return (
      <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", padding: "16px", marginTop: "5px" }}>
        {/* Table Structure */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: `repeat(${months.length + 1}, 1fr)`, 
          gap: "0px",
        }}>
          {/* Header Row */}
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

          {/* Date Rows */}
          {Array.from({ length: maxDays }, (_, index) => {
            const day = index + 1;
            return (
              <React.Fragment key={day}>
                {/* Date Column */}
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

                {/* Month Columns */}
                {months.map((month, monthIndex) => {
                  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
                  const formattedDate = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayEvents = events.filter(event => event.date === formattedDate);

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
      </Box>
    );
  } else {
    // Week view logic
    const days = [];
    const currentDate = new Date(dateRange.startDate);
    
    while (currentDate <= dateRange.endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", padding: "16px", marginTop: "5px" }}>
        {/* Table Structure */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: `repeat(${days.length}, 1fr)`, 
          gap: "0px",
        }}>
          {/* Header Row */}
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

          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === formattedDate);

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
      </Box>
    );
  }
}

function ScheduleView() {
  const [view, setView] = useState("timeline");
  const [timeRange, setTimeRange] = useState("1-8");
  const [calendarView, setCalendarView] = useState("month");
  const [openSelectTemplate, setOpenSelectTemplate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)) // Default to 2 months range
  });

  const handleChange = (event, newValue) => {
    setView(newValue);
  };

  const handleOpenSelectTemplate = () => {
    setOpenSelectTemplate(true);
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplate(false);
  };

  const handleTemplateSelect = (template) => {
    console.log("Selected Template:", template);
    handleCloseSelectTemplate();
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ backgroundColor: "#f6f5fa", minHeight: "100vh",width:"88vw", padding: "18px" }}>
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
            {/* Calendar and Timeline Tabs */}
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
          
            {/* Search Icon and Text */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1px"}}>
              <IconButton sx={{ padding: "6px" }}>
                <SearchIcon sx={{ fontSize: "21px", color: "#000" }} />
              </IconButton>
              <Typography variant="body2" sx={{ fontSize: "16px", color: "#000" }}>
                Search
              </Typography>
            </Box>

            {/* Request Schedule Button */}
            <Button
              variant="contained"
              size="small"
              sx={{ fontSize: "12px", backgroundColor: "green", borderRadius: "20px", padding: "6px 16px" }}
              onClick={handleOpenSelectTemplate}
            >
              New Schedule
            </Button>
          </Box>
        </Box>

        {/* Month and Date Picker on Left | Time Range and Now on Right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            mb: 2,
          }}
        >
          {/* Left Section: Month and Date Picker */}
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
            {/* Calendar Dropdown */}
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

          {/* Right Section: Conditionally render dropdown based on view */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {view === "calendar" ? (
              // Calendar View Dropdown (Month/Week)
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
              // Timeline View Dropdown (Time Range)
              <FormControl variant="outlined" size="small" sx={{ minWidth: "120px", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  displayEmpty
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem value="1-8" sx={{ fontSize: "12px" }}>1-8</MenuItem>
                  <MenuItem value="9-16" sx={{ fontSize: "12px" }}>9-16</MenuItem>
                  <MenuItem value="17-24" sx={{ fontSize: "12px" }}>17-24</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Small Box with "Now" */}
            <Box sx={{ padding: "6px 12px", backgroundColor: "#ffffff", borderRadius: "4px", border: "1px solid #ccc" }}>
              <Typography variant="body2" sx={{ fontSize: "12px" }}>Now</Typography>
            </Box>
          </Box>
        </Box>

        {/* Content View */}
        <Box sx={{  marginTop: "16px" }}>
          {view === "timeline" ? (
            <TimelineView timeRange={timeRange} date={dateRange.startDate} />
          ) : (
            <CalendarView calendarView={calendarView} dateRange={dateRange} />
          )}
        </Box>

        {/* Select Template Popup */}
        <SelectTemplate
          open={openSelectTemplate}
          handleClose={handleCloseSelectTemplate}
          onTemplateSelect={handleTemplateSelect}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default ScheduleView;
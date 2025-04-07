import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Calendar = ({ open, onClose, selectedDates = [] }) => {
  // Use the first selected date as the initial month/year if available, otherwise use current date
  const initialDate = selectedDates.length > 0 ? new Date(selectedDates[0]) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  // Update the isDateHighlighted function in Calendar.jsx
  const isDateHighlighted = (date) => {
    if (!selectedDates || selectedDates.length === 0) return false;
    
    // Get the date in local time (ignoring timezone)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    return selectedDates.some(selectedDate => {
      const d = new Date(selectedDate);
      // Get the selected date in local time (ignoring timezone)
      const selectedDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return dateStr === selectedDateStr;
    });
  };

  // Function to generate the calendar grid for a given month and year
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(<Box key={`empty-${j}`} sx={{ width: "40px", height: "40px" }} />);
        } else if (day > daysInMonth) {
          week.push(<Box key={`empty-${j}`} sx={{ width: "40px", height: "40px" }} />);
        } else {
          const currentDate = new Date(year, month, day);
          const isHighlighted = isDateHighlighted(currentDate);

          week.push(
            <Box
              key={`day-${day}`}
              sx={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isHighlighted ? "#165B33" : "transparent",
                color: isHighlighted ? "white" : "black",
                borderRadius: "8px",
                padding: "4px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: isHighlighted ? "darkgreen" : "#f5f5f5",
                },
              }}
            >
              {day}
            </Box>
          );
          day++;
        }
      }
      calendar.push(
        <Box key={`week-${i}`} sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          {week}
        </Box>
      );
    }

    return calendar;
  };

  // Function to navigate to the previous month
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Function to navigate to the next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "400px",
          height: "500px",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ overflow: "hidden", padding: "0 16px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <IconButton onClick={handlePreviousMonth}>
            <ArrowBackIosIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "18px" }}>
            {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
              new Date(currentYear, currentMonth)
            )}
          </Typography>

          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <Typography key={day} sx={{ fontSize: "14px", fontWeight: 500, width: "40px", textAlign: "center" }}>
              {day}
            </Typography>
          ))}
        </Box>

        <Box sx={{ overflow: "hidden", height: "calc(500px - 200px)" }}>
          {generateCalendar(currentYear, currentMonth)}
        </Box>
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2, mr: 2 }}>
        <Box
          sx={{
            backgroundColor: "#165B33",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
            width: "60px",
          }}
          onClick={onClose}
        >
          Done
        </Box>
      </Box>
    </Dialog>
  );
};

export default Calendar;
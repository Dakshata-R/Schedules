import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import VenuePopup from "./venuepop";
import Meetingpreview from "../preview/meetingpreview";

const MeetingTemplate = ({ onCancel }) => {
  // State for meeting fields
  const [priority, setPriority] = useState(""); // State for priority selection
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingType, setMeetingType] = useState("Guest Lecture"); 
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState([]); // Ensure it's an array
  const [agendaItems, setAgendaItems] = useState([{ topic: "", time: "", responsible: "" }]);
  

  const [venue, setVenue] = useState("");
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle adding agenda items
  const handleAddAgendaItem = () => {
    setAgendaItems([...agendaItems, { topic: "", time: "", responsible: "" }]);
  };

  // Handle venue selection
  const handleVenueSelect = (selectedVenue) => {
    setVenue(selectedVenue);
    setVenuePopupOpen(false);
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    // Implement save draft functionality here
    console.log("Draft saved");
  };

  // Handle Preview
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  // Meeting details for preview
  const meetingDetails = {
    meetingTitle,
    meetingAgenda,
    date,
    startTime,
    endTime,
    venue,
  };

  return (
    <Box sx={{ padding: "30px" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "black", display: "flex", justifyContent: "center" }}>
        Meeting Template
      </Typography>

      {/* Venue Field with Add Button Inside */}
      {/* Meeting Title */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Meeting Title
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter meeting title"
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          mb: 3,
          height: "40px",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
            fontSize: "14px",
          },
        }}
      />

      {/* Meeting Agenda */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Meeting Agenda
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter meeting agenda"
        multiline
        rows={4}
        value={meetingAgenda}
        onChange={(e) => setMeetingAgenda(e.target.value)}
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          mb: 3,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />

      {/* Set Priority */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
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

      {/* Meeting Type */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Meeting Type
      </Typography>
      <FormControl fullWidth>
  <Select
    value={meetingType}
    onChange={(e) => setMeetingType(e.target.value)}
    sx={{
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      mb: 3,
      height: "40px",
      "& .MuiOutlinedInput-root": {
        height: "40px",
        "& fieldset": {
          borderColor: "#ddd",
        },
        "&:hover fieldset": {
          borderColor: "#1976d2",
        },
      },
      "& .MuiSelect-select": {
        padding: "10px 14px",
        fontSize: "14px",
      },
    }}
  >
    <MenuItem value="Guest Lecture">Guest Lecture</MenuItem>
    <MenuItem value="General meeting">General meeting</MenuItem>
  </Select>
</FormControl>


      {/* Organizer */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Organizer
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter organizer name"
        value={organizer}
        onChange={(e) => setOrganizer(e.target.value)}
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          mb: 3,
          height: "40px",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
            fontSize: "14px",
          },
        }}
      />

      {/* Venue */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Venue
      </Typography>
      <TextField
        fullWidth
        value={venue}
        placeholder="Enter location"
        onChange={(e) => setVenue(e.target.value)}
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          mb: 3,
          height: "40px",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
            fontSize: "14px",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={() => setVenuePopupOpen(true)}>Add</Button>
            </InputAdornment>
          ),
        }}
      />

      {/* Venue Popup */}
      <VenuePopup
        open={venuePopupOpen}
        onClose={() => setVenuePopupOpen(false)}
        onSelect={handleVenueSelect}
      />

      {/* Date and Time */}
      <Box sx={{ display: "flex", gap: 4, mt: 2, mb: 3 }}>
        {/* Date */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            Date
          </Typography>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
        </Box>

        {/* Start Time */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            Start Time
          </Typography>
          <TextField
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
        </Box>

        {/* End Time */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            End Time
          </Typography>
          <TextField
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
        </Box>
      </Box>

      {/* Attendees */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Attendees
      </Typography>
      <FormControl fullWidth>
  <Select
    multiple
    value={attendees}
    onChange={(e) => setAttendees(e.target.value)}
    sx={{
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      mb: 3,
      height: "40px",
      "& .MuiOutlinedInput-root": {
        height: "40px",
        "& fieldset": {
          borderColor: "#ddd",
        },
        "&:hover fieldset": {
          borderColor: "#1976d2",
        },
      },
      "& .MuiSelect-select": {
        padding: "10px 14px",
        fontSize: "14px",
      },
    }}
  >
    <MenuItem value="user1">User 1</MenuItem>
    <MenuItem value="user2">User 2</MenuItem>
    <MenuItem value="user3">User 3</MenuItem>
  </Select>
</FormControl>

      {/* Agenda Items */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
        Agenda Items
      </Typography>
      {agendaItems.map((item, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Topic"
            value={item.topic}
            onChange={(e) => {
              const updatedAgendaItems = [...agendaItems];
              updatedAgendaItems[index].topic = e.target.value;
              setAgendaItems(updatedAgendaItems);
            }}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="Time Allocation"
            value={item.time}
            onChange={(e) => {
              const updatedAgendaItems = [...agendaItems];
              updatedAgendaItems[index].time = e.target.value;
              setAgendaItems(updatedAgendaItems);
            }}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
          <TextField
            fullWidth
            placeholder="Responsible Person"
            value={item.responsible}
            onChange={(e) => {
              const updatedAgendaItems = [...agendaItems];
              updatedAgendaItems[index].responsible = e.target.value;
              setAgendaItems(updatedAgendaItems);
            }}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
                fontSize: "14px",
              },
            }}
          />
        </Box>
      ))}
      <Button
        onClick={handleAddAgendaItem}
        sx={{
          mt: 1,
          backgroundColor: "#4caf50",
          color: "white",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
        }}
      >
        Add Agenda Item
      </Button>

     

     {/* Add "Cancel", "Create Draft", and "Preview" buttons */}
<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
  {/* Cancel Button */}
  <Button
    variant="outlined"
    onClick={onCancel} // Call onCancel to go back to SchedulesTable
    sx={{
      color: "red",
      borderColor: "red",
      "&:hover": {
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.04)", // Light red background on hover
      },
      borderRadius: 2,
      textTransform: "none", // Prevent uppercase transformation
      padding: "8px 24px", // Adjust padding for better appearance
    }}
  >
    Cancel
  </Button>

  {/* Create Draft Button */}


  {/* Preview Button */}
  <Button
    variant="contained"
    onClick={handlePreview} // Open preview
    sx={{
      backgroundColor: "darkgreen",
      color: "white",
      "&:hover": {
        backgroundColor: "green", // Slightly lighter green on hover
      },
      borderRadius: 2,
      textTransform: "none", // Prevent uppercase transformation
      padding: "8px 24px", // Adjust padding for better appearance
    }}
  >
    Preview
  </Button>
</Box>

{/* Preview Popup */}
{isPreviewOpen && (
  <Meetingpreview
    open={isPreviewOpen}
    onClose={() => setIsPreviewOpen(false)}
    meetingDetails={meetingDetails}
  />
)}    </Box>
  );
};

export default MeetingTemplate;
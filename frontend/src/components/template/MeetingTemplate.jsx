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

const MeetingTemplate = () => {
  // State for meeting fields
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingType, setMeetingType] = useState("Internal");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [agendaItems, setAgendaItems] = useState([{ topic: "", time: "", responsible: "" }]);
  const [status, setStatus] = useState("Scheduled");
  const [venue, setVenue] = useState('');
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);

  // Handle adding agenda items
  const handleAddAgendaItem = () => {
    setAgendaItems([...agendaItems, { topic: "", time: "", responsible: "" }]);
  };

  // Handle venue selection
  const handleVenueSelect = (selectedVenue) => {
    setVenue(selectedVenue);
    setVenuePopupOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        p: 3,
        backgroundColor: "#f0f2f5",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "800px",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "black", marginLeft: "300px" }}>
          Meeting Template
        </Typography>

        {/* Venue Field with Add Button Inside */}
        
        {/* Rest of the form fields */}
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
<Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
          Venue
        </Typography>
        <TextField
          fullWidth
          value={venue}
          placeholder="Enter location"
          onChange={(e) => setVenue(e.target.value)}
          sx={{ backgroundColor: "#f8f9fa",
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
            }, }}
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

        {/* Status */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 3, color: "#333" }}>
          Status
        </Typography>
        <FormControl fullWidth>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#4caf50",
            color: "white",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Save Meeting
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingTemplate;
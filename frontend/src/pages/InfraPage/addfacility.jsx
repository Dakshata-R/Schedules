import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Green tick icon
import CancelIcon from "@mui/icons-material/Cancel"; // Red wrong icon
import PersonIcon from "@mui/icons-material/Person"; // Profile icon

const AddFacility = ({ open, onClose, onAddFacility }) => {
  const [facilityName, setFacilityName] = React.useState("");

  // Sample dropdown options
  const facilityOptions = [
    "Projector",
    "Chairs",
    "Guest chair",
    "Charging ports",
    "Mic",
    "Table",
  ];

  const handleAdd = () => {
    if (facilityName.trim() !== "") {
      onAddFacility(facilityName.trim());
      setFacilityName("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px", // Corner radius for the container
          width: "600px", // Increased width of the container
          maxWidth: "100%",
          height:"400px" // Ensure it doesn't exceed screen width
        },
      }}
    >
      {/* Top-left green tick icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "#4caf50", // Green color
        }}
      >
        <CheckCircleIcon />
      </IconButton>

      {/* Top-right red wrong icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#f44336", // Red color
        }}
        onClick={onClose} // Remove functionality
      >
        <CancelIcon />
      </IconButton>

      {/* Dialog Title (Moved to the right) */}
      <DialogTitle
        sx={{
          textAlign: "right", // Move title to the right
          paddingRight: "400px",
          marginBottom: "40px", // Add padding to avoid overlap with icons
        }}
      >
        Add Facility
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          Choose from existing infra to add (e.g., projector)
        </Typography>
        {/* Dropdown for facility selection with profile icon */}
        <Select
          fullWidth
          value={facilityName}
          onChange={(e) => setFacilityName(e.target.value)}
          displayEmpty
          sx={{ marginBottom: "20px" }}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon sx={{ color: "gray" }} /> {/* Profile icon */}
            </InputAdornment>
          }
        >
          <MenuItem value="" disabled>
            Select a facility
          </MenuItem>
          {facilityOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          Choose facility from the existing infrastructure
        </Typography>
      </DialogContent>
      <DialogActions>
        {/* Add Button */}
        <Button
  onClick={handleAdd}
  variant="contained"
  sx={{
    backgroundColor: "darkgreen",
    color: "white",
    borderRadius: "10px",
    width: "150px", // Increased width
    padding: "8px 16px", // Optional: Add padding for better spacing
  }}
>
  Add
</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFacility;
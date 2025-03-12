import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Radio,
  Button,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

// Import images (update paths as needed)
import slotIcon from "../../assets/slot icon.png";
import skillIcon from "../../assets/skill icon.webp";
import meetingIcon from "../../assets/meetingicon.jpg";
import academicIcon from "../../assets/academicschedule.webp";
import examIcon from "../../assets/examschedule.png";

const templates = [
  { name: "Slot Creation", icon: slotIcon },
  { name: "Skill Schedule", icon: skillIcon },
  { name: "Meeting", icon: meetingIcon },
  { name: "Academic Schedule", icon: academicIcon },
  { name: "Examination schedule" , icon: examIcon},
];

const SelectTemplate = ({ open, handleClose, onTemplateSelect}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "" || template.category === filter)
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs" // Reduced container width
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "5px", // Reduced padding for the entire dialog
          height: "80vh", // Full height of the viewport
          overflow: "hidden", // Prevent overflow
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select Template
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: "hidden", height: "calc(100vh - 150px)" }}>
        {/* Search and Filter Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, padding: "5px" }}>
          {/* Search Bar (75% width) */}
          <TextField
            fullWidth
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "75%" }}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Template List */}
        {filteredTemplates.map((template) => (
          <Box
            key={template.name}
            onClick={() => setSelectedTemplate(template.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              borderBottom: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            {/* Radio on the left */}
            <Radio
              checked={selectedTemplate === template.name}
              onChange={() => setSelectedTemplate(template.name)}
              sx={{ color: "darkgreen", "&.Mui-checked": { color: "darkgreen" } }} // Dark green radio
            />
            {/* Circular Image */}
            {template.icon && (
              <Avatar
                src={template.icon}
                alt={template.name}
                sx={{ width: 40, height: 40, marginRight: 2 }}
              />
            )}
            {/* Template Name on the left */}
            <Typography variant="body1" sx={{ fontWeight: 500, flexGrow: 1 }}>
              {template.name}
            </Typography>
            {/* Active Chip on the right */}
            <Chip label="Active" sx={{ backgroundColor: "darkgreen", color: "white" }} />
          </Box>
        ))}

        {/* Use Template Button */}
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          disabled={!selectedTemplate}
          onClick={() => {
            if (onTemplateSelect) {
              onTemplateSelect(selectedTemplate); // ✅ Call function
              handleClose();
            } else {
              console.error("onTemplateSelect is not defined!");
            }
          }}
        >
          Use Template
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTemplate;
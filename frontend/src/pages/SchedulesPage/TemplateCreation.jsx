import React, { useState } from "react"; // Import useState from React
import Template_area from "../../components/schedules_template/Template_area";
import Dropdown from "../../components/schedules_template/Dropdown";
import { Box, Button, Typography } from "@mui/material"; // Import Typography for text
import Preview_popup from "../../components/schedules_template/Preview_popup";

const TemplateCreation = ({ onClose }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <Box
      sx={{
        width: "94%", // Ensure it takes full width of the parent
        padding: "40px", // Match the padding of SchedulesTable
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        bgcolor: "white",
      }}
    >
      {/* Header Section with Text and Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px", // Add some spacing below the header
        }}
      >
        {/* "Schedule Template Creation" Text */}
        <Typography variant="h5" component="div" >
          Schedule Template Creation
        </Typography>

        {/* Buttons Section */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          {/* Create Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "darkgreen", // Dark green color
              color: "white",
              textTransform: "none",
              fontSize: "1rem",
              padding: "6px 20px",
              borderRadius: 1
            }}
            onClick={onClose}
          >
            Create
          </Button>

          {/* Draft Button */}
          <Button
            variant="outlined"
            sx={{
              borderColor: "#2e7d32", // Dark green border
              color: "#2e7d32", // Dark green text
              textTransform: "none",
              fontSize: "1rem",
              padding: "6px 20px",
              borderRadius: 1,
              "&:hover": {
                borderColor: "#1b5e20", // Darker green border on hover
                color: "#1b5e20", // Darker green text on hover
              },
            }}
            onClick={() => setPreviewOpen(true)} // Open the preview popup
          >
            Preview
          </Button>
        </Box>
      </Box>

       {/* Main Content Area */}
       <Box
        sx={{
          display: "flex", // Use flexbox to align Template_area and Dropdown side by side
          gap: "20px", // Add some spacing between the components
        }}
      >
        {/* Template_area Component */}
        <Box sx={{ flex: 1 }}> {/* flex: 1 makes it take up remaining space */}
          <Template_area />
        </Box>

        {/* Dropdown Component */}
        <Box sx={{ width: 150 }}> {/* Fixed width for Dropdown */}
          <Dropdown />
        </Box>
      </Box>
        {/* Render Preview Popup */}
      <Preview_popup open={previewOpen} onClose={() => setPreviewOpen(false)} />

    </Box>
  );
};

export default TemplateCreation;
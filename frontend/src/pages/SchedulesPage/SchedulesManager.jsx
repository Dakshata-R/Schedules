import React, { useState } from "react";
import SchedulesTable from "./SchedulesTable";
import TemplateCreation from "./TemplateCreation";
import { Box } from "@mui/material"; // Import Box for layout

const SchedulesManager = () => {
  const [showTemplateCreation, setShowTemplateCreation] = useState(false);

  const handleNewButtonClick = () => {
    setShowTemplateCreation(true);
  };

  const handleCloseTemplateCreation = () => {
    setShowTemplateCreation(false);
  };

  return (
    <Box
      sx={{
        width: "70%", // Match the width of SchedulesTable
        marginTop: "30px", // Match the margin of SchedulesTable
      }}
    >
      {showTemplateCreation ? (
        <TemplateCreation onClose={handleCloseTemplateCreation} />
      ) : (
        <SchedulesTable onNewButtonClick={handleNewButtonClick} />
      )}
    </Box>
  );
};

export default SchedulesManager;
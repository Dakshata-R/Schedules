import React, { useState } from "react";
import SchedulesTable from "./SchedulesTable";
import Template1 from "../../components/template/SlotTemplate";
import SelectTemplate from "../../components/schedules_template/Template_area";

import { Box } from "@mui/material"; // Import Box for layout

const SchedulesManager = () => {
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleNewButtonClick = () => {
    setOpenTemplateDialog(true);
  };

  const handleTemplateSelect = (templateName) => {
    setSelectedTemplate(templateName);
    setOpenTemplateDialog(false);
  };

  return (
    <Box
      sx={{
        width: "70%", // Match the width of SchedulesTable
        marginTop: "30px", // Match the margin of SchedulesTable
      }}
    >
      {selectedTemplate === "Slot Creation" ? (
        <Template1 />
      ) : (
        <>
          <SchedulesTable 
            onNewButtonClick={handleNewButtonClick} 
            onTemplateSelect={handleTemplateSelect} /
          >
          <SelectTemplate
            open={openTemplateDialog}
            handleClose={() => setOpenTemplateDialog(false)}
            onTemplateSelect={handleTemplateSelect}
          />
        </>
      )}
    </Box>
  );
};

export default SchedulesManager;
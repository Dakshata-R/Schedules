import React, { useState } from "react";
import SchedulesTable from "./SchedulesTable";
import SlotTemplate from "../../components/template/SlotTemplate";
import MeetingTemplate from "../../components/template/MeetingTemplate";
import SelectTemplate from "../../components/schedules_template/SelectTemplate";
import FaTemplate from "../../components/template/FaTemplate";
import SkillTemplate from "../../components/template/SkillTemplate";

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

  // Function to handle cancel and go back to SchedulesTable
  const handleCancel = () => {
    setSelectedTemplate(null); // Reset selectedTemplate to go back to SchedulesTable
  };

  return (
    <Box
        sx={{
          width: "70vw",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
         
          marginTop: "30px",
        }}
    >
      {selectedTemplate === "Slot Creation" ? (
        <SlotTemplate onCancel={handleCancel}/>
      ) : selectedTemplate === "Skill Schedule" ? (
        <SkillTemplate onCancel={handleCancel}/>
      ) : selectedTemplate === "Meeting Schedule" ? (
        <MeetingTemplate onCancel={handleCancel}/>
      ) : selectedTemplate === "Fa Schedule" ? (
        <FaTemplate onCancel={handleCancel}/>
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
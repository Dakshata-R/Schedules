import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Paper, Typography, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Personal from "./personal";
import Academic from "./academics";
import Communication from "./communication";
import Health from "./health";
import Additional from "./additional";
import ClassAdvisor from "./classadvisor"; // Import the ClassAdvisor component

const steps = [
  { id: "personal", label: "Personal" },
  { id: "academic", label: "Academic" },
  { id: "communication", label: "Communication" },
  { id: "advisor", label: "Class Advisor" },
  { id: "health", label: "Health" },
  { id: "additional", label: "Additional Info" },
];

const CustomStepIcon = ({ active, completed, icon }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: completed ? "green" : "white",
      border: `2px solid ${completed || active ? "green" : "gray"}`,
      color: completed ? "white" : "black",
      fontWeight: "bold",
    }}
  >
    {completed ? <CheckIcon sx={{ color: "white", fontSize: 16 }} /> : icon}
  </Box>
);

const UserInput = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      try {
        // Send all form data to the backend
        const response = await fetch("http://localhost:5000/api/save-student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          console.log("Final Save:", formData);
          alert("Student data saved successfully!");
        } else {
          alert("Failed to save student data.");
        }
      } catch (error) {
        console.error("Error saving final form data:", error);
        alert("An error occurred while saving the data.");
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleUpdate = (data) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <Paper
      sx={{
        width: "70%",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      <Stepper alternativeLabel activeStep={activeStep} sx={{ width: "100%" }}>
        {steps.map((step, index) => (
          <Step key={step.id} onClick={() => setActiveStep(index)} sx={{ cursor: "pointer" }}>
            <StepLabel
              StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
              sx={{
                "& .MuiStepLabel-label": {
                  color: activeStep === index ? "green" : "black",
                  fontWeight: activeStep === index ? "bold" : "normal",
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ marginTop: "20px" }}>
        {activeStep === 0 && <Personal onUpdate={handleUpdate} />}
        {activeStep === 1 && <Academic onUpdate={handleUpdate} />}
        {activeStep === 2 && <Communication onUpdate={handleUpdate} />}
        {activeStep === 3 && <ClassAdvisor onUpdate={handleUpdate} />} {/* Replace with ClassAdvisor */}
        {activeStep === 4 && <Health onUpdate={handleUpdate} />}
        {activeStep === 5 && <Additional onUpdate={handleUpdate} />}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="success" onClick={handleNext}>
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Save & Next
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default UserInput;
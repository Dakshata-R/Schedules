import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Paper, Typography, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Basic from "../InfraPage/basic";
import VenueType from "../InfraPage/venuetype";
import FacilityType from "../InfraPage/facility";

const steps = ["Basic", "Venue Type", "Facilities"];

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

const Infra = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [basicData, setBasicData] = useState({});
  const [venueTypeData, setVenueTypeData] = useState({
    accessibilityOptions: [], // Default value to avoid NULL
  });
  const [facilityData, setFacilityData] = useState({
    roles: [], // Default value to avoid NULL
    facilities: [],
    accessibilityOptions: [],
    selectedFacilities: [],
    selectedUsers: [],
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= activeStep || stepIndex === activeStep + 1) {
      setActiveStep(stepIndex);
      setErrors({}); // Clear errors when changing steps
      if (stepIndex > activeStep) {
        setCompletedSteps((prevCompleted) => [...prevCompleted, activeStep]);
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!basicData.uniqueId) newErrors.uniqueId = "Unique ID is required";
      if (!basicData.venueName) newErrors.venueName = "Venue Name is required";
      if (!basicData.location) newErrors.location = "Location is required";
      if (!basicData.priority) newErrors.priority = "Priority is required";
      if (!basicData.primaryPurpose) newErrors.primaryPurpose = "Primary Purpose is required";
      if (basicData.responsiblePersons?.length === 0) newErrors.responsiblePersons = "At least one responsible person is required";
    } else if (activeStep === 1) {
      if (!venueTypeData.capacity) newErrors.capacity = "Capacity is required";
      if (!venueTypeData.floor) newErrors.floor = "Floor is required";
      if (!venueTypeData.ventilationType) newErrors.ventilationType = "Ventilation Type is required";
    } else if (activeStep === 2) {
      if (facilityData.accessibilityOptions?.length === 0) newErrors.accessibility = "At least one accessibility option is required";
      if (facilityData.facilities?.length === 0 && facilityData.selectedFacilities?.length === 0) newErrors.facilities = "At least one facility is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndNext = async () => {
    if (validateStep()) {
      setLoading(true); // Start loading
      try {
        let response;
        if (activeStep === 0) {
          // Save Basic Data
          const formData = new FormData();
          formData.append("uniqueId", basicData.uniqueId);
          formData.append("venueName", basicData.venueName);
          formData.append("location", basicData.location);
          formData.append("priority", basicData.priority);
          formData.append("primaryPurpose", basicData.primaryPurpose);
          formData.append("responsiblePersons", JSON.stringify(basicData.responsiblePersons));
          if (basicData.image) {
            formData.append("image", basicData.image);
          }

          response = await fetch("http://localhost:5000/api/save-basic", {
            method: "POST",
            body: formData,
          });
        } else if (activeStep === 1) {
          // Save Venue Type Data
          const payload = {
            ...venueTypeData,
            accessibilityOptions: venueTypeData.accessibilityOptions || [], // Ensure accessibilityOptions is not NULL
          };

          response = await fetch("http://localhost:5000/api/save-venue-type", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }

        if (response.ok) {
          setActiveStep((prevStep) => prevStep + 1);
          setCompletedSteps((prevCompleted) => [...prevCompleted, activeStep]);
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({}); // Clear errors when going back
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
      {/* Stepper and other UI elements */}
      <Stepper alternativeLabel activeStep={activeStep} sx={{ width: "100%", marginBottom: "20px" }}>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: "pointer" }}>
            <StepLabel
              StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
              sx={{
                "& .MuiStepLabel-label": {
                  color: activeStep === index ? "green" : "black",
                  fontWeight: activeStep === index ? "bold" : "normal",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box sx={{ marginTop: "20px" }}>
        {activeStep === 0 && <Basic errors={errors} setErrors={setErrors} setBasicData={setBasicData} />}
        {activeStep === 1 && <VenueType errors={errors} setVenueTypeData={setVenueTypeData} venueTypeData={venueTypeData} />}
        {activeStep === 2 &&<FacilityType
  errors={errors}
  setFacilityData={setFacilityData}
  facilityData={facilityData}
/>}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          sx={{
            backgroundColor: "#e0e0e0",
            color: "black",
            textTransform: "none",
            "&:hover": { backgroundColor: "#bdbdbd" },
          }}
        >
          Back
        </Button>
        {activeStep !== steps.length - 1 && ( // Only show "Save & Next" for the first and second pages
          <Button
            variant="contained"
            onClick={handleSaveAndNext}
            disabled={loading}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#45a049" },
            }}
          >
            {loading ? "Saving..." : "Save & Next"}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default Infra;
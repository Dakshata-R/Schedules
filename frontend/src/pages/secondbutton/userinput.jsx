import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Personal from "./personal";
import Academic from "./academics";
import Communication from "./communication";
import Health from "./health";
import Additional from "./additional";
import ClassAdvisor from "./classadvisor";

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
  const [isFormStarted, setIsFormStarted] = useState(false);
  const [fetchedData, setFetchedData] = useState([]); // State to store fetched data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fetch-data");
        if (response.ok) {
          const data = await response.json();
          setFetchedData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleUpdate = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const handleCreate = async () => {
    setIsFormStarted(true); // Start the form
    if (activeStep === steps.length - 1) {
      try {
        const combinedData = { ...formData };
        const response = await fetch("http://localhost:5000/api/save-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(combinedData),
        });

        if (response.ok) {
          console.log("Final Save:", combinedData);
          alert("Student data saved successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to save student data: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error saving final form data:", error);
        alert("An error occurred while saving the data.");
      }
    }
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
      {/* Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4caf50",
            color: "white",
            width: "10%",
            textTransform: "none",
            "&:hover": { backgroundColor: "#45a049" },
          }}
          onClick={handleCreate}
        >
          + User
        </Button>
      </Box>

      {/* Display Fetched Data in a Table (Only when form is not started) */}
      {!isFormStarted && (
        <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Class Advisor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.dob}</TableCell>
                  <TableCell>{row.bloodGroup}</TableCell>
                  <TableCell>{row.contactNumber1}</TableCell>
                  <TableCell>{row.classAdvisor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Stepper (Only when form is started) */}
      {isFormStarted && (
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
      )}

      {/* Form Content (Only when form is started) */}
      {isFormStarted && (
        <Box sx={{ marginTop: "20px" }}>
          {activeStep === 0 && <Personal onUpdate={handleUpdate} />}
          {activeStep === 1 && <Academic onUpdate={handleUpdate} />}
          {activeStep === 2 && <Communication onUpdate={handleUpdate} />}
          {activeStep === 3 && <ClassAdvisor onUpdate={handleUpdate} />}
          {activeStep === 4 && <Health onUpdate={handleUpdate} />}
          {activeStep === 5 && <Additional onUpdate={handleUpdate} />}
        </Box>
      )}

      {/* Navigation Buttons (Only when form is started) */}
      {isFormStarted && (
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleCreate}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Save & Next
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default UserInput;
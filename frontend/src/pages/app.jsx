import React, { useState } from "react";
import Personal from "./Personal";
import Academic from "./Academic";

const App = () => {
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState(null);

  const handlePersonalSubmit = (data) => {
    setPersonalData(data);
    setStep(2); // Move to the Academic form
  };

  const handleAcademicSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-student", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    }
  };

  return (
    <div>
      {step === 1 && <Personal onNext={handlePersonalSubmit} />}
      {step === 2 && <Academic personalData={personalData} onSave={handleAcademicSubmit} />}
    </div>
  );
};

export default App;
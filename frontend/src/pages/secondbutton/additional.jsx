import React, { useState } from "react";
import axios from "axios";
import { Grid, Typography, Box, Button, TextField } from "@mui/material";
import ImageUploadLabel from "../ImageUploadLabel"; // Import the ImageUploadLabel component

const Additional = () => {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setError(""); // Clear error when a file is uploaded
  };

  const handleSave = async () => {
    if (!uploadedFile) {
      setError("Please upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append("additional_info", additionalInfo);
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post("http://localhost:8000/api/additional/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", response.data); // Debugging step
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset saved message after 3 seconds
    } catch (error) {
      console.error("Error saving additional details:", error.response ? error.response.data : error.message);
      alert("Failed to save additional details.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <form>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Form Fields */}
          <Grid item xs={12} md={8}>
            {/* Moved "Additional informations" Title Here */}
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Additional informations
            </Typography>

            {/* Additional Info Section */}
            <TextField
              label="Any additional info mention here"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />

            {/* Save Button and Saved Message */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "green", color: "white", "&:hover": { backgroundColor: "darkgreen" } }}
                onClick={handleSave}
              >
                Save
              </Button>
              {isSaved && (
                <Typography variant="body2" sx={{ ml: 2, color: "green" }}>
                  Saved!
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Right Side - Image Upload Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
              Add Documents
            </Typography>

            {/* Image Upload Section */}
            <ImageUploadLabel
              onFileChange={handleFileUpload}
              error={!!error}
              helperText={error}
            />

            {/* Display Uploaded File Name */}
            {uploadedFile && (
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Uploaded: {uploadedFile.name}
              </Typography>
            )}

            {/* File Format Information */}
            <Typography variant="caption" display="block" mt={1} textAlign="center">
              File Format: PDF, Recommended Size: 600x600 (1:1)
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Additional;
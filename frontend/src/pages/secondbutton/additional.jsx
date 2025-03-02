import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Additional = () => {
  const [additionalInfo, setAdditionalInfo] = useState(""); // ✅ Add this line
  const [healthIssues, setHealthIssues] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        return;
      }
      setUploadedFile(file);
      setError(""); // Clear error when a file is uploaded
    }
  };

  const handleSave = async () => {
    if (!uploadedFile) {
        setError("Please upload a document.");
        return;
    }

    const formData = new FormData();
    formData.append("additional_info", healthIssues); // ✅ Corrected reference
    formData.append("file", uploadedFile);

    try {
        const response = await axios.post("http://localhost:5000/api/additional/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Server response:", response.data); // ✅ Debugging step
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Reset saved message after 3 seconds
    } catch (error) {
        console.error("Error saving additional details:", error.response ? error.response.data : error.message);
        alert("Failed to save additional details.");
    }
};

  return (
    <Box sx={{ padding: 3 }}>
      {/* Bulk Upload Button (Green and Centered) */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Bulk Upload
          <input type="file" hidden />
        </Button>
      </Box>

      <form>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Form Fields */}
          <Grid item xs={12} md={8}>
            {/* Moved "Additional informations" Title Here */}
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Additional informations
            </Typography>

            {/* Health Issues Section */}
            <TextField
              label="Any additional info mention here"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              value={healthIssues}
              onChange={(e) => setHealthIssues(e.target.value)}
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
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Add Documents
            </Typography>

            {/* Centered Grey Box Wrapper */}
            <Box
              sx={{
                width: "200px",
                height: "180px",
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                mt: 1,
                border: "1px dashed gray",
                flexDirection: "column",
                margin: "0 auto", // Center the box
              }}
            >
              {/* Red PDF Icon */}
              <PictureAsPdfIcon sx={{ fontSize: 50, color: "red" }} />

              {/* Upload Button */}
              <Typography variant="body2" color="gray" component="div" mt={1}>
                Upload a PDF document (max 600x600)
                <Box display="block" mt={1}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: "green", color: "white" }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload PDF
                    <input type="file" hidden onChange={handleFileUpload} accept="application/pdf" />
                  </Button>
                </Box>
              </Typography>
            </Box>

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
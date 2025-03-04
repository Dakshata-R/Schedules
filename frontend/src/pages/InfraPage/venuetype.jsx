import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  Grid,
  Chip,
} from "@mui/material";
import { Add, ExpandMore, CloudUpload } from "@mui/icons-material";

const VenueType = ({ errors, setVenueTypeData, venueTypeData }) => {
  const [accessibilityOptions, setAccessibilityOptions] = useState(["Stairs"]);
  const [inputValue, setInputValue] = useState("");

  const handleAddAccessibility = () => {
    if (inputValue.trim() !== "") {
      const newAccessibilityOption = inputValue.trim();
      setAccessibilityOptions([...accessibilityOptions, newAccessibilityOption]);
      setVenueTypeData({
        ...venueTypeData,
        accessibilityOptions: [...venueTypeData.accessibilityOptions, newAccessibilityOption],
      });
      setInputValue("");
    }
  };

  const handleDeleteAccessibility = (index) => {
    const updatedOptions = accessibilityOptions.filter((_, i) => i !== index);
    setAccessibilityOptions(updatedOptions);
    setVenueTypeData({
      ...venueTypeData,
      accessibilityOptions: updatedOptions,
    });
  };

  const handleChange = (field, value) => {
    const updatedData = { ...venueTypeData, [field]: value };
    setVenueTypeData(updatedData); // Update the parent state
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", padding: "20px", marginTop: "0.5in" }}>
      <Grid container spacing={5}>
        {/* Left Grid */}
        <Grid item xs={12} md={8}>
          {/* Capacity of Venue Dropdown */}
          <Box sx={{ marginBottom: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                Capacity of venue
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#006400",
                  marginLeft: "3in", // Move the button 3 inches to the right
                  marginTop: "-1in", // Move the button 1 inch up
                }}
              >
                Bulk Upload
              </Button>
            </Box>
            <Select
              fullWidth
              value={venueTypeData.capacity || ""}
              onChange={(e) => handleChange("capacity", e.target.value)}
              error={!!errors.capacity}
              sx={{ backgroundColor: "#ff6fa", borderRadius: "8px" }}
            >
              <MenuItem value="60 persons">60 persons</MenuItem>
              <MenuItem value="100 persons">100 persons</MenuItem>
              <MenuItem value="200 persons">200 persons</MenuItem>
            </Select>
            {errors.capacity && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
                {errors.capacity}
              </Typography>
            )}
          </Box>

          {/* Floor Venue Located */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Floor Venue Located
            </Typography>
            <Select
              fullWidth
              value={venueTypeData.floor || ""}
              onChange={(e) => handleChange("floor", e.target.value)}
              error={!!errors.floor}
              sx={{ backgroundColor: "#f5f6fa", borderRadius: "8px" }}
            >
              <MenuItem value="Basement">Basement</MenuItem>
              <MenuItem value="Ground Floor">Ground Floor</MenuItem>
              <MenuItem value="First Floor">First Floor</MenuItem>
            </Select>
            {errors.floor && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
                {errors.floor}
              </Typography>
            )}
          </Box>

          {/* Maintenance Frequency */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Maintenance Frequency
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              {["Once", "Weekly", "Monthly", "Custom"].map((frequency) => (
                <FormControlLabel
                  key={frequency}
                  control={
                    <Checkbox
                      checked={venueTypeData.maintenanceFrequency?.includes(frequency) || false}
                      onChange={(e) => {
                        const updatedFrequency = e.target.checked
                          ? [...(venueTypeData.maintenanceFrequency || []), frequency]
                          : (venueTypeData.maintenanceFrequency || []).filter((f) => f !== frequency);
                        handleChange("maintenanceFrequency", updatedFrequency);
                      }}
                      sx={{ color: "#4caf50", "&.Mui-checked": { color: "#4caf50" } }}
                    />
                  }
                  label={frequency}
                />
              ))}
            </Box>
          </Box>

          {/* Usage Frequency */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Usage Frequency
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              {["Daily", "Weekly", "Monthly", "Custom"].map((frequency) => (
                <FormControlLabel
                  key={frequency}
                  control={
                    <Checkbox
                      checked={venueTypeData.usageFrequency?.includes(frequency) || false}
                      onChange={(e) => {
                        const updatedFrequency = e.target.checked
                          ? [...(venueTypeData.usageFrequency || []), frequency]
                          : (venueTypeData.usageFrequency || []).filter((f) => f !== frequency);
                        handleChange("usageFrequency", updatedFrequency);
                      }}
                      sx={{ color: "#4caf50", "&.Mui-checked": { color: "#4caf50" } }}
                    />
                  }
                  label={frequency}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Grid */}
        <Grid item xs={12} md={4}>
          {/* Accessibility */}
          <Box sx={{ marginBottom: "30px" }}>
            <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Accessibility
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {accessibilityOptions.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => handleDeleteAccessibility(index)}
                  sx={{ backgroundColor: "#ecfdf5", color: "#059669", borderRadius: "20px" }}
                />
              ))}
              <TextField
                size="small"
                placeholder="Add accessibility"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{ backgroundColor: "#f5f6fa", borderRadius: "8px", width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAddAccessibility}
                        sx={{ textTransform: "none", borderColor: "white", color: "gray" }}
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Ventilation Type Dropdown */}
          <Box sx={{ marginBottom: "20px" }}>
            <Typography fontSize={"19px"} sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Ventilation Type
            </Typography>
            <Select
              fullWidth
              value={venueTypeData.ventilationType || ""}
              onChange={(e) => handleChange("ventilationType", e.target.value)}
              error={!!errors.ventilationType}
              sx={{ backgroundColor: "#f5f6fa", borderRadius: "8px" }}
            >
              <MenuItem value="Open space">Open space</MenuItem>
              <MenuItem value="Air Conditioned">Air Conditioned</MenuItem>
              <MenuItem value="Natural Ventilation">Natural Ventilation</MenuItem>
            </Select>
            {errors.ventilationType && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "5px" }}>
                {errors.ventilationType}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VenueType;
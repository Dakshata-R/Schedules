import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Communication = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    mobile1: "1234567890",
    mobile2: "1234567890",
    personalEmail: "abc@bitsathy.ac.in",
    officialEmail: "abc@bitsathy.ac.in",
    location: "Rural",
    currentAddress: "type here..",
    permanentAddress: "type here...",
  });

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    if (onUpdate) {
      onUpdate(newData);
    }
  };

  return (
  <Box sx={{ width: "100%", padding: { xs: 1, sm: 3 } }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Communication Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ backgroundColor: "green", color: "white" }}
          >
            Bulk upload
          </Button>
        </Grid>

        {/* Left Side - Mobile Numbers, Emails, and Location */}
        <Grid item xs={12} md={6}>
          {/* Mobile Number 1 */}
          <Typography fontWeight="bold">Mobile Number 01</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField select defaultValue="+91" sx={{ width: "80px" }} size="small">
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+1">+1</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#f9f9f9" }}>
              <TextField
                name="mobile1"
                value={formData.mobile1}
                onChange={handleChange}
                fullWidth
                variant="standard"
                InputProps={{ disableUnderline: true, sx: { height: "30px" } }}
                size="small"
              />
              <IconButton sx={{ padding: "0px" }}>
                <PhoneIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="caption" color="gray">Enter Mobile Number 01</Typography>

          {/* Mobile Number 2 */}
          <Typography fontWeight="bold" sx={{ mt: 2 }}>Mobile Number 02</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField select defaultValue="+91" sx={{ width: "80px" }} size="small">
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+1">+1</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#f9f9f9" }}>
              <TextField
                name="mobile2"
                value={formData.mobile2}
                onChange={handleChange}
                fullWidth
                variant="standard"
                InputProps={{ disableUnderline: true, sx: { height: "30px" } }}
                size="small"
              />
              <IconButton sx={{ padding: "0px" }}>
                <PhoneIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="caption" color="gray">Enter Mobile Number 02</Typography>

          {/* Personal Email */}
          <Typography fontWeight="bold" sx={{ mt: 2 }}>Personal Mail ID</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon sx={{ color: "gray", mr: 1 }} />
            <Box sx={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#f9f9f9", flexGrow: 1 }}>
              <TextField
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                fullWidth
                variant="standard"
                InputProps={{ disableUnderline: true, sx: { height: "30px" } }}
                size="small"
              />
            </Box>
          </Box>
          <Typography variant="caption" color="gray">Enter Personal Mail ID</Typography>

          {/* Official Email */}
          <Typography fontWeight="bold" sx={{ mt: 2 }}>Official Mail ID</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon sx={{ color: "gray", mr: 1 }} />
            <Box sx={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px", backgroundColor: "#f9f9f9", flexGrow: 1 }}>
              <TextField
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                fullWidth
                variant="standard"
                InputProps={{ disableUnderline: true, sx: { height: "30px" } }}
                size="small"
              />
            </Box>
          </Box>
          <Typography variant="caption" color="gray">Enter Official Mail ID</Typography>

          {/* Location */}
          <Typography fontWeight="bold" sx={{ mt: 2 }}>Location of residence</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon sx={{ color: "gray", mr: 1 }} />
            <TextField
              select
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Urban">Urban</MenuItem>
              <MenuItem value="Rural">Rural</MenuItem>
            </TextField>
          </Box>
          <Typography variant="caption" color="gray">Enter Location of residence</Typography>
        </Grid>

        {/* Right Side - Addresses */}
        <Grid item xs={12} md={6}>
          {/* Current Address */}
          <Typography fontWeight="bold">Current address</Typography>
          <TextField
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleChange}
            fullWidth
            multiline
            rows={5}
            size="small"
          />
          <Typography variant="caption" color="gray">Enter Current address</Typography>

          {/* Permanent Address */}
          <Typography fontWeight="bold" sx={{ mt: 2 }}>Permanent address</Typography>
          <TextField
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            fullWidth
            multiline
            rows={5}
            size="small"
          />
          <Typography variant="caption" color="gray">Enter Permanent address</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Communication;
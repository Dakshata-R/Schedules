import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Add_Faculty_popup = ({ open, onClose }) => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [facultyColors, setFacultyColors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch faculties with error handling
  useEffect(() => {
    if (open) {
      const fetchFaculties = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get("http://localhost:8000/api/faculties");
          setFaculties(response.data || []);
        } catch (error) {
          console.error("Error fetching faculties:", error);
          setError("Failed to load faculties");
        } finally {
          setLoading(false);
        }
      };
      fetchFaculties();
    }
  }, [open]);

  // Generate a random color for each faculty
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Assign random colors to faculties
  useEffect(() => {
    const colors = {};
    faculties.forEach((faculty) => {
      if (faculty && faculty.id) {
        colors[faculty.id] = getRandomColor();
      }
    });
    setFacultyColors(colors);
  }, [faculties]);

  // Handle faculty selection
  const handleFacultySelection = (faculty) => {
    if (!faculty?.id) return;

    setSelectedFaculties(prev => 
      prev.some(f => f.id === faculty.id)
        ? prev.filter(f => f.id !== faculty.id)
        : [...prev, faculty]
    );
  };

  // Filter faculties based on search and filter
  const filteredFaculties = faculties.filter((faculty) => {
    if (!faculty || !faculty.name) return false;
    
    const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? (faculty.faculty_level || "").toLowerCase() === filter.toLowerCase() : true;
    return matchesSearch && matchesFilter;
  });

  const handleAssign = () => {
    onClose(selectedFaculties);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose([])}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "5px",
          height: "80%",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Assign Faculty
          </Typography>
          <IconButton onClick={() => onClose([])} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: "hidden", height: "calc(100vh - 150px)" }}>
        {/* Loading state */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Typography>Loading faculties...</Typography>
          </Box>
        )}
        
        {/* Error state */}
        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Search and Filter Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, padding: "5px" }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "75%" }}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Filter Dropdown */}
          <FormControl sx={{ width: "25%" }} size="small">
            <InputLabel>Filter by Role</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by Role"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="assistant professor">Assistant Professor</MenuItem>
              <MenuItem value="associate professor">Associate Professor</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Faculty List */}
        {!loading && filteredFaculties.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {searchQuery || filter ? "No matching faculties found" : "No faculties available"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredFaculties.map((faculty) => (
              <Box
                key={faculty.id}
                onClick={() => handleFacultySelection(faculty)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderBottom: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  marginBottom: "8px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                {/* Colored indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: facultyColors[faculty.id],
                  }}
                />
                
                {/* Checkbox */}
                <Checkbox
                  checked={selectedFaculties.some((f) => f.id === faculty.id)}
                  onChange={() => handleFacultySelection(faculty)}
                  sx={{ 
                    color: "darkgreen", 
                    "&.Mui-checked": { color: "darkgreen" } 
                  }}
                />
                
                {/* Faculty Info */}
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  flexGrow: 1 
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {faculty.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {faculty.faculty_level}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            p: 1,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={() => setSelectedFaculties([])}
              sx={{ 
                color: "red", 
                textTransform: "capitalize", 
                fontSize: "14px" 
              }}
            >
              Deselect All
            </Button>
            <Typography variant="body2" sx={{ color: "darkgreen", fontSize: "14px" }}>
              Selected: {selectedFaculties.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={selectedFaculties.length === 0}
            sx={{
              backgroundColor: "darkgreen",
              color: "white",
              width: "50%",
              '&:hover': {
                backgroundColor: '#0a5c0a'
              }
            }}
          >
            Assign
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Add_Faculty_popup;
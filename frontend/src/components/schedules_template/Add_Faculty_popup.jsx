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
import axios from "axios"; // Import axios for API calls

const Add_Faculty_popup = ({ open, onClose }) => {
  const [faculties, setFaculties] = useState([]); // State to store fetched faculties
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [facultyColors, setFacultyColors] = useState({});
  const itemsPerPage = 5;

  // Fetch faculties from the backend when the component mounts or when the popup opens
  useEffect(() => {
    if (open) {
      const fetchFaculties = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/faculties");
          setFaculties(response.data); // Set the fetched faculties
        } catch (error) {
          console.error("Error fetching faculties:", error);
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

  // Assign random colors to faculties when the component mounts
  useEffect(() => {
    const colors = {};
    faculties.forEach((faculty) => {
      colors[faculty.name] = getRandomColor(); // Use faculty name as the key
    });
    setFacultyColors(colors);
  }, [faculties]);

  // Handle faculty selection
  const handleFacultySelection = (faculty) => {
    if (selectedFaculties.some((f) => f.name === faculty.name)) {
      setSelectedFaculties(selectedFaculties.filter((f) => f.name !== faculty.name));
    } else {
      setSelectedFaculties([...selectedFaculties, faculty]);
    }
  };

  // Handle "Assign" button click
  const handleAssign = () => {
    const selectedFacultyNames = selectedFaculties.map((faculty) => faculty.name);
    onClose(selectedFacultyNames); // Pass only the names back to the parent
  };

  // Filtered faculties based on search and filter
  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? faculty.faculty_level === filter : true;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedFaculties = filteredFaculties.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);

  // Generate page numbers (e.g., 1 2 3 ... 10)
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => setPage(i)}
          sx={{
            color: page === i ? "black" : "grey",
            fontWeight: page === i ? "bold" : "normal",
            minWidth: "24px",
            padding: "6px",
          }}
        >
          {i}
        </Button>
      );
    }
    return pages;
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
        {/* Search and Filter Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, padding: "5px" }}>
          {/* Search Bar (75% width) */}
          <TextField
            fullWidth
            placeholder="Search"
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
          {/* Filter Dropdown (25% width) */}
          <FormControl sx={{ width: "25%" }} size="small">
            <InputLabel>Filter BY</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter BY"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="assistant professor">Assistant Professor</MenuItem>
              <MenuItem value="associate professor">Associate Professor</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
              <MenuItem value="HOD">HOD</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Faculty List */}
        {filteredFaculties.length === 0 ? (
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
              No faculties available.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Display the faculty list */}
            {paginatedFaculties.map((faculty) => (
              <Box
                key={faculty.name}
                onClick={() => handleFacultySelection(faculty)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  borderBottom: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  marginBottom: "8px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* Random colored line on the left */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: facultyColors[faculty.name],
                  }}
                />
                {/* Checkbox on the left */}
                <Checkbox
                  checked={selectedFaculties.some((f) => f.name === faculty.name)}
                  onChange={() => handleFacultySelection(faculty)}
                  sx={{ color: "darkgreen", "&.Mui-checked": { color: "darkgreen" } }}
                />
                {/* Faculty Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {faculty.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {faculty.faculty_level}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0, mb: 0, gap: 1 }}>
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                sx={{ color: "grey", textTransform: "capitalize" }}
              >
                Previous
              </Button>
              {renderPageNumbers()}
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                sx={{ color: "grey", textTransform: "capitalize" }}
              >
                Next
              </Button>
            </Box>
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
              sx={{ color: "red", textTransform: "capitalize", fontSize: "14px" }}
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
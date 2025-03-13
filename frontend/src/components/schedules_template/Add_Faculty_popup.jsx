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
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmptyStateImage from "../../assets/Empty state.png";

const Add_Faculty_popup = ({ open, onClose, facultyList }) => {
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [facultyColors, setFacultyColors] = useState({}); // Store colors for each faculty
  const itemsPerPage = 5; // Only 5 faculties per page

  // Generate a random color for each faculty
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Assign random colors to faculties when the component mounts or facultyList changes
  useEffect(() => {
    const colors = {};
    facultyList.forEach((faculty, index) => {
      colors[index] = getRandomColor();
    });
    setFacultyColors(colors);
  }, [facultyList]);

  // Handle faculty selection
  const handleFacultySelection = (faculty) => {
    if (selectedFaculties.includes(faculty)) {
      setSelectedFaculties(selectedFaculties.filter((f) => f !== faculty));
    } else {
      setSelectedFaculties([...selectedFaculties, faculty]);
    }
  };

  // Handle "Assign" button click
  const handleAssign = () => {
    onClose(selectedFaculties); // Pass selected faculties back to parent
  };

  // Filtered faculties based on search and filter
  const filteredFaculties = facultyList.filter((faculty) => {
    const matchesSearch = faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? faculty === filter : true;
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
      maxWidth="xs" // Reduced container width
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "5px", // Reduced padding for the entire dialog
          height: "85vh", // Full height of the viewport
          overflow: "hidden", // Prevent overflow
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
              {facultyList.map((faculty, index) => (
                <MenuItem key={index} value={faculty}>
                  {faculty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Faculty List */}
        {filteredFaculties.length === 0 ? ( // Display empty state if no faculties
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              height: "100%", // Ensure the container takes full height
              width: "100%", // Ensure the container takes full width
            }}
          >
            <img
              src={EmptyStateImage} // Use the empty state image
              alt=""
              style={{
                width: "200px", // Set desired width
                height: "200px", // Set desired height (same as width for a square)
                objectFit: "cover", // Ensures the image scales properly
                borderRadius: "8px", // Optional: Add rounded corners
              }}
            />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              No faculties available.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Display the faculty list */}
            {paginatedFaculties.map((faculty, index) => (
              <Box
                key={index}
                onClick={() => handleFacultySelection(faculty)} // Make the entire box clickable
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  borderBottom: "1px solid #e0e0e0",
                  borderRadius: "8px", // Rounded corners
                  backgroundColor: "#f9f9f9",
                  marginBottom: "8px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer", // Add pointer cursor to indicate clickability
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
                    backgroundColor: facultyColors[index], // Use pre-assigned color
                  }}
                />
                {/* Checkbox on the left */}
                <Checkbox
                  checked={selectedFaculties.includes(faculty)}
                  onChange={() => handleFacultySelection(faculty)}
                  sx={{ color: "darkgreen", "&.Mui-checked": { color: "darkgreen" } }} // Dark green checkbox
                />
                {/* Faculty Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Avatar
                    src={`https://picsum.photos/50/50?random=${index}`} // Random image for each faculty
                    alt={faculty}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {faculty}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0, mb: 0, gap: 1 }}>
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                sx={{ color: "grey", textTransform: "capitalize" }} // Title case for "Previous"
              >
                Previous
              </Button>
              {renderPageNumbers()}
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                sx={{ color: "grey", textTransform: "capitalize" }} // Title case for "Next"
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
            p: 1, // Reduced padding to make it more compact
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={() => setSelectedFaculties([])}
              sx={{ color: "red", textTransform: "capitalize", fontSize: "14px" }} // Title case for "Deselect All"
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
              backgroundColor: "darkgreen", // Dark green for "Assign"
              color: "white",
              width: "50%", // Assign button takes 50% of the right side
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
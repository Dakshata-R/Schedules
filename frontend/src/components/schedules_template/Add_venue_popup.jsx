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

const Add_venue_popup = ({ open, onClose, venues }) => {
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [venueColors, setVenueColors] = useState({}); // Store colors for each venue
  const itemsPerPage = 5; // Only 5 venues per page

  // Generate a random color for each venue
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Assign random colors to venues when the component mounts or venues change
  useEffect(() => {
    const colors = {};
    venues.forEach((venue) => {
      colors[venue.id] = getRandomColor();
    });
    setVenueColors(colors);
  }, [venues]);

  // Handle venue selection
  const handleVenueSelection = (venue) => {
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter((v) => v !== venue));
    } else {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  // Handle "Assign" button click
  const handleAssign = () => {
    onClose(selectedVenues); // Pass selected venues back to parent
  };

  // Filtered venues based on search and filter
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? venue.type === filter : true;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedVenues = filteredVenues.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

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
            Assign Venue
          </Typography>
          <IconButton onClick={() => onClose([])} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: "hidden", height: "calc(100vh - 150px)" }}> {/* Adjust height to fit within the dialog */}
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
              <MenuItem value="Seminar Hall">Seminar Hall</MenuItem>
              <MenuItem value="Lab">Lab</MenuItem>
              <MenuItem value="Drawing Hall">Drawing Hall</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Venue List */}
        {filteredVenues.length === 0 ? ( // Display empty state if no venues
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
              No venues available.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Display the venue list */}
            {paginatedVenues.map((venue) => (
              <Box
                key={venue.id}
                onClick={() => handleVenueSelection(venue)} // Make the entire box clickable
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
                    backgroundColor: venueColors[venue.id], // Use pre-assigned color
                  }}
                />
                {/* Checkbox on the left */}
                <Checkbox
                  checked={selectedVenues.includes(venue)}
                  onChange={() => handleVenueSelection(venue)}
                  sx={{ color: "darkgreen", "&.Mui-checked": { color: "darkgreen" } }} // Dark green checkbox
                />
                {/* Venue Image and Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Avatar
                    src={`https://picsum.photos/50/50?random=${venue.id}`} // Random image for each venue
                    alt={venue.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {venue.name}
                  </Typography>
                </Box>
                {/* Capacity on the right */}
                <Typography variant="body2" sx={{ color: "darkgreen" }}> {/* Dark green capacity */}
                  {venue.capacity}
                </Typography>
              </Box>
            ))}

            {/* Display empty state image below the venue when there is only one venue */}
            {filteredVenues.length === 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 1,
                  mt: 2, // Add margin top to separate from the venue list
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
              </Box>
            )}

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0, mb: 0, gap: 1 }}> {/* Removed margin */}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> {/* Reduced gap */}
            <Button
              onClick={() => setSelectedVenues([])}
              sx={{ color: "red", textTransform: "capitalize", fontSize: "14px" }} // Title case for "Deselect All"
            >
              Deselect All
            </Button>
            <Typography variant="body2" sx={{ color: "darkgreen", fontSize: "14px" }}> 
              Selected: {selectedVenues.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={selectedVenues.length === 0}
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

export default Add_venue_popup;
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
import axios from "axios";
import EmptyStateImage from "../../assets/Empty state.png";

const VenuePopup = ({ open, onClose, onSelect }) => {
  const [venues, setVenues] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [venueColors, setVenueColors] = useState({});
  const itemsPerPage = 5;

  // Fetch venues from the backend
  useEffect(() => {
    if (open) {
      axios
        .get("http://localhost:5000/api/venues")
        .then((response) => {
          setVenues(response.data);
          const colors = {};
          response.data.forEach((venue) => {
            colors[venue.id] = getRandomColor();
          });
          setVenueColors(colors);
        })
        .catch((error) => console.error("Error fetching venues:", error));
    }
  }, [open]);

  // Generate a random color for each venue
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
    const selectedVenueNames = selectedVenues.map((venue) => venue.name); // Extract venue names
    onSelect(selectedVenueNames); // Pass only the names to the parent
    onClose(); // Close the popup
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

  // Generate page numbers
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
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "5px",
          height: "85vh",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Assign Venue
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: "hidden", height: "calc(100vh - 150px)" }}>
        {/* Search and Filter Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, padding: "5px" }}>
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
        {filteredVenues.length === 0 ? (
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
            <img
              src={EmptyStateImage}
              alt=""
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              No venues available.
            </Typography>
          </Box>
        ) : (
          <Box>
            {paginatedVenues.map((venue) => (
              <Box
                key={venue.id}
                onClick={() => handleVenueSelection(venue)}
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
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: venueColors[venue.id],
                  }}
                />
                <Checkbox
                  checked={selectedVenues.includes(venue)}
                  onChange={() => handleVenueSelection(venue)}
                  sx={{ color: "darkgreen", "&.Mui-checked": { color: "darkgreen" } }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                  <Avatar
                    src={`https://picsum.photos/50/50?random=${venue.id}`}
                    alt={venue.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {venue.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "darkgreen" }}>
                  {venue.capacity}
                </Typography>
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
              onClick={() => setSelectedVenues([])}
              sx={{ color: "red", textTransform: "capitalize", fontSize: "14px" }}
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

export default VenuePopup;
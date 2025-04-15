import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
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
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmptyStateImage from "../../assets/Empty state.png";

const Add_venue_popup = ({ open, onClose, initiallySelectedVenues = [], startDateTime, endDateTime }) => {
  const [venues, setVenues] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState(initiallySelectedVenues);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [venueColors, setVenueColors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const previousOpenRef = useRef();

  const checkVenueAvailability = async (venueId, startDateTime, endDateTime) => {
    try {
      console.log('\n[Frontend] Checking availability for venue:', venueId);
      console.log('Time range:', startDateTime, 'to', endDateTime);
      
      if (!startDateTime || !endDateTime || 
          isNaN(new Date(startDateTime).getTime()) || 
          isNaN(new Date(endDateTime).getTime())) {
        console.log('Invalid or missing dates - skipping check');
        return {
          available: true,
          conflicts: []
        };
      }
  
      const response = await axios.get(
        `http://localhost:8000/api/venues/check-availability`,
        {
          params: {
            venueId,
            startDateTime: new Date(startDateTime).toISOString(),
            endDateTime: new Date(endDateTime).toISOString()
          }
        }
      );
      
      console.log('Availability response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error in venue availability check:', err);
      return {
        available: false,
        error: err.message,
        conflicts: []
      };
    }
  };

  // Generate a random color for each venue
  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Track previous open state to detect when popup is reopened
  useEffect(() => {
    previousOpenRef.current = open;
  }, [open]);

  // Fetch venues when component mounts or reopens
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/api/venues');
        const fetchedVenues = response.data.map(v => ({
          id: v.venue_id,
          name: v.venue_name,
          capacity: v.capacity,
          type: v.type || 'Seminar Hall'
        }));
        
        // Only check availability if we have valid dates
        if (startDateTime && endDateTime && 
            !isNaN(new Date(startDateTime).getTime()) && 
            !isNaN(new Date(endDateTime).getTime())) {
          // In the venue fetching useEffect
          const venuesWithAvailability = await Promise.all(
            fetchedVenues.map(async venue => {
              const availability = await checkVenueAvailability(
                venue.id, 
                startDateTime, 
                endDateTime
              );
              console.log(`Venue ${venue.name} (${venue.id}) availability:, availability`);
              return {
                ...venue,
                available: availability.available,
                conflicts: availability.conflicts
              };
            })
          );
          setVenues(venuesWithAvailability);
        } else {
          // If no valid dates, just set all venues as available
          setVenues(fetchedVenues.map(venue => ({
            ...venue,
            available: true
          })));
        }
        
        // Assign random colors to venues
        const colors = {};
        fetchedVenues.forEach((venue) => {
          colors[venue.id] = getRandomColor();
        });
        setVenueColors(colors);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Failed to fetch venues. Please try again.');
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchVenues();
    }
  }, [open, startDateTime, endDateTime]);

  // Handle venue selection
  const handleVenueSelection = (venue) => {
    if (!venue.available) return;
    
    if (selectedVenues.some(v => v.id === venue.id)) {
      setSelectedVenues(selectedVenues.filter((v) => v.id !== venue.id));
    } else {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  // Handle "Assign" button click
  const handleAssign = () => {
    if (selectedVenues.length > 0) {
      const totalCapacity = selectedVenues.reduce((sum, venue) => sum + venue.capacity, 0);
      console.log('--- Venue Selection Summary ---');
      console.log(`Total selected venues: ${selectedVenues.length}`);
      console.log(`Combined capacity: ${totalCapacity}`);
      selectedVenues.forEach(venue => {
        console.log(`- ${venue.name} (Capacity: ${venue.capacity})`);
      });
    } else {
      console.log('No venues were selected');
    }
    
    onClose(selectedVenues);
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
      onClose={() => onClose(selectedVenues)} // Pass current selected venues when closing
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
          <IconButton onClick={() => onClose(selectedVenues)} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {startDateTime && endDateTime && (
          <Typography variant="body2" color="text.secondary">
            Checking availability from {new Date(startDateTime).toLocaleString()} to {new Date(endDateTime).toLocaleString()}
          </Typography>
        )}
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

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>Loading venues...</Typography>
          </Box>
        )}

        {/* Error state */}
        {error && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Venue List */}
        {!loading && !error && filteredVenues.length === 0 ? (
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
          !loading && !error && (
            <Box>
              {paginatedVenues.map((venue) => (
                <Tooltip 
                  key={venue.id} 
                  title={!venue.available ? "This venue is already booked during the selected time period" : ""}
                  placement="left"
                >
                  <Box
                    onClick={() => venue.available && handleVenueSelection(venue)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      borderBottom: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: venue.available ? "#f9f9f9" : "#f9f9f950",
                      marginBottom: "8px",
                      position: "relative",
                      overflow: "hidden",
                      cursor: venue.available ? "pointer" : "not-allowed",
                      opacity: venue.available ? 1 : 0.6,
                      '&:hover': {
                        backgroundColor: venue.available ? '#f0f0f0' : '#f9f9f950'
                      }
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
                      checked={selectedVenues.some(v => v.id === venue.id)}
                      onChange={() => venue.available && handleVenueSelection(venue)}
                      disabled={!venue.available}
                      sx={{ 
                        color: "darkgreen", 
                        "&.Mui-checked": { color: "darkgreen" },
                        "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.26)" }
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                      <Avatar
                        src={`https://picsum.photos/50/50?random=${venue.id}`}
                        alt={venue.name}
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {venue.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {venue.type}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="body2" sx={{ color: "darkgreen" }}>
                        Capacity: {venue.capacity}
                      </Typography>
                      {!venue.available && (
                        <Typography variant="caption" sx={{ color: "red" }}>
                          Booked
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              ))}

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
          )
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

export default Add_venue_popup;
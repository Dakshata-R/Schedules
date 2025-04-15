import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  Checkbox,
  Pagination,
  IconButton,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const AddUser = ({ open, onClose, onAddUser }) => {
  const [facultyData, setFacultyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 5;

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/faculty");
        if (response.ok) {
          const data = await response.json();
          setFacultyData(data);
        } else {
          console.error("Failed to fetch faculty");
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    if (open) {
      fetchFaculty();
    }
  }, [open]);

  const filteredFaculty = facultyData.filter((faculty) =>
    `${faculty.first_name} ${faculty.faculty_level} ${faculty.department}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastFaculty = currentPage * facultyPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - facultyPerPage;
  const currentFaculty = filteredFaculty.slice(indexOfFirstFaculty, indexOfLastFaculty);

  const handleFacultySelection = (facultyId) => {
    setSelectedFaculty((prevSelected) =>
      prevSelected.includes(facultyId)
        ? prevSelected.filter((id) => id !== facultyId)
        : [...prevSelected, facultyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFaculty.length === currentFaculty.length) {
      setSelectedFaculty([]);
    } else {
      setSelectedFaculty(currentFaculty.map((faculty) => faculty.id));
    }
  };

  const handleAssignFaculty = () => {
    const selectedUsers = facultyData.filter((faculty) => selectedFaculty.includes(faculty.id));
    onAddUser(selectedUsers);
    setSelectedFaculty([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "15px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0 10px 0",
        }}
      >
        <Typography variant="h6">Add Faculty Members</Typography>
        <IconButton onClick={onClose} sx={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ marginBottom: "20px" }} />

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search faculty by name, position or department"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: "20px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <List>
            {currentFaculty.map((faculty) => (
              <Paper
                key={faculty.id}
                sx={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItem sx={{ padding: "8px 0" }}>
                  <Checkbox
                    checked={selectedFaculty.includes(faculty.id)}
                    onChange={() => handleFacultySelection(faculty.id)}
                    sx={{
                      color: "green",
                      "&.Mui-checked": {
                        color: "green",
                      },
                      marginRight: "16px",
                    }}
                  />
                  <Avatar
                    src={`https://i.pravatar.cc/40?u=${faculty.id}`}
                    alt={faculty.first_name}
                    sx={{ marginRight: "10px" }}
                  />
                  <ListItemText
                    primary={`${faculty.first_name} (${faculty.faculty_level})`}
                    secondary={faculty.department}
                    sx={{ flex: 1 }}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <Pagination
            count={Math.ceil(filteredFaculty.length / facultyPerPage)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "20px" }}>
        <Button
          onClick={handleSelectAll}
          sx={{
            color: "red",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {selectedFaculty.length === currentFaculty.length ? "Deselect All" : "Select All"}
        </Button>
        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            color: "green",
            fontWeight: "bold",
            marginRight: "auto",
          }}
        >
          {selectedFaculty.length} selected
        </Typography>
        <Button
          variant="contained"
          onClick={handleAssignFaculty}
          disabled={selectedFaculty.length === 0}
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
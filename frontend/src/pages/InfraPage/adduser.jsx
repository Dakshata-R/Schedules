import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search"; // Import the search icon

const AddUser = ({ open, onClose, onAddUser }) => {
  const [rolesData, setRolesData] = useState([]); // State to store roles data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 5;

  // Fetch roles data from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getRoles");
        if (response.ok) {
          const data = await response.json();
          // Extract role name and count of assigned roles
          const formattedData = data.map((role) => ({
            id: role.id, // Ensure each role has a unique ID
            roleName: role.roleName,
            assignedRolesCount: role.members.length,
            avatar: `https://i.pravatar.cc/40?u=${role.id}`, // Example avatar URL
          }));
          setRolesData(formattedData);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open]);

  // Handle search
  const filteredRoles = rolesData.filter((role) =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pagination
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  // Handle role selection
  const handleRoleSelection = (roleId) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(roleId)
        ? prevSelected.filter((id) => id !== roleId)
        : [...prevSelected, roleId]
    );
  };

  // Handle select/deselect all
  const handleSelectAll = () => {
    if (selectedRoles.length === currentRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(currentRoles.map((role) => role.id));
    }
  };

  // Handle assign roles
  const handleAssignRoles = () => {
    const selectedUsers = rolesData.filter((role) => selectedRoles.includes(role.id));
    onAddUser(selectedUsers); // Pass selected users to the parent component
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // Set the maximum width of the dialog
      fullWidth // Make the dialog take up the full width
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "15px", // Rounded corners for the dialog
          padding: "20px", // Padding inside the dialog
        },
      }}
    >
      {/* Dialog Title with Close Icon */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0 10px 0", // Adjust padding
        }}
      >
        <Typography variant="h6">Assign Roles</Typography>
        <IconButton onClick={onClose} sx={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Grey Line Below Title */}
      <Divider sx={{ marginBottom: "20px" }} />

      {/* Dialog Content */}
      <DialogContent>
        {/* Search Bar with Search Icon */}
        <TextField
          fullWidth
          placeholder="Search"
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

        {/* Outer Container for Roles List */}
        <Box>
          {/* Roles List */}
          <List>
            {currentRoles.map((role) => (
              <Paper
                key={role.id}
                sx={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItem sx={{ padding: "8px 0" }}>
                  {/* Green MUI Checkbox */}
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleSelection(role.id)}
                    sx={{
                      color: "green",
                      "&.Mui-checked": {
                        color: "green",
                      },
                      marginRight: "16px", // Add space between checkbox and avatar
                    }}
                  />
                  {/* Avatar Image */}
                  <Avatar
                    src={role.avatar}
                    alt={role.roleName}
                    sx={{ marginRight: "10px" }}
                  />
                  <ListItemText
                    primary={role.roleName}
                    sx={{ flex: 1 }} // Ensure the role name takes up available space
                  />
                  {/* Assigned Roles Count in Green */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    {role.assignedRolesCount} people
                  </Typography>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>

        {/* Pagination with Previous and Next Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          {/* Previous Button */}
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{
              backgroundColor: "#f5f5f5", // Grey background
              color: "black",
              textTransform: "none",
              marginRight: "10px",
              "&:disabled": {
                backgroundColor: "#f5f5f5", // Keep grey when disabled
                color: "grey",
              },
            }}
          >
            Previous
          </Button>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(filteredRoles.length / rolesPerPage)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />

          {/* Next Button */}
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredRoles.length / rolesPerPage)))
            }
            disabled={currentPage === Math.ceil(filteredRoles.length / rolesPerPage)}
            sx={{
              backgroundColor: "#f5f5f5", // Grey background
              color: "black",
              textTransform: "none",
              marginLeft: "10px",
              "&:disabled": {
                backgroundColor: "#f5f5f5", // Keep grey when disabled
                color: "grey",
              },
            }}
          >
            Next
          </Button>
        </Box>
      </DialogContent>

      {/* Dialog Actions (Footer) */}
      <DialogActions sx={{ padding: "20px" }}>
        {/* Select All/Deselect All Button in Red */}
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
          {selectedRoles.length === currentRoles.length ? "Deselect All" : "Select All"}
        </Button>
        {/* Selected Count in Green */}
        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            color: "green",
            fontWeight: "bold",
            marginRight: "auto", // Push the count to the left
          }}
        >
          {selectedRoles.length} people
        </Typography>
        {/* Assign Button */}
        <Button
          variant="contained"
          onClick={handleAssignRoles}
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
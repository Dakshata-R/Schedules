import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Menu,
  Avatar,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as CloudDownloadIcon,
  Search,
  FilterList,
  ArrowDropDown,
} from "@mui/icons-material";
import RolesPop from "../RolesPage/rolespop";

const Roles = () => {
  const [isRolesPopOpen, setIsRolesPopOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [displayedRoles, setDisplayedRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);

  // State for the three-dot menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoleMembers, setSelectedRoleMembers] = useState([]);

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getRoles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
        setDisplayedRoles(data);
      } else {
        console.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch roles when the component mounts
  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(displayedRoles.length / rowsPerPage);

  // Slice the displayedRoles array to show only the rows for the current page
  const paginatedRoles = displayedRoles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle open/close RolesPop
  const handleOpenRolesPop = () => {
    setIsRolesPopOpen(true);
    setEditingRole(null);
  };

  const handleCloseRolesPop = () => {
    setIsRolesPopOpen(false);
    setEditingRole(null);
    fetchRoles();
  };

  // Handle edit button click
  const handleEditRole = (role) => {
    setEditingRole(role);
    setIsRolesPopOpen(true);
  };

  // Handle download button click
  const handleDownloadRole = (role) => {
    const jsonData = JSON.stringify(role, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${role.roleName}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle three-dot icon click
  const handleThreeDotClick = (event, members) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoleMembers(members);
  };

  // Close the three-dot menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoleMembers([]);
  };

  // Filter roles based on search query, priority, and category
  const filterRoles = () => {
    const filtered = roles.filter((role) => {
      const matchesSearchQuery =
        role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.members.some((member) =>
          member.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        role.permissions.some((permission) =>
          permission.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesPriority = filterPriority
        ? role.priority === filterPriority
        : true;

      const matchesCategory = filterCategory
        ? role.category === filterCategory
        : true;

      return matchesSearchQuery && matchesPriority && matchesCategory;
    });

    setDisplayedRoles(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Reset to show all roles
  const handleViewAll = () => {
    setSearchQuery("");
    setFilterPriority("");
    setFilterCategory("");
    setDisplayedRoles(roles);
    setCurrentPage(1); // Reset to the first page
  };

  // Re-filter roles whenever searchQuery, filterPriority, or filterCategory changes
  useEffect(() => {
    filterRoles();
  }, [searchQuery, filterPriority, filterCategory]);

  // Function to get priority color and background color
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return { color: "red", backgroundColor: "#ffebee" };
      case "Medium":
        return { color: "blue", backgroundColor: "#e3f2fd" };
      case "Low":
        return { color: "green", backgroundColor: "#e8f5e9" };
      default:
        return { color: "inherit", backgroundColor: "#f5f5f5" };
    }
  };

  // Function to generate random colors for roles
  const getRandomColor = () => {
    const colors = ["#ffcccb", "#c6e2ff", "#d8bfd8", "#98fb98", "#ffb6c1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to delete a role from the backend and frontend
  const handleDeleteRole = async (roleId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteRole/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedRoles = roles.filter((role) => role.id !== roleId);
        setRoles(updatedRoles);
        setDisplayedRoles(updatedRoles);
      } else {
        console.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // Function to get unique permissions
  const getUniquePermissions = (permissions) => {
    const uniqueLabels = new Set();
    return permissions.filter((permission) => {
      if (!uniqueLabels.has(permission.label)) {
        uniqueLabels.add(permission.label);
        return true;
      }
      return false;
    });
  };

  // Reusable Chip component
  const Chip = ({ label, color, backgroundColor }) => {
    return (
      <Box
        sx={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: backgroundColor,
          color: color,
          fontWeight: "bold",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "72%",
        marginTop: "30px",
      }}
    >
      <Paper
        sx={{
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
          width: "94%",
          minHeight: "300px",
        }}
      >
        {/* Button at the top right corner */}
        <Button
          variant="contained"
          onClick={handleOpenRolesPop}
          sx={{
            backgroundColor: "#4caf50",
            color: "white",
            position: "absolute",
            top: "20px",
            right: "20px",
            textTransform: "none",
            fontSize: "1rem",
            padding: "5px 40px",
            "&:hover": {
              backgroundColor: "green",
            },
          }}
        >
          +Roles
        </Button>

        {/* Roles List Heading with Role Count Chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <Typography variant="h5" component="div">
            Roles list
          </Typography>
          <Chip
            label={`${roles.length} Roles`}
            backgroundColor="#e3f2fd"
            color="#1976d2"
          />
        </Box>

        <Typography variant="body1" sx={{ marginBottom: "50px" }}>
          Keep track of Roles and permissions
        </Typography>

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {/* View All Button and Category Filter on the Left */}
          <Grid item xs={4} sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              onClick={handleViewAll}
              sx={{
                backgroundColor: "#f8f8f8",
                color: "black",
                textTransform: "none",
                fontSize: "1rem",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              View All
            </Button>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search and Filter on the Right */}
          <Grid item xs={8} sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: "600px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FilterList fontSize="small" />
                  Filter
                </Box>
              </InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Filter"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Display Roles in a Table */}
        <Table sx={{ width: "100%", marginTop: "20px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>
                Permissions <ArrowDropDown sx={{ verticalAlign: "middle" }} />
              </TableCell>
              <TableCell>Assigned Roles</TableCell>
              <TableCell>Subpermissions</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRoles.map((role) => {
              const uniquePermissions = getUniquePermissions(role.permissions);
              const displayedMembers = role.members.slice(0, 5);
              const remainingMembersCount = role.members.length - 5;

              return (
                <TableRow key={role.id}>
                  <TableCell>
                    <Chip
                      label={role.roleName}
                      backgroundColor={getRandomColor()}
                      color="#000"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.priority}
                      {...getPriorityStyles(role.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <ul>
                      {uniquePermissions.map((permission, index) => (
                        <li key={index}>{permission.label}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {displayedMembers.map((member, index) => (
                        <Tooltip key={index} title={member} arrow>
                          <Avatar
                            alt={member}
                            src={`https://via.placeholder.com/40?text=${member[0]}`}
                            sx={{
                              width: 40,
                              height: 40,
                              marginLeft: index !== 0 ? "-10px" : "0px",
                              border: "2px solid white",
                            }}
                          />
                        </Tooltip>
                      ))}
                      {remainingMembersCount > 0 && (
                        <Tooltip
                          title={`${remainingMembersCount} more members`}
                          arrow
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              marginLeft: "-10px",
                              backgroundColor: "skyblue",
                              color: "blue",
                              border: "2px solid white",
                            }}
                          >
                            +{remainingMembersCount}
                          </Avatar>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: "8px" }}>
                      <IconButton
                        aria-label="download"
                        onClick={() => handleDownloadRole(role)}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditRole(role)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      onClick={(e) => handleThreeDotClick(e, role.members)}
                      sx={{ color: "blue" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "10px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          {/* Page Number Display on the Left */}
          <Typography variant="body2" sx={{ color: "grey" }}>
            Page {currentPage} of {totalPages}
          </Typography>

          {/* Previous and Next Buttons in a Container on the Right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "white", // Light grey background
              borderRadius: "8px", // Rounded corners
              padding: "8px 16px", // Padding inside the container
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
            }}
          >
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              sx={{
                color: "grey",
                textTransform: "none",
                minWidth: "auto", // Remove extra width
                "&:disabled": {
                  color: "#e0e0e0",
                },
              }}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              sx={{
                color: "grey",
                textTransform: "none",
                minWidth: "auto", // Remove extra width
                "&:disabled": {
                  color: "#e0e0e0",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Render RolesPop if isRolesPopOpen is true */}
      {isRolesPopOpen && (
        <RolesPop
          onClose={handleCloseRolesPop}
          editingRole={editingRole}
        />
      )}

      {/* Menu for displaying members */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedRoleMembers.map((member, index) => (
          <MenuItem key={index}>{member}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Roles;
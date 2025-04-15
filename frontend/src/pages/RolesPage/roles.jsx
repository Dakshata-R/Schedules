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
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip as MuiChip,
  TableContainer
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as CloudDownloadIcon,
  Search,
  FilterList,
  ArrowDropDown,
  Close
} from "@mui/icons-material";
import RolesPop from "../RolesPage/rolespop";

const Roles = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [isRolesPopOpen, setIsRolesPopOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [displayedRoles, setDisplayedRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(isMobile ? 5 : isTablet ? 7 : 10);

  // State for the three-dot menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoleMembers, setSelectedRoleMembers] = useState([]);

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getRoles");
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

  // Function to confirm and delete a role
  const confirmDeleteRole = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  // Function to delete a role from the backend and frontend
  const handleDeleteRole = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/deleteRole/${roleToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedRoles = roles.filter((role) => role.id !== roleToDelete.id);
        setRoles(updatedRoles);
        setDisplayedRoles(updatedRoles);
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
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

  // Function to show all members in a dialog
  const showAllMembers = (members) => {
    setSelectedRoleMembers(members);
    setMembersDialogOpen(true);
  };

  // Custom Chip component with responsive sizing
  const Chip = ({ label, color, backgroundColor }) => {
    return (
      <MuiChip
        label={label}
        sx={{
          backgroundColor,
          color,
          fontWeight: "bold",
          fontSize: isMobile ? "0.75rem" : "0.875rem",
          height: isMobile ? 24 : 32,
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        width: { xs: '100%', md: '72vw' },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: { xs: '16px', md: '30px' },
        padding: { xs: '8px', sm: '16px', md: '0' },
      }}
    >
      <Paper
        sx={{
          padding: { xs: '16px', sm: '24px', md: '40px' },
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
          width: "100%",
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
            position: { xs: 'static', sm: 'absolute' },
            top: { sm: "20px" },
            right: { sm: "20px" },
            textTransform: "none",
            fontSize: "1rem",
            padding: "5px 20px",
            marginBottom: { xs: '16px', sm: '0' },
            width: { xs: '100%', sm: 'auto' },
            "&:hover": {
              backgroundColor: "green",
            },
          }}
        >
          +Roles
        </Button>

        {/* Roles List Heading with Role Count Chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <Typography variant={isMobile ? "h6" : "h5"} component="h1">
            Roles list
          </Typography>
          <Chip
            label={`${roles.length} Roles`}
            backgroundColor="#e3f2fd"
            color="#1976d2"
          />
        </Box>

        <Typography variant="body1" sx={{ marginBottom: { xs: '24px', md: '50px' } }}>
          Keep track of Roles and permissions
        </Typography>

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
          {/* View All Button and Category Filter on the Left */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", gap: "10px", flexDirection: isMobile ? 'column' : 'row' }}>
            <Button
              variant="contained"
              onClick={handleViewAll}
              sx={{
                backgroundColor: "#f8f8f8",
                color: "black",
                textTransform: "none",
                fontSize: "1rem",
                padding: "10px 20px",
                width: isMobile ? '100%' : 'auto',
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              View All
            </Button>
            <FormControl sx={{ minWidth: 150, width: isMobile ? '100%' : 'auto' }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
                size={isMobile ? 'small' : 'medium'}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search and Filter on the Right */}
          <Grid item xs={12} sm={6} md={8} sx={{ display: "flex", gap: "10px", flexDirection: isMobile ? 'column' : 'row' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 150, width: isMobile ? '100%' : 'auto' }}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FilterList fontSize="small" />
                  {!isMobile && "Filter"}
                </Box>
              </InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Filter"
                size={isMobile ? 'small' : 'medium'}
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
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                {!isMobile && <TableCell>Priority</TableCell>}
                {!isMobile && (
                  <TableCell>
                    Permissions <ArrowDropDown sx={{ verticalAlign: "middle" }} />
                  </TableCell>
                )}
                <TableCell>Members</TableCell>
                {!isMobile && <TableCell>Actions</TableCell>}
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoles.length > 0 ? (
                paginatedRoles.map((role) => {
                  const uniquePermissions = getUniquePermissions(role.permissions);
                  const displayedMembers = role.members.slice(0, isMobile ? 3 : 5);
                  const remainingMembersCount = role.members.length - displayedMembers.length;

                  return (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Chip
                          label={role.roleName}
                          backgroundColor={getRandomColor()}
                          color="#000"
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Chip
                            label={role.priority}
                            {...getPriorityStyles(role.priority)}
                          />
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ maxHeight: '100px', overflowY: 'auto' }}>
                            {uniquePermissions.slice(0, 3).map((permission, index) => (
                              <Typography key={index} variant="body2">
                                • {permission.label}
                              </Typography>
                            ))}
                            {uniquePermissions.length > 3 && (
                              <Typography variant="body2" color="text.secondary">
                                +{uniquePermissions.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      )}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {displayedMembers.map((member, index) => (
                            <Tooltip key={index} title={member} arrow>
                              <Avatar
                                alt={member}
                                src={`https://placehold.co/40?text=${member[0]}`}
                                sx={{
                                  width: { xs: 32, sm: 40 },
                                  height: { xs: 32, sm: 40 },
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
                                onClick={() => showAllMembers(role.members)}
                                sx={{
                                  width: { xs: 32, sm: 40 },
                                  height: { xs: 32, sm: 40 },
                                  marginLeft: "-10px",
                                  backgroundColor: "skyblue",
                                  color: "blue",
                                  border: "2px solid white",
                                  cursor: 'pointer'
                                }}
                              >
                                +{remainingMembersCount}
                              </Avatar>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ display: "flex", gap: "8px" }}>
                            <Tooltip title="Download">
                              <IconButton
                                aria-label="download"
                                onClick={() => handleDownloadRole(role)}
                                size="small"
                              >
                                <CloudDownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                aria-label="delete"
                                onClick={() => confirmDeleteRole(role)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleEditRole(role)}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleThreeDotClick(e, role.members)}
                          sx={{ color: "blue" }}
                          size="small"
                        >
                          <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "10px",
            borderTop: "1px solid #e0e0e0",
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
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
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "8px 16px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              sx={{
                color: "grey",
                textTransform: "none",
                minWidth: "auto",
                "&:disabled": {
                  color: "#e0e0e0",
                },
              }}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              sx={{
                color: "grey",
                textTransform: "none",
                minWidth: "auto",
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{roleToDelete?.roleName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteRole} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Members Dialog */}
      <Dialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          All Members
          <IconButton
            aria-label="close"
            onClick={() => setMembersDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {selectedRoleMembers.map((member, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Avatar 
                    alt={member} 
                    src={`https://placehold.co/40?text=${member[0]}`}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText primary={member} />
                </ListItem>
                {index < selectedRoleMembers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Menu for displaying members */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: '20ch',
          },
        }}
      >
        {selectedRoleMembers.map((member, index) => (
          <MenuItem key={index}>{member}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Roles;
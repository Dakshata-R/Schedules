import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Chip,
  IconButton,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectTemplate from "../components/schedules_template/SelectTemplate";
import axios from "axios";

const StudentFiles = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAllActive, setViewAllActive] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectTemplateOpen, setSelectTemplateOpen] = useState(false);
  const rowsPerPage = 7;

  // Retrieve the logged-in email from local storage
  const loggedInEmail = localStorage.getItem("email");

  // Fetch requests from the backend based on the logged-in email
  useEffect(() => {
    const fetchRequests = async () => {
      if (!loggedInEmail) {
        console.error("No logged-in email provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/requests?email=${loggedInEmail}`
        );
        // Parse the skills field from a JSON string to an array
        const parsedRequests = response.data.map((request) => ({
          ...request,
          skills: JSON.parse(request.skills), // Parse the skills field
        }));
        setRequests(parsedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [loggedInEmail]);

  // Handle filter
  const handleFilter = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Handle delete request
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`);
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
      setSelectedStudents((prev) => prev.filter((studentId) => studentId !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  // Handle student selection
  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  // Handle select all students on current page
  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedRequests.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedRequests.map((request) => request.id));
    }
  };

  // Filtered and searched requests
  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      filter === "all" || request.status.toLowerCase() === filter;
    const matchesSearch = request.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle View All click
  const handleViewAll = () => {
    setViewAllActive(!viewAllActive);
    setFilter("all");
    setPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    console.log(`Selected template: ${template} for students:`, selectedStudents);
    // Here you would typically make an API call to create the schedule
    // Example:
    // axios.post('/api/schedules', {
    //   template,
    //   studentIds: selectedStudents,
    //   createdBy: loggedInEmail
    // });
    setSelectTemplateOpen(false);
    setSelectedStudents([]); // Clear selection after scheduling
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f6fa", minHeight: "100vh", padding: "16px" }}>
      {/* Top Container */}
      <Box
        sx={{
          padding: "6px",
          marginLeft: "80px",
          marginTop: "45px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          mb: 2,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Student Files
            </Typography>
            <Chip
              label={`${filteredRequests.length} Students`}
              sx={{ backgroundColor: "#e3f2fd", color: "#2196f3" }}
            />
          </Box>

          {/* Create Schedule Button */}
          <Button
            variant="contained"
            color="primary"
            disabled={selectedStudents.length === 0}
            onClick={() => setSelectTemplateOpen(true)}
            sx={{
              backgroundColor: "#4caf50",
              "&:disabled": {
                backgroundColor: "#a5d6a7",
              },
            }}
          >
            Create Schedule ({selectedStudents.length})
          </Button>
        </Box>

        {/* Subheader Section */}
        <Box sx={{ padding: "0 16px 16px 16px" }}>
          <Typography variant="body1">
            Manage student files and create schedules.
          </Typography>
        </Box>

        {/* Filter Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px 16px 16px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleViewAll}
              sx={{
                color: viewAllActive ? "#4caf50" : "inherit",
                borderColor: viewAllActive ? "#4caf50" : "inherit",
              }}
            >
              View all
            </Button>
          </Box>

          {/* Search and Filter */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              sx={{ backgroundColor: "#ffffff", borderRadius: "30px", width: "300px" }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: "120px" }}>
              <Select
                value={filter}
                onChange={handleFilter}
                displayEmpty
                startAdornment={<FilterListIcon sx={{ color: "gray", mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} sx={{ marginBottom: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedStudents.length > 0 &&
                      selectedStudents.length < paginatedRequests.length
                    }
                    checked={
                      paginatedRequests.length > 0 &&
                      selectedStudents.length === paginatedRequests.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(request.id)}
                        onChange={() => handleSelectStudent(request.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {request.name}
                      </Typography>
                      <Typography variant="body2">{request.rollNumber}</Typography>
                    </TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>
                      {Array.isArray(request.skills)
                        ? request.skills.join(", ")
                        : "No skills"}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#ffebee",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          width: "fit-content",
                        }}
                      >
                        <Box
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#d32f2f",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#d32f2f",
                          }}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Typography>
                        <ArrowDropDownIcon sx={{ color: "gray", fontSize: "16px" }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(request.id)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Section */}
        {filteredRequests.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <Typography variant="body1">
              Page {page} of {totalPages}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Select Template Dialog */}
      <SelectTemplate
        open={selectTemplateOpen}
        handleClose={() => setSelectTemplateOpen(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </Box>
  );
};

export default StudentFiles;
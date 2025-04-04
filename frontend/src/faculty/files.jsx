import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  styled,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SlotCreation from "./SlotCreation";

// Custom styled checkbox with green tick
const GreenCheckbox = styled(Checkbox)({
  '&.Mui-checked': {
    color: '#2e7d32',
  },
});

const FacultyFiles = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]); // New state for emails
  const [facultyName, setFacultyName] = useState("");
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [showInitialSlots, setShowInitialSlots] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openSlotDialog, setOpenSlotDialog] = useState(false);

  const initialSlots = ["All slots", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"];
  const nextSlots = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

  useEffect(() => {
    const fetchFacultyData = async () => {
      const loggedInEmail = localStorage.getItem("email");
      if (!loggedInEmail) {
        alert("Please login first.");
        return;
      }

      try {
        const facultyResponse = await axios.get(
          `http://localhost:5000/api/faculty?email=${loggedInEmail}`
        );
        const facultyData = facultyResponse.data;

        if (!facultyData) {
          alert("Faculty not found.");
          return;
        }

        setFacultyName(facultyData.name);

        const permissionResponse = await axios.get(
          `http://localhost:5000/api/permissions?name=${facultyData.name}`
        );
        const permissionData = permissionResponse.data;

        if (permissionData && permissionData.permission_label === "Student skill request approval") {
          setHasPermission(true);

          const requestsResponse = await axios.get(
            "http://localhost:5000/api/student-requests"
          );
          const requestsWithDetails = await Promise.all(
            requestsResponse.data.map(async (request) => {
              try {
                const detailsResponse = await axios.get(
                  `http://localhost:5000/api/student-requests/${request.email}/details`
                );
                return {
                  ...request,
                  mobile_number: detailsResponse.data.mobile_number,
                  register_id: detailsResponse.data.register_id,
                };
              } catch (error) {
                console.error(`Error fetching details for ${request.email}:`, error);
                return {
                  ...request,
                  mobile_number: "N/A",
                  register_id: "N/A",
                };
              }
            })
          );
          setRequests(requestsWithDetails);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchFacultyData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSkillFilter = (event) => {
    setSkillFilter(event.target.value);
  };

  const handleSelectRequest = (requestId, requestEmail) => {
    setSelectedRequests(prevSelected => {
      if (prevSelected.includes(requestId)) {
        return prevSelected.filter(id => id !== requestId);
      } else {
        return [...prevSelected, requestId];
      }
    });
    
    setSelectedEmails(prevEmails => {
      if (prevEmails.includes(requestEmail)) {
        return prevEmails.filter(email => email !== requestEmail);
      } else {
        return [...prevEmails, requestEmail];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = currentRows.map(row => row._id);
      const allEmails = currentRows.map(row => row.email);
      setSelectedRequests(allIds);
      setSelectedEmails(allEmails);
    } else {
      setSelectedRequests([]);
      setSelectedEmails([]);
    }
  };

  const uniqueSkills = [...new Set(requests.flatMap((request) => {
    try {
      return JSON.parse(request.skills);
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  }))];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesSkill = true;
    try {
      matchesSkill = skillFilter === "all" || JSON.parse(request.skills).includes(skillFilter);
    } catch (error) {
      console.error("Error parsing skills for filter:", error);
    }
    return matchesSearch && matchesSkill;
  });

  const handleNext = () => {
    setShowInitialSlots(false);
  };

  const handlePrevious = () => {
    setShowInitialSlots(true);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRequests.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOpenSlotDialog = () => {
    if (selectedEmails.length === 0) {
      alert("Please select at least one student to create a schedule");
      return;
    }
    setOpenSlotDialog(true);
  };

  const handleCloseSlotDialog = () => {
    setOpenSlotDialog(false);
  };

  return (
    <Box
      sx={{
        padding: "6px",
        marginLeft: "8px",
        marginTop: "45px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        mb: 2,
        width:"88vw"
      }}
    >
      <Box sx={{ padding: "16px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography component="div" variant="h5" sx={{ fontWeight: "bold" }}>
              Requests List
            </Typography>
            <Chip
              label={`${filteredRequests.length} Requests`}
              sx={{ backgroundColor: "#e3f2fd", color: "#2196f3" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2e7d32",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
              onClick={handleOpenSlotDialog}
            >
              Create Schedule
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#2e7d32",
                borderColor: "#2e7d32",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#1b5e20",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Box component="div" sx={{ marginBottom: "16px" }}>
          <Typography component="div" variant="body1">
            Keep track of schedules and their dates.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              label="View all"
              sx={{
                backgroundColor: "white",
                color: "grey",
                border: "1px solid grey",
                borderRadius: "10px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: "#ffffff", borderRadius: "30px", width: "300px" }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Skill</InputLabel>
              <Select value={skillFilter} onChange={handleSkillFilter} label="Skill">
                <MenuItem value="all">All Skills</MenuItem>
                {uniqueSkills.map((skill, index) => (
                  <MenuItem key={`skill-${index}`} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box component="div" sx={{ marginBottom: "40px" }}>
          <Typography component="div" variant="body1" sx={{ fontWeight: "bold" }}>
            Student Request
            <Chip
              label={`${filteredRequests.length}`}
              sx={{ backgroundColor: "green", color: "white", marginLeft: "8px" }}
            />
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: "16px", width: "100%" }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={showInitialSlots}
          >
            &lt;
          </Button>
          <Box sx={{ display: "flex", gap: 2, flexGrow: 1, justifyContent: "space-between" }}>
            {(showInitialSlots ? initialSlots : nextSlots).map((time, index) => (
              <Chip
                key={`time-${index}`}
                label={time}
                sx={{
                  backgroundColor: "white",
                  color: "grey",
                  border: "1px solid grey",
                  borderRadius: "16px",
                  flexGrow: 1,
                }}
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={!showInitialSlots}
          >
            &gt;
          </Button>
        </Box>

        {/* Slot Creation Dialog */}
        // In FacultyFiles component
<Dialog
  open={openSlotDialog}
  onClose={handleCloseSlotDialog}
  maxWidth="md"
  fullWidth
>
  <SlotCreation 
    onClose={handleCloseSlotDialog} 
    selectedStudents={selectedEmails} 
  />
</Dialog>

        {hasPermission ? (
          <>
            {error && (
              <Typography variant="body1" color="error" sx={{ marginBottom: "20px" }}>
                {error}
              </Typography>
            )}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <GreenCheckbox
                        indeterminate={
                          selectedRequests.length > 0 && 
                          selectedRequests.length < currentRows.length
                        }
                        checked={
                          currentRows.length > 0 && 
                          selectedRequests.length === currentRows.length
                        }
                        onChange={handleSelectAll}
                        icon={<CheckCircleIcon />}
                        checkedIcon={<CheckCircleIcon />}
                      />
                    </TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>User Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Contact No</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Request For</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.length > 0 ? (
                    currentRows.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell padding="checkbox">
                          <GreenCheckbox
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => handleSelectRequest(request._id, request.email)}
                            icon={<CheckCircleIcon />}
                            checkedIcon={<CheckCircleIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          {request.name}
                          <Typography variant="body2" color="textSecondary">
                            {request.register_id}
                          </Typography>
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.mobile_number}</TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            try {
                              return JSON.parse(request.skills).join(", ");
                            } catch (error) {
                              console.error("Error parsing skills:", error);
                              return "N/A";
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          <MoreVertIcon sx={{ color: "blue" }} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <Typography variant="body1">
                Page {currentPage} of {totalPages}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="body1">
            You do not have permission to view student requests.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FacultyFiles;
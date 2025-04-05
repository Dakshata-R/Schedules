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
  FormControl,
  InputLabel,
  Select,
  Chip,
  Checkbox,
  Dialog,
  InputAdornment,
  TableContainer
} from "@mui/material";
import {
  Search,
  MoreVert,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import axios from "axios";
import SlotCreation from "./SlotCreation";

const FacultyRequests = ({ navigateToSchedules, currentPage, setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage] = useState(5);
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedStudentData, setSelectedStudentData] = useState([]);
  const [error, setError] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [openSlotDialog, setOpenSlotDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/requests");
        const pendingRequests = response.data.filter(request => request.status === 'Pending');
        setRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Failed to fetch requests. Please try again later.");
      }
    };

    fetchRequests();
  }, [refreshKey]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSkillFilter = (event) => {
    setSkillFilter(event.target.value);
  };

  const handleSelectRequest = (requestId, requestEmail, requestData) => {
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

    setSelectedStudentData(prevStudents => {
      if (prevStudents.some(student => student.id === requestId)) {
        return prevStudents.filter(student => student.id !== requestId);
      } else {
        return [...prevStudents, {
          id: requestId,
          email: requestEmail,
          name: requestData.student_name,
          department: requestData.department
        }];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = currentRows.map(row => row.id);
      const allEmails = currentRows.map(row => row.student_email);
      const allStudentData = currentRows.map(row => ({
        id: row.id,
        email: row.student_email,
        name: row.student_name,
        department: row.department
      }));
      setSelectedRequests(allIds);
      setSelectedEmails(allEmails);
      setSelectedStudentData(allStudentData);
    } else {
      setSelectedRequests([]);
      setSelectedEmails([]);
      setSelectedStudentData([]);
    }
  };

  const parseSkills = (skills) => {
    try {
      if (Array.isArray(skills)) return skills;
      if (typeof skills === 'string') return JSON.parse(skills);
      return [];
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  };

  const uniqueSkills = [...new Set(requests.flatMap(request => 
    parseSkills(request.skills)
  ))].filter(skill => skill);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const requestSkills = parseSkills(request.skills);
    const matchesSkill = skillFilter === "all" || requestSkills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRequests.slice(indexOfFirstRow, indexOfLastRow);
  const totalPagesRequests = Math.ceil(filteredRequests.length / rowsPerPage);

  const handleNextPageRequests = () => {
    if (currentPage < totalPagesRequests) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageRequests = () => {
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
    setSelectedRequests([]);
    setSelectedEmails([]);
    setSelectedStudentData([]);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography component="div" variant="h5" sx={{ fontWeight: "bold" }}>
            Student Requests
          </Typography>
          <Chip
            label={`${filteredRequests.length} Requests`}
            sx={{ backgroundColor: "#e3f2fd", color: "#2196f3" }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={navigateToSchedules}
            sx={{
              backgroundColor: "#2e7d32",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1b5e20",
              },
            }}
          >
            Back to Schedules
          </Button>
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
            disabled={selectedEmails.length === 0}
          >
            {selectedRequests.length === 1 ? 'Approve Request' : 'Create Schedule'}
          </Button>
        </Box>
      </Box>

      <Box component="div" sx={{ marginBottom: "16px" }}>
        <Typography component="div" variant="body1">
          Manage student skill assessment requests.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Chip
            label="Pending requests"
            sx={{
              backgroundColor: "#fff3e0",
              color: "#ff6d00",
              borderRadius: "10px",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "gray" }} />
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

      {error ? (
        <Typography variant="body1" color="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
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
                      color="success"
                    />
                  </TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Student Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => handleSelectRequest(
                            request.id, 
                            request.student_email,
                            request
                          )}
                          icon={<CheckCircleIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          color="success"
                        />
                      </TableCell>
                      <TableCell>{request.student_name}</TableCell>
                      <TableCell>{request.student_email}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.roll_number}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {parseSkills(request.skills).map((skill, index) => (
                            <Chip key={index} label={skill} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={request.status || 'Pending'} 
                          color={
                            request.status === 'Approved' ? 'success' : 
                            request.status === 'Rejected' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No pending requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <Typography variant="body1">
              Page {currentPage} of {totalPagesRequests}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handlePreviousPageRequests}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                onClick={handleNextPageRequests}
                disabled={currentPage === totalPagesRequests || totalPagesRequests === 0}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Dialog
        open={openSlotDialog}
        onClose={handleCloseSlotDialog}
        maxWidth="md"
        fullWidth
      >
        <SlotCreation 
          onClose={handleCloseSlotDialog} 
          selectedStudents={selectedEmails}
          students={selectedStudentData}
          requestId={selectedRequests.length === 1 ? selectedRequests[0] : null}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </Dialog>
    </>
  );
};

export default FacultyRequests;
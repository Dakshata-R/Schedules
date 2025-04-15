import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TableContainer,
  IconButton,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Badge
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Search,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  CheckCircle,
  Cancel,
  AccessTime,
  CalendarToday,
  School,
  Email
} from "@mui/icons-material";
import axios from "axios";
import { green } from "@mui/material/colors";

const FacultyResponses = ({ scheduleId, scheduleName, navigateToSchedules }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [timingDetailsOpen, setTimingDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch responses when component mounts or scheduleId changes
  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get(
          `http://localhost:8000/api/slot-schedules/${scheduleId}/responses`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.data || !response.data.data || !response.data.data.responses) {
          throw new Error('Invalid response format from server');
        }
        
        // Group responses by timing
        const groupedResponses = groupResponsesByTiming(response.data.data.responses);
        setResponses(groupedResponses);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setError(error.response?.data?.message || error.message || "Failed to load responses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [scheduleId]);

  // Group responses by their booked time slot
  const groupResponsesByTiming = (responses) => {
    const groups = {};
    
    responses.forEach(response => {
      const timingKey = response.booked_time_slot || 'No specific timing';
      
      if (!groups[timingKey]) {
        groups[timingKey] = {
          timing: timingKey,
          bookedDate: response.booked_date,
          students: []
        };
      }
      
      groups[timingKey].students.push(response);
    });
    
    return Object.values(groups);
  };

  // Filter responses based on search query
  const filteredResponses = responses.filter(group => {
    return group.students.some(student => 
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  // Handle viewing student details
  const handleViewStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  // Close student details dialog
  const handleCloseStudentDetails = () => {
    setSelectedStudent(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get random color for avatar
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  return (
    <Box sx={{ backgroundColor: '#f5f9f5', minHeight: '100vh', p: 3 }}>
      {/* Header with back button */}
      <Card sx={{ mb: 3, backgroundColor: green[50], boxShadow: 'none' }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={navigateToSchedules} sx={{ color: green[800] }}>
                <BackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ color: green[800], fontWeight: 'bold' }}>
                Responses for: {scheduleName}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip 
                icon={<EventIcon />}
                label={`${responses.length} Time Slots`}
                color="primary"
                variant="outlined"
                sx={{ backgroundColor: green[100], color: green[800] }}
              />
              <Chip 
                icon={<PersonIcon />}
                label={`${responses.flatMap(r => r.students).length} Students`} 
                color="primary" 
                variant="outlined"
                sx={{ backgroundColor: green[100], color: green[800] }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and filter section */}
      <Card sx={{ mb: 3, backgroundColor: green[50], boxShadow: 'none' }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: green[600] }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: green[100]
                  }
                }
              }}
              sx={{ width: '400px' }}
            />
           
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: green[800] }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredResponses.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: green[50] }}>
          <Typography variant="h6" sx={{ color: green[800] }}>
            No responses found for this schedule.
          </Typography>
        </Card>
      ) : (
        <Box>
          {/* List of time slots with student responses */}
          {filteredResponses.map((timeSlot, index) => (
            <Card key={index} sx={{ mb: 3, borderLeft: `4px solid ${green[800]}` }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: green[100], color: green[800] }}>
                    <AccessTime />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[800] }}>
                    {timeSlot.timing}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" sx={{ color: green[600] }} />
                    <Typography variant="body2" sx={{ color: green[600] }}>
                      {formatDate(timeSlot.bookedDate)}
                    </Typography>
                  </Box>
                }
                action={
                  <Badge
                    badgeContent={timeSlot.students.length}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: green[800],
                        color: 'white',
                        right: -10,
                        top: 10
                      }
                    }}
                  >
                    <Chip 
                      icon={<PersonIcon />}
                      label="Students"
                      size="small"
                      sx={{ backgroundColor: green[100], color: green[800] }}
                    />
                  </Badge>
                }
              />
              <CardContent>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${green[100]}` }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: green[50] }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: green[800] }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: green[800] }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: green[800] }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: green[800] }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: green[800] }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {timeSlot.students.map((student, studentIndex) => (
                        <TableRow key={studentIndex} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: stringToColor(student.student_name),
                                  width: 32, 
                                  height: 32,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {student.student_name.charAt(0)}
                              </Avatar>
                              <Typography>{student.student_name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{student.student_email}</TableCell>
                          <TableCell>
                            <Chip
                              icon={<School fontSize="small" />}
                              label={student.student_year}
                              size="small"
                              sx={{ backgroundColor: green[50], color: green[800] }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.status}
                              icon={student.status === 'booked' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                              color={student.status === 'booked' ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              onClick={() => handleViewStudentDetails(student)}
                              sx={{ 
                                textTransform: 'none',
                                color: green[800],
                                '&:hover': {
                                  backgroundColor: green[50]
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Student Details Dialog */}
      <Dialog
        open={!!selectedStudent}
        onClose={handleCloseStudentDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: `2px solid ${green[200]}`
          }
        }}
      >
        {selectedStudent && (
          <>
            <DialogTitle sx={{ backgroundColor: green[50], borderBottom: `1px solid ${green[200]}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: green[800], fontWeight: 'bold' }}>
                  Student Details
                </Typography>
                <IconButton onClick={handleCloseStudentDetails} sx={{ color: green[800] }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: stringToColor(selectedStudent.student_name),
                    width: 80, 
                    height: 80,
                    fontSize: '2rem',
                    mb: 2
                  }}
                >
                  {selectedStudent.student_name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[800] }}>
                  {selectedStudent.student_name}
                </Typography>
                <Typography variant="body2" sx={{ color: green[600] }}>
                  {selectedStudent.student_email}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Divider sx={{ borderColor: green[200] }} />
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <School fontSize="small" sx={{ color: green[600] }} />
                    <Typography variant="subtitle2" sx={{ color: green[600] }}>
                      Year
                    </Typography>
                  </Box>
                  <Typography>{selectedStudent.student_year}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ color: green[600] }} />
                    <Typography variant="subtitle2" sx={{ color: green[600] }}>
                      Booked Date
                    </Typography>
                  </Box>
                  <Typography>{formatDate(selectedStudent.booked_date)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" sx={{ color: green[600] }} />
                    <Typography variant="subtitle2" sx={{ color: green[600] }}>
                      Time Slot
                    </Typography>
                  </Box>
                  <Typography>{formatTime(selectedStudent.booked_time_slot)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {selectedStudent.status === 'booked' ? (
                      <CheckCircle fontSize="small" sx={{ color: green[600] }} />
                    ) : (
                      <Cancel fontSize="small" sx={{ color: green[600] }} />
                    )}
                    <Typography variant="subtitle2" sx={{ color: green[600] }}>
                      Status
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedStudent.status}
                    color={selectedStudent.status === 'booked' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${green[200]}`, backgroundColor: green[50] }}>
              <Button 
                onClick={handleCloseStudentDetails}
                sx={{ 
                  borderRadius: '20px',
                  color: green[800],
                  borderColor: green[800],
                  '&:hover': {
                    backgroundColor: green[100],
                    borderColor: green[900]
                  }
                }}
                variant="outlined"
              >
                Close
              </Button>
              <Button 
                variant="contained"
                sx={{
                  borderRadius: '20px',
                  backgroundColor: green[800],
                  color: 'white',
                  '&:hover': {
                    backgroundColor: green[900]
                  }
                }}
              >
                Send Reminder
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Back button at bottom */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button 
          variant="outlined" 
          onClick={navigateToSchedules}
          startIcon={<BackIcon />}
          sx={{ 
            borderRadius: '20px',
            color: green[800],
            borderColor: green[800],
            '&:hover': {
              backgroundColor: green[50],
              borderColor: green[900]
            }
          }}
        >
          Back to Schedules
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%', 
            borderRadius: '8px',
            backgroundColor: snackbar.severity === 'success' ? green[50] : undefined,
            color: snackbar.severity === 'success' ? green[800] : undefined,
            border: snackbar.severity === 'success' ? `1px solid ${green[200]}` : undefined
          }}
          elevation={6}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" sx={{ color: green[800] }} />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FacultyResponses;
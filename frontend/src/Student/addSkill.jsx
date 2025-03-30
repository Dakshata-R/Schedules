import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const AddSkill = ({ open, onClose, onAddSkill }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // State for selected skills
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 5;

  // Predefined list of skills
  const skillsList = [
    "DSA",
    "Python",
    "Java",
    "C",
    "Aptitude",
    "React",
    "Node.js",
    "SQL",
    "Flutter",
    "Web Development",
    "UI/UX",
    "C++",
  ];

  // Handle search
  const filteredSkills = skillsList.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pagination
  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = filteredSkills.slice(indexOfFirstSkill, indexOfLastSkill);

  // Handle skill selection
  const handleSkillSelection = (skill) => {
    setSelectedSkills((prevSelected) =>
      prevSelected.includes(skill)
        ? prevSelected.filter((s) => s !== skill)
        : [...prevSelected, skill]
    );
  };

  // Handle select/deselect all skills
  const handleSelectAllSkills = () => {
    if (selectedSkills.length === currentSkills.length) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills([...currentSkills]);
    }
  };

  // Handle assign skills
  const handleAssign = () => {
    onAddSkill(selectedSkills); // Pass selected skills to the parent component
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
      {/* Dialog Title with Close Icon */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0 10px 0",
        }}
      >
        <Typography>Assign Skills</Typography>
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

        {/* Skills Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
          Skills
        </Typography>
        <Box>
          <List>
            {currentSkills.map((skill) => (
              <Paper
                key={skill}
                sx={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItem sx={{ padding: "8px 0" }}>
                  <Checkbox
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillSelection(skill)}
                    sx={{
                      color: "green",
                      "&.Mui-checked": {
                        color: "green",
                      },
                      marginRight: "16px",
                    }}
                  />
                  {/* Bold Skill Name */}
                  <Typography variant="body1" sx={{ fontWeight: "bold", flex: 1,fontSize:"20px" }}>
                    {skill}
                  </Typography>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>

        {/* Pagination for Skills */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "black",
              textTransform: "none",
              marginRight: "10px",
              "&:disabled": {
                backgroundColor: "#f5f5f5",
                color: "grey",
              },
            }}
          >
            Previous
          </Button>
          <Pagination
            count={Math.ceil(filteredSkills.length / skillsPerPage)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredSkills.length / skillsPerPage)))
            }
            disabled={currentPage === Math.ceil(filteredSkills.length / skillsPerPage)}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "black",
              textTransform: "none",
              marginLeft: "10px",
              "&:disabled": {
                backgroundColor: "#f5f5f5",
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
        {/* Select All/Deselect All for Skills */}
        <Button
          onClick={handleSelectAllSkills}
          sx={{
            color: "red",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {selectedSkills.length === currentSkills.length ? "Deselect All Skills" : "Select All Skills"}
        </Button>
        {/* Selected Count */}
        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            color: "green",
            fontWeight: "bold",
            marginRight: "auto",
          }}
        >
          {selectedSkills.length} skills selected
        </Typography>
        {/* Assign Button */}
        <Button
          variant="contained"
          onClick={handleAssign}
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSkill;
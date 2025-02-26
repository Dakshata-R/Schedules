import React, { useState } from "react";
import { Box, Button, Paper, useMediaQuery } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EventIcon from "@mui/icons-material/Event";

import UserInput from "./userinput";
import Personal from "./personal";
import Health from "./health";
import ClassAdvisor from "./classadvisor"; // Make sure to import ClassAdvisor
import Additional from "./additional";

const Users = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const tabs = [
    { id: "users", label: "Users", icon: <PeopleAltIcon fontSize="small" /> },
    { id: "roles", label: "Roles", icon: <GroupsIcon fontSize="small" /> },
    { id: "infrastructure", label: "Infrastructure", icon: <ApartmentIcon fontSize="small" /> },
    { id: "schedules", label: "Schedules", icon: <EventIcon fontSize="small" /> },
    
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Paper
        sx={{
          width: "70%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "17px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          marginTop: "38px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              sx={{
                flex: isMobile ? "none" : 1,
                width: isMobile ? "100%" : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                padding: "10px",
                fontSize: "1rem",
                fontFamily: "Poppins, sans-serif",
                borderRadius: "8px",
                backgroundColor: selectedTab === tab.id ? "green" : "transparent",
                color: selectedTab === tab.id ? "white" : "black",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.2)" },
              }}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {selectedTab === "personal" && <Personal />}
      {selectedTab === "users" && <UserInput />}
      {selectedTab === "health" && <Health />}
      {selectedTab === "additional" && <Additional />}
      {selectedTab === "classadvisor" && <ClassAdvisor />} {/* Render ClassAdvisor component */}
    </Box>
  );
};

export default Users;

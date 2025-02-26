import React from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png"; // Ensure this path is correct

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items with paths
  const menuItems = [
    { name: "dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
    { name: "users", icon: <GroupIcon fontSize="small" />, path: "/users" },
    { name: "files", icon: <FolderIcon fontSize="small" />, path: "/files" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: 80,
          display: "flex",
          alignItems: "center",
          bgcolor: "#fff",
          paddingTop: 2,
          height: "100vh",
        },
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{ width: 50, height: 50, marginBottom: 6 }}
      />

      {/* Sidebar Icons */}
      {menuItems.map((item) => (
        <IconButton
          key={item.name}
          onClick={() => navigate(item.path)}
          sx={{
            width: 40,
            height: 40,
            marginBottom: 2,
            borderRadius: 3,
            bgcolor: location.pathname === item.path ? "green" : "transparent",
            color: location.pathname === item.path ? "white" : "black",
            "&:hover": { bgcolor: "rgba(0, 128, 0, 0.2)" },
          }}
        >
          {item.icon}
        </IconButton>
      ))}

      {/* Push Logout to Bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logout Icon */}
      <IconButton
        onClick={() => console.log("Logout function here")}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 3,
          bgcolor: "rgba(255, 0, 0, 0.2)",
          color: "red",
          marginBottom: 2,
          "&:hover": { bgcolor: "rgba(255, 0, 0, 0.4)" },
        }}
      >
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Drawer>
  );
};

export default Sidebar;

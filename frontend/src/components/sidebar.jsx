import React from "react";
import { AppBar, Toolbar, Typography, Box, Drawer, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png"; // Ensure this path is correct

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the user's role from localStorage
  const role = localStorage.getItem("role");

  // Define all menu items
  const menuItems = [
    { name: "dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
    { name: "users", icon: <GroupIcon fontSize="small" />, path: "/dashboard/users" },
    { name: "files", icon: <FolderIcon fontSize="small" />, path: "/dashboard/files" },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = role === "faculty"
    ? menuItems // Faculty can see all options
    : menuItems.filter((item) => item.name !== "users"); // Students cannot see "Users"

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
          width: `calc(100% - 80px)`,
          marginLeft: "80px",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#333",
              marginLeft: "80px",
            }}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
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
        {filteredMenuItems.map((item) => (
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
          onClick={() => {
            localStorage.removeItem("token"); // Clear token
            localStorage.removeItem("role"); // Clear role
            navigate("/"); // Navigate to login page
          }}
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
    </Box>
  );
};

export default Sidebar;
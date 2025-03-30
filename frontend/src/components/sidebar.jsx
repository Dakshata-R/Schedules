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

  // Define menu items for students
  const studentMenuItems = [
    { name: "Student Home", icon: <DashboardIcon fontSize="small" />, path: "/dashboard/studenthome" },
    { name: "Student Files", icon: <FolderIcon fontSize="small" />, path: "/dashboard/studentfiles" },
  ];

  // Define menu items for faculty
  const facultyMenuItems = [
    { name: "Home", icon: <DashboardIcon fontSize="small" />, path: "/dashboard/home" },
    { name: "Create", icon: <GroupIcon fontSize="small" />, path: "/dashboard/create" },
    { name: "Files", icon: <FolderIcon fontSize="small" />, path: "/dashboard/files" },
  ];

  // Filter menu items based on the user's role
  const menuItems = role === "student" ? studentMenuItems : facultyMenuItems;

  // Get the current menu item based on the path
  const currentMenuItem = menuItems.find((item) => location.pathname === item.path);

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
            {currentMenuItem ? currentMenuItem.name : "Dashboard"} {/* Default to "Dashboard" if no match */}
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
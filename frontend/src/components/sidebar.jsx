import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Dashboard as DashboardIcon,
  People as GroupIcon,
  Folder as FolderIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Create as CreateIcon
} from "@mui/icons-material";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const role = localStorage.getItem("role") || "student";

  // Define menu items based on role
  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <DashboardIcon />, 
      path: `/${role}/dashboard`,
      roles: ["admin", "faculty", "student"]
    },
    { 
      name: "Create", 
      icon: <CreateIcon />, 
      path: `/${role}/dashboard/create`,
      roles: ["faculty"] 
    },
    { 
      name: "Files", 
      icon: <FolderIcon />, 
      path: `/${role}/dashboard/files`,
      roles: ["faculty", "student"] 
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(role)
  );

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const currentPage = filteredMenuItems.find(item => 
    location.pathname.startsWith(item.path)
  )?.name || "Dashboard";

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
          width: open ? `calc(100% - 240px)` : `calc(100% - 80px)`,
          marginLeft: open ? "240px" : "80px",
          transition: "all 0.3s ease",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ 
              mr: 2,
              color: "#333",
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#333",
            }}
          >
            {currentPage}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 80,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: "width 0.3s ease",
          '& .MuiDrawer-paper': {
            width: open ? 240 : 80,
            overflowX: 'hidden',
            transition: "width 0.3s ease",
            bgcolor: "#fff",
            borderRight: "1px solid #ddd",
          },
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            padding: open ? '16px 24px' : '16px 0',
            height: 64,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ width: 40, height: 40 }}
          />
          {open && (
            <Typography
              variant="h6"
              sx={{
                ml: 2,
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              University Portal
            </Typography>
          )}
        </Box>

        {/* Menu Items */}
        <List sx={{ pt: 0 }}>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mx: 1,
                  borderRadius: 2,
                  bgcolor: location.pathname.startsWith(item.path) 
                    ? 'rgba(0, 128, 0, 0.1)' 
                    : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(0, 128, 0, 0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname.startsWith(item.path) 
                      ? 'green' 
                      : '#555',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: location.pathname.startsWith(item.path) 
                        ? 'bold' 
                        : 'normal',
                      color: location.pathname.startsWith(item.path) 
                        ? 'green' 
                        : '#333',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Spacer to push logout to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                mx: 1,
                borderRadius: 2,
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 0, 0, 0.2)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'red',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{
                    fontFamily: "Poppins, sans-serif",
                    color: 'red',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

    </Box>
  );
};

export default Sidebar;
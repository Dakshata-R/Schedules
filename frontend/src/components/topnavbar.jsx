import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const TopNavbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#fff", boxShadow: "none", borderBottom: "1px solid #ddd" }}>
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
  );
};

export default TopNavbar;

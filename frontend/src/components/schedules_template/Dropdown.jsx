import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AddCircleOutline, ArrowDropDown, SwapVert, CheckBox, AccessTime, RadioButtonUnchecked, InsertDriveFile, Image, Title, Event } from "@mui/icons-material";

const Dropdown = () => {
  return (
    // <Box
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'flex-end', // Aligns the container to the right
    //     width: '100%', // Ensures the parent container takes full width
    //     p: 2, // Optional: Add some padding around the container
    //     backgroundColor: 'black'
    //   }}
    // >
      <Box
        sx={{
          width: 150, // Increased width for better alignment
          height: 500, // Set the height of the container
          backgroundColor: 'white', // Set the background color to white
          borderRadius: 5, // Optional: Add some border radius for rounded corners
          filter: "drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.1))", // Shadow only on the left
          display: 'flex',
          flexDirection: 'column', // Ensure the content is aligned vertically
          alignItems: 'flex-start', // Align items to the left for consistency
          justifyContent: 'center', // Center content vertically
          
        }}
      >
        <List>
          <ListItem button>
            <ListItemIcon>
              <AddCircleOutline sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Add field" />
          </ListItem>

          {/* Properly aligned Dropdown */}
          <ListItem button>
            <ListItemIcon>
              <ArrowDropDown sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Dropdown" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <SwapVert sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Count" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <CheckBox sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Check" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <AccessTime sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Date/Time" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <RadioButtonUnchecked sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Radio" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <InsertDriveFile sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="File" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <Image sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Image" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <Title sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Text" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <Event sx={{ color: "darkgreen" }} />
            </ListItemIcon>
            <ListItemText primary="Duration" />
          </ListItem>
        </List>
      </Box>
    //</Box>
  );
};

export default Dropdown;

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Radio, FormControlLabel, TextField, Paper } from '@mui/material';

const AddStopping = ({ onStoppingSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const originalItems = [
    { id: '01', label: 'Chennai Egmore' },
    { id: '02', label: 'Bangalore Cantt' },
    { id: '03', label: 'Hyderabad Deccan' },
    { id: '04', label: 'Mumbai Dadar' },
    { id: '05', label: 'Delhi Hazrat Nizamuddin' },
  ];

  const [items, setItems] = useState(originalItems);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    document.getElementById('focus-after-close')?.focus(); // Move focus to a safe element
  };
  

  const handleSelect = (value) => setSelected(value);

  const handleAssign = () => {
    if (selected) {
      const selectedLabel = originalItems.find((item) => item.id === selected)?.label || '';
      onStoppingSelect(selectedLabel); // Send selected label to parent component
    }
    handleClose();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      // Reset to original items when search is cleared
      setItems(originalItems);
    } else {
      // Filter items based on search query
      const filteredItems = originalItems.filter((item) =>
        item.label.toLowerCase().includes(query)
      );
      setItems(filteredItems);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'darkgreen',
          color: 'white',
          '&:hover': { backgroundColor: 'green' },
        }}
        onClick={handleClickOpen}
      >
        Add Stopping
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '450px',
            width: '100%',
          },
        }}
      >
        <DialogTitle>Add Stopping</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search Stopping"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {items.map((item) => (
              <Paper key={item.id} elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={selected === item.id}
                      onChange={() => handleSelect(item.id)}
                      sx={{
                        color: 'green',
                        '&.Mui-checked': { color: 'darkgreen' },
                      }}
                    />
                  }
                  label={item.label}
                />
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAssign}
            variant="contained"
            sx={{ backgroundColor: 'darkgreen', color: 'white' }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddStopping;
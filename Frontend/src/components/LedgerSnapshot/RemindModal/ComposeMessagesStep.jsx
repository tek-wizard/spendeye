import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Avatar, TextField, IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon } from '@mui/material';

// Icons
import ReplayIcon from '@mui/icons-material/Replay';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // The "three-dots" icon

export const ComposeMessagesStep = ({ selectedContacts, messages, onMessageChange, onReset, onClear, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setActiveContact(contact);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveContact(null);
  };

  const handleAction = (action) => {
    if (action === 'reset') onReset(activeContact);
    if (action === 'clear') onClear(activeContact.id);
    if (action === 'remove') onRemove(activeContact);
    handleMenuClose();
  };

  const menuItemStyles = {
    fontSize: '0.875rem', // Smaller text
    py: 0.5, // Reduced vertical padding
  };

  const listIconStyles = {
      minWidth: 'auto', // Allow icon to shrink
      mr: 1.5, // Reduce margin between icon and text
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Compose Reminders</Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Review and edit the messages before sending.
      </Typography>
      <List sx={{ mt: 2, maxHeight: 250, overflowY: 'auto' }}>
        {selectedContacts.map((contact) => (
          <ListItem key={contact.id} disablePadding sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1.5, mb: 0.5, bgcolor: 'accent.main', color: 'accent.contrastText' }}>
              {contact.name.charAt(0).toUpperCase()}
            </Avatar>
            <TextField
              fullWidth
              multiline
              label={contact.name}
              variant="standard"
              value={messages[contact.id] || ''}
              onChange={(e) => onMessageChange(contact.id, e.target.value)}
            />
            {/* FIX: Replaced the 3 buttons with a single menu trigger */}
            <IconButton sx={{ ml: 0 }} onClick={(e) => handleMenuClick(e, contact)}>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* This Menu will be positioned by the anchorEl state */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('reset')} sx={menuItemStyles}>
          <ListItemIcon><ReplayIcon fontSize="small" /></ListItemIcon>
          Reset to Default
        </MenuItem>
        <MenuItem onClick={() => handleAction('clear')} sx={menuItemStyles}>
          <ListItemIcon><ClearAllIcon fontSize="small" /></ListItemIcon>
          Clear Message
        </MenuItem>
        <MenuItem onClick={() => handleAction('remove')} sx={{ ...menuItemStyles, color: 'error.main' }}>
          <ListItemIcon><CloseIcon fontSize="small" color="error" /></ListItemIcon>
          Remove Recipient
        </MenuItem>
      </Menu>
    </Box>
  );
};
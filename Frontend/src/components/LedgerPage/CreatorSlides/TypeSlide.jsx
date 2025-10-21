import React from 'react';
import { Stack, ListItemButton, ListItemText } from '@mui/material';

export const TypeSlide = ({ onSelect }) => {
  return (
    <Stack spacing={2}>
      {/* Option 1: Money Given */}
      <ListItemButton
        onClick={() => onSelect('Given')}
        sx={{
          flexDirection: 'column',
          textAlign: 'center',
          borderRadius: 2.5,
          border: 1,
          borderColor: 'divider',
          p: 2.5,
          transition: 'border-color 0.2s, background-color 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <ListItemText
          primary="Money Given"
          secondary="Money left your account (e.g., a loan or paying someone back)."
          primaryTypographyProps={{ fontWeight: 'bold', variant: 'body1', gutterBottom: true }}
          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
        />
      </ListItemButton>

      {/* Option 2: Money Received */}
      <ListItemButton
        onClick={() => onSelect('Received')}
        sx={{
          flexDirection: 'column',
          textAlign: 'center',
          borderRadius: 2.5,
          border: 1,
          borderColor: 'divider',
          p: 2.5,
          transition: 'border-color 0.2s, background-color 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <ListItemText
          primary="Money Received"
          secondary="Money entered your account (e.g., borrowing or getting paid back)."
          primaryTypographyProps={{ fontWeight: 'bold', variant: 'body1', gutterBottom: true }}
          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
        />
      </ListItemButton>
    </Stack>
  );
};
import React from 'react';
import { List, ListItemButton, ListItemText, Typography, Box, useTheme, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// This component is now "dumb" and receives creditors/isLoading as props.
export const SelectCreditorsStep = ({ creditors, selectedContacts, toggleContact, isLoading }) => {
  const theme = useTheme();

  const isSelected = (creditor) => selectedContacts.some(c => c.id === creditor.id);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!creditors || creditors.length === 0) {
    return <Typography color="text.secondary">No debts found to settle.</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Settle Up With</Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Select who you want to pay back.
      </Typography>
      <List sx={{ mt: 2, maxHeight: 250, overflowY: 'auto' }}>
        {creditors.map((creditor) => {
          const selected = isSelected(creditor);
          return (
            <ListItemButton
              key={creditor.id}
              selected={selected}
              onClick={() => toggleContact(creditor)}
              sx={{
                borderRadius: 2, mb: 1,
                bgcolor: selected ? theme.palette.error.main + '20' : 'transparent',
              }}
            >
              <ListItemText
                primary={creditor.name}
                secondary={`You owe ₹${creditor.amount.toFixed(2)}`}
                slotProps={{
                  secondary: { sx: { color: 'error.main', fontWeight: 'medium' } }
                }}
              />
              {selected && <CheckCircleIcon color="error" />}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};
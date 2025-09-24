import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, Box, Tooltip, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const SelectRecipientsStep = ({ debtors, selectedContacts, toggleContact }) => {
  const theme = useTheme();

  const isSelected = (debtor) => selectedContacts.some(c => c.id === debtor.id);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Send Reminder To</Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Select who you want to send an SMS reminder to.
      </Typography>
      <List sx={{ mt: 2, maxHeight: 250, overflowY: 'auto' }}>
        {debtors.map((debtor) => {
          const selected = isSelected(debtor);
          return (
            <Tooltip
              key={debtor.id}
              title={debtor.onCooldown ? `Wait ${debtor.timeLeft} to resend SMS` : ''}
              placement="left"
              arrow
            >
              {/* Box is needed for Tooltip to work on a disabled component */}
              <Box> 
                <ListItemButton
                  selected={selected}
                  disabled={debtor.onCooldown}
                  onClick={() => toggleContact(debtor)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: selected ? theme.palette.success.main + '20' : 'transparent', // Greenish tint when selected
                    '&.Mui-disabled': { opacity: 0.5 }
                  }}
                >
                  <ListItemText
                    primary={debtor.name}
                    secondary={debtor.onCooldown ? `${debtor.timeLeft} remaining` : `Owes you ₹${debtor.amount.toFixed(2)}`}
                    slotProps={{
                        secondary: {
                          sx: {
                            color: debtor.onCooldown ? 'text.secondary' : 'success.main',
                            fontWeight: 'medium',
                          }
                        }
                      }}
                  />
                  {selected && <CheckCircleIcon color="success" />}
                </ListItemButton>
              </Box>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
};
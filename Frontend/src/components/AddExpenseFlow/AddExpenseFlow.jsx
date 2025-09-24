// src/components/AddExpenseFlow/AddExpenseFlow.jsx

import React, { useState } from 'react';
import { useMediaQuery, Fab, Dialog, DialogContent, Box, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { AddExpenseForm } from './AddExpenseForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AddExpenseFlow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // On mobile, render the Floating Action Button and the Dialog it controls.
  if (isMobile) {
    return (
      <>
        <Fab
          aria-label="add expense"
          onClick={handleOpen}
          color="primary"
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
        <Dialog 
          open={open} 
          onClose={handleClose}
          slots={{ transition: Transition }}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
            <AddExpenseForm />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // On desktop, render the form directly as an inline card.
  return (
    <Box>
      <AddExpenseForm />
    </Box>
  );
};
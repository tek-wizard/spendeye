import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { AddExpenseForm } from './AddExpenseForm';

export const EditExpenseModal = ({ expense, open, onClose }) => {
  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
        {/* We pass the expense object here to pre-fill the form */}
        <AddExpenseForm expenseToEdit={expense} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
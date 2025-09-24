import React from 'react';
import {
  Dialog, DialogActions, DialogContent, Typography,
  Button, CircularProgress, Box, Avatar
} from '@mui/material';

export const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  icon,
  confirmText = 'Confirm',
  confirmColor = 'primary',
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogContent sx={{ textAlign: 'center', p: 4 }}>
        {icon && (
          <Avatar sx={{ bgcolor: `${confirmColor}.lighter`, color: `${confirmColor}.main`, width: 56, height: 56, mx: 'auto', mb: 2 }}>
            {icon}
          </Avatar>
        )}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }} id="confirmation-dialog-title">
          {title}
        </Typography>
        <Box sx={{ mt: 1, color: 'text.secondary' }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
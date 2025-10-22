import React from 'react';
import {
  Dialog, DialogActions, DialogContent, Typography,
  Button, CircularProgress, Box, Avatar, Stack, DialogTitle, IconButton, useTheme, alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  isConfirmDisabled = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', p: 3, pt: 0 }}>
        <Stack spacing={2} alignItems="center">
            {icon && (
              <Avatar sx={{ 
                bgcolor: alpha(theme.palette[confirmColor]?.main || theme.palette.primary.main, 0.1), 
                color: `${confirmColor}.main`, 
                width: 56, 
                height: 56, 
              }}>
                {icon}
              </Avatar>
            )}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Box sx={{ color: 'text.secondary', width: '100%' }}>
              {children}
            </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {/* THE FIX: A responsive Stack for the buttons */}
        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
            <Button
                onClick={onClose}
                disabled={isLoading}
                variant="outlined"
                fullWidth
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                color={confirmColor}
                variant="contained"
                disabled={isLoading || isConfirmDisabled}
                autoFocus
                fullWidth
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmText}
            </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
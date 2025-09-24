import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

export const IOUNotesStep = ({ formData, updateFormData, onEnterPress }) => {
  const handleKeyDown = (event) => {
    // If the user presses Enter WITHOUT holding Shift, trigger the submit/next action
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents a newline from being added
      onEnterPress();
    }
    // If they press Shift+Enter, it will behave normally (add a newline)
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Add Notes
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal' }}>
          {' '}(Optional)
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add any details about this loan.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        autoFocus
        placeholder="e.g., For the weekend trip"
        value={formData.notes}
        onChange={(e) => updateFormData({ notes: e.target.value })}
        onKeyDown={handleKeyDown} // New handler for the Enter key
        slotProps={{ htmlInput: { maxLength: 200 } }}
        helperText={`${formData.notes?.length || 0} / 200`}
        sx={{ maxWidth: 350 }}
      />
    </Box>
  );
};
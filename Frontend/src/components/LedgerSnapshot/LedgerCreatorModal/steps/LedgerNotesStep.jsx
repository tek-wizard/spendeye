import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

export const LedgerNotesStep = ({ formData, updateFormData, onEnterPress }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (onEnterPress) onEnterPress();
    }
  };

  const placeholderText = {
    Given: "e.g., Concert tickets, rent payment",
    Received: "e.g., Repayment for dinner, loan from friend",
}[formData.type] || "Add details...";

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Add Notes
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', fontSize: '1rem' }}>
          {' '}(Optional)
        </Box>
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        autoFocus
        placeholder={placeholderText}
        value={formData.notes}
        onChange={(e) => updateFormData({ notes: e.target.value })}
        onKeyDown={handleKeyDown}
        slotProps={{ htmlInput: { maxLength: 200 } }}
        helperText={`${formData.notes?.length || 0} / 200`}
        sx={{ maxWidth: 350, mt: 2 }}
      />
    </Box>
  );
};
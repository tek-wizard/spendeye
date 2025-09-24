import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography, Box } from '@mui/material';

export const LedgerDateStep = ({ formData, updateFormData, onEnterPress }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onEnterPress) onEnterPress();
    }
  };

  const title = {
      Lent: "Date of Transaction",
      Borrowed: "Date of Transaction",
      'Paid Back': "Date of Payment",
      'Got Back': "Date Received",
  }[formData.type] || "Select Date";
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      <DatePicker
        label="Transaction Date"
        value={formData.date}
        onChange={(newDate) => updateFormData({ date: newDate })}
        slotProps={{ textField: { onKeyDown: handleKeyDown } }}
        sx={{ width: '100%', maxWidth: '300px', mt: 3 }}
      />
    </Box>
  );
};
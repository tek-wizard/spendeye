import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography, Box } from '@mui/material';

export const DateStep = ({ formData, updateFormData, onEnterPress }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Select Date
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        What day did this expense occur on?
      </Typography>
      <DatePicker
        label="Expense Date"
        value={formData.date}
        onChange={(newDate) => updateFormData({ date: newDate })}
        slotProps={{
          textField: {
            onKeyDown: handleKeyDown,
          },
        }}
        disableFuture={true}
        sx={{ width: '80%', maxWidth: '300px' }}
      />
    </Box>
  );
};

export default DateStep
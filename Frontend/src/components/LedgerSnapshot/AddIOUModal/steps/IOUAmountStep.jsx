import React, { useRef, useEffect } from 'react';
import { TextField, Typography, Box } from '@mui/material';

export const IOUAmountStep = ({ formData, updateFormData }) => {
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Amount Borrowed</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the total amount you received.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" sx={{ color: 'text.secondary', mr: 1 }}>₹</Typography>
        <TextField
          inputRef={inputRef}
          type="number"
          value={formData.amount}
          onChange={(e) => updateFormData({ amount: e.target.value })}
          placeholder="0.00"
          variant="standard"
          sx={{
            '.MuiInput-input': { textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', padding: 0 },
            '& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
            // FIX: Added styles to hide the number input spinners
            '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            maxWidth: '200px'
          }}
        />
      </Box>
    </Box>
  );
};
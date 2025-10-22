import React from 'react';
import { Stack, IconButton, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';

export const MonthSelector = ({ selectedMonth, setSelectedMonth }) => {
  const handlePrevMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  // Disable the "Next" button if the selected month is the current month or in the future
  const isNextDisabled = isSameMonth(selectedMonth, new Date()) || selectedMonth > new Date();

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
        <IconButton onClick={handlePrevMonth} size="small">
            <ArrowBackIosNewIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', minWidth: 200, textAlign: 'center' }}>
            {format(selectedMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" disabled={isNextDisabled}>
            <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
    </Stack>
  );
};
import React from 'react';
import { Typography } from '@mui/material';

export const PacingIndicator = ({ spending, budget }) => {
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const idealSpending = (budget / daysInMonth) * dayOfMonth;
  const difference = spending - idealSpending;

  if (difference > 100) {
    return <Typography variant="caption" color="error.main">⚠️ Ahead of budget by ~₹{Math.round(difference)}</Typography>;
  }
  if (difference < -100) {
    return <Typography variant="caption" color="success.main">On track to stay within budget</Typography>;
  }
  return <Typography variant="caption" color="text.secondary">Your spending is on track</Typography>;
};
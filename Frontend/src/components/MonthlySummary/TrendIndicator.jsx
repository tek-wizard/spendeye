import React from 'react';
import { Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const TrendIndicator = ({ percentage }) => {
  const isPositive = percentage > 0;
  const color = isPositive ? 'error.main' : 'success.main';
  const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color }}>
      <Icon sx={{ fontSize: '1rem', mr: 0.5 }} />
      <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
        {Math.abs(percentage)}% from last month
      </Typography>
    </Box>
  );
};
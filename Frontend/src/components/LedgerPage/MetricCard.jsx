import React from 'react';
import { Paper, Typography, Box, Skeleton, Stack } from '@mui/material';

export const MetricCard = React.memo(({ title, value, isLoading, valueColor = 'text.primary' }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      {isLoading ? (
        // An "anatomical" skeleton that mimics the card's layout.
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '50%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '75%' }} />
        </Stack>
      ) : (
        // The actual content.
        <>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: valueColor }}>
            {value}
          </Typography>
        </>
      )}
    </Paper>
  );
});
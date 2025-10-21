import React from 'react';
import { Paper, Typography, Skeleton, Stack } from '@mui/material';

export const MetricCard = React.memo(({ title, value, isLoading }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      {isLoading ? (
        <Skeleton variant="rounded" height={48} />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </>
      )}
    </Paper>
  );
});
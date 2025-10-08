import React from 'react';
import { Paper, Typography, Skeleton, Stack } from '@mui/material';

export const MetricCard = React.memo(({ title, value, isLoading }) => {
  return (
    // The Paper component is the stable container that NEVER unmounts.
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      {isLoading ? (
        // The skeleton is rendered *inside* the container, matching the content's shape.
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '50%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '75%' }} />
        </Stack>
      ) : (
        // The actual content is rendered when loading is false.
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
import React from 'react';
import { Paper, Typography, Box, Skeleton, Stack, Grid, Divider, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';

// A simple, reusable skeleton for loading states
const MetricSkeleton = () => (
    <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '75%' }} />
    </Stack>
);

export const LedgerHeader = ({ summaryData, peopleCount, isLoading, onAddNewEntry }) => {
  const owedToYou = summaryData?.owedToYou || 0;
  const youOwe = summaryData?.youOwe || 0;

  return (
    <Grid container spacing={3}>
      {/* --- The Main Balance Summary Card --- */}
      <Grid item xs={12} md={8}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={3} alignItems="center">
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'success.main' }}>
                  <ArrowUpwardIcon fontSize="small" />
                  <Typography variant="body2">You're Owed</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {owedToYou.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'error.main' }}>
                  <ArrowDownwardIcon fontSize="small" />
                  <Typography variant="body2">You Owe</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {youOwe.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Grid>

      {/* --- The Actions Card --- */}
      <Grid item xs={12} md={4}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <Stack spacing={1.5}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={onAddNewEntry} size="large">
                Add New Entry
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Managing balances with <strong>{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</strong>.
              </Typography>
            </Stack>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
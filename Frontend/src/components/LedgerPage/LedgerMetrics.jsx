import React from 'react';
import { Paper, Typography, Box, Skeleton, Stack, Divider, useTheme, useMediaQuery } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// A new, local MetricDisplay component designed for this specific card
const MetricDisplay = ({ title, value, isLoading, icon, color }) => {
    if (isLoading) {
        return (
            <Stack spacing={1} sx={{ p: 2.5, flex: 1 }}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.75rem', width: '80%' }} />
            </Stack>
        );
    }

    return (
        <Box sx={{ p: 2.5, flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color }}>
                {icon}
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{title}</Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                {value}
            </Typography>
        </Box>
    );
};

export const LedgerMetrics = ({ summaryData, isLoading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const owedToYou = summaryData?.owedToYou || 0;
    const youOwe = summaryData?.youOwe || 0;

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Stack
                direction={isMobile ? 'column' : 'row'}
                divider={
                    <Divider 
                        orientation={isMobile ? 'horizontal' : 'vertical'} 
                        flexItem 
                    />
                }
            >
                <MetricDisplay
                    title="You're Owed"
                    value={owedToYou.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    isLoading={isLoading}
                    icon={<ArrowUpwardIcon fontSize="small" />}
                    color="success.main"
                />
                <MetricDisplay
                    title="You Owe"
                    value={youOwe.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    isLoading={isLoading}
                    icon={<ArrowDownwardIcon fontSize="small" />}
                    color="error.main"
                />
            </Stack>
        </Paper>
    );
};
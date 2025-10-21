import React from 'react';
import { Stack, Divider, Typography, Skeleton, Box } from '@mui/material';

// A reusable component for each metric to keep the code clean
const MetricDisplay = ({ title, amount, color, icon, isLoading }) => {
    const IconComponent = icon;

    return (
        <Stack
            spacing={0.5}
            sx={{ flex: 1, alignItems: 'center', py: 1 }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </Stack>
            {isLoading ? (
                <Skeleton variant="text" width="70%" />
            ) : (
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: `${color}.main`,
                        lineHeight: 1.2
                    }}
                >
                    {/* Format the currency without the default INR symbol */}
                    ₹{amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    })}
                </Typography>
            )}
        </Stack>
    );
};


export const MetricsSlide = ({ summaryData, isLoading }) => {
  const owedToYou = summaryData?.owedToYou || 0;
  const youOwe = summaryData?.youOwe || 0;

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <MetricDisplay
        title="You're Owed"
        amount={owedToYou}
        color="success"
        isLoading={isLoading}
      />
      <MetricDisplay
        title="You Owe"
        amount={youOwe}
        color="error"
        isLoading={isLoading}
      />
    </Stack>
  );
};
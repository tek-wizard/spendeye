import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, CardActionArea } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { TrendIndicator } from './TrendIndicator';
import { PacingIndicator } from './PacingIndicator';

export const MonthlySummaryView = ({ data }) => {
  const theme = useTheme();
  const { currentSpending, budget, trendPercentage, sparklineData } = data;

  const budgetUsedPercent = (currentSpending / budget) * 100;

  const getProgressColor = () => {
    if (budgetUsedPercent > 90) return 'error';
    if (budgetUsedPercent > 70) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ position: 'relative', overflow: 'hidden' }}>
      <CardActionArea onClick={() => alert('Navigate to full report page!')}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="amount" stroke={theme.palette.primary.main} strokeWidth={2} fill="url(#sparklineGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="body2" color="text.secondary">This Month's Spending</Typography>
            <TrendIndicator percentage={trendPercentage} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
            ₹{currentSpending.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            of ₹{budget.toLocaleString('en-IN')} budget
          </Typography>
          <LinearProgress variant="determinate" value={budgetUsedPercent} color={getProgressColor()} sx={{ height: 8, borderRadius: 4 }} />
          <Box sx={{ mt: 1 }}>
            <PacingIndicator spending={currentSpending} budget={budget} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
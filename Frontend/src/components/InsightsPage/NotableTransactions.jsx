import React from 'react';
import { Paper, Typography, Box, Stack, Skeleton, Divider } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RepeatIcon from '@mui/icons-material/Repeat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

// A reusable, aesthetic card for each notable insight
const InsightCard = ({ icon, title, value, caption }) => (
    <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: '50%', flexShrink: 0 }}>
            {icon}
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">{title}</Typography>
            <Typography 
              sx={{ 
                fontWeight: 'medium',
                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                wordBreak: 'break-word',
              }}
            >
                {value}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
            >
                {caption}
            </Typography>
        </Box>
    </Stack>
);

export const NotableTransactions = ({ data, isLoading }) => {
    if (isLoading) {
        return <Skeleton variant="rounded" height={250} />;
    }

    const { largestExpense, mostFrequentCategory, highestSpendingDay } = data || {};

    return (
        <Paper 
          variant="outlined" 
          sx={{ 
            borderRadius: 2, 
            p: 2.5, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, flexShrink: 0 }}>
              Notable Insights
            </Typography>
            <Stack spacing={2} divider={<Divider />} sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {largestExpense ? (
                    <InsightCard 
                        icon={<CreditCardIcon color="primary" />}
                        title="Largest Expense"
                        value={largestExpense.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        caption={`On ${largestExpense.notes || largestExpense.category}`}
                    />
                ) : null}
                {mostFrequentCategory ? (
                    <InsightCard 
                        icon={<RepeatIcon color="primary" />}
                        title="Most Frequent Category"
                        value={mostFrequentCategory.category}
                        caption={`${mostFrequentCategory.count} times this month`}
                    />
                ) : null}
                {highestSpendingDay ? (
                    <InsightCard 
                        icon={<CalendarTodayIcon color="primary" />}
                        title="Highest Spending Day"
                        value={format(new Date(highestSpendingDay.date), 'MMMM do')}
                        caption={`with ${highestSpendingDay.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} spent`}
                    />
                ) : null}

                {!largestExpense && !mostFrequentCategory && !highestSpendingDay && (
                     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                        <BarChartOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2">Not enough data for insights.</Typography>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};
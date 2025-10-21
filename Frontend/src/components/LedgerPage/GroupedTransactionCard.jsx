import React from 'react';
import { Paper, Typography, Box, Stack, Divider, useTheme } from '@mui/material';
import { format } from 'date-fns';

const BreakdownRow = ({ type, amount }) => {
    const label = (type === 'Paid Back' || type === 'Got Back') 
        ? 'Debt Settled' 
        : (type === 'Lent' ? 'You Lent' : 'You Borrowed');

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.25 }}
        >
            <Typography variant="body2">• {label}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </Typography>
        </Stack>
    );
};

export const GroupedTransactionCard = ({ group }) => {
    const theme = useTheme();
    const { transactions, date } = group;
    const isSent = transactions[0]?.type === 'Lent' || transactions[0]?.type === 'Paid Back';
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    const sortedTransactions = [...transactions].sort((a, b) => {
        const isASettlement = a.type === 'Paid Back' || a.type === 'Got Back';
        const isBSettlement = b.type === 'Paid Back' || b.type === 'Got Back';
        if (isASettlement && !isBSettlement) return -1;
        if (!isASettlement && isBSettlement) return 1;
        return 0;
    });

    return (
        <Stack
            direction="row"
            justifyContent={isSent ? 'flex-end' : 'flex-start'}
            sx={{ my: 2 }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    maxWidth: '85%',
                    width: 340,
                    bgcolor: isSent ? 'primary.main' : 'action.hover',
                    color: isSent ? 'primary.contrastText' : 'text.primary',
                }}
            >
                {/* --- HEADER --- */}
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {totalAmount.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        })}
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        bgcolor: isSent ? 'rgba(255,255,255,0.35)' : theme.palette.accent.main,
                        height: '2px',
                        opacity: isSent ? 1 : 0.5,
                    }}
                />

                {/* --- ITEMIZED BREAKDOWN --- */}
                <Box sx={{ px: 2 }}>
                    {sortedTransactions.map((tx) => (
                        <BreakdownRow key={tx._id} type={tx.type} amount={tx.amount} />
                    ))}
                </Box>

                {/* --- NOTES & TIMESTAMP --- */}
                {transactions[0].notes && (
                    <Box sx={{ px: 2, pt: 1 }}>
                         <Typography variant="caption" sx={{ opacity: isSent ? 0.9 : 0.7 }}>
                             Notes
                         </Typography>
                         <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {transactions[0].notes}
                         </Typography>
                    </Box>
                )}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'right',
                        p: 2,
                        pt: 1.5,
                        opacity: isSent ? 0.8 : 0.6,
                    }}
                >
                    {format(new Date(date), 'p')}
                </Typography>
            </Paper>
        </Stack>
    );
};
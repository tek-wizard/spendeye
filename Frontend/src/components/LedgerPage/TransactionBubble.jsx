import React from 'react';
import { Paper, Typography, Box, Stack } from '@mui/material';
import { format } from 'date-fns';

export const TransactionBubble = ({ transaction, isFirstInGroup, isLastInGroup }) => {
  const isSent = transaction.type === 'Lent' || transaction.type === 'Paid Back';

  const borderRadiusSx = isSent
    ? {
        borderTopRightRadius: isFirstInGroup ? 12 : 6, 
        borderBottomRightRadius: isLastInGroup ? 12 : 6,
        borderTopLeftRadius: 18, 
        borderBottomLeftRadius: 18, 
      }
    : {
        borderTopLeftRadius: isFirstInGroup ? 12 : 6, 
        borderBottomLeftRadius: isLastInGroup ? 12 : 6, 
        borderTopRightRadius: 18, 
        borderBottomRightRadius: 18, 
      };

  return (
    <Stack
      direction="row"
      justifyContent={isSent ? 'flex-end' : 'flex-start'}
      sx={{
        mt: isFirstInGroup ? 2 : 0.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: '65%',
          bgcolor: isSent ? 'primary.main' : 'action.hover',
          color: isSent ? 'primary.contrastText' : 'text.primary',
          ...borderRadiusSx,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </Typography>
        {transaction.notes && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 0.5, 
              opacity: isSent ? 0.9 : 0.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {transaction.notes}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'right', mt: 1, opacity: isSent ? 0.8 : 0.6 }}
        >
          {format(new Date(transaction.date), 'MMM d, yyyy')}
        </Typography>
      </Paper>
    </Stack>
  );
};
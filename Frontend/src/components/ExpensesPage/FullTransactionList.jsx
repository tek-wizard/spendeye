
import React from 'react';
import { Box, Typography, List, Divider, Skeleton, Pagination, Stack, Paper, ListItemButton, ListItemAvatar, Avatar, ListItemText, useMediaQuery, useTheme, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import { useCategoryMaps } from '../../utils/categoryMaps';

const TransactionItem = ({ transaction }) => {
    const { categoryIcons, categoryColors } = useCategoryMaps();
    const secondaryText = transaction.notes 
      ? `${transaction.notes.substring(0, 40)}${transaction.notes.length > 40 ? '...' : ''}`
      : format(new Date(transaction.date), 'MMM d, yyyy');
  
    return (
      <ListItemButton>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: categoryColors[transaction.category] || '#9E9E9E' }}>
            {categoryIcons[transaction.category]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={transaction.category}
          secondary={secondaryText}
          primaryTypographyProps={{ fontWeight: 'medium' }}
          secondaryTypographyProps={{ fontSize: '0.8rem' }}
        />
        <Typography sx={{ fontWeight: 'bold', ml: 2, textAlign: 'right' }}>
          {transaction.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </Typography>
      </ListItemButton>
    );
};

export const FullTransactionList = React.memo(({ transactions, pagination, isLoading, isFetching, onPageChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, minHeight: 400, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* THE FIX: Show progress bar on background fetch */}
      {(isFetching && !isLoading) && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />}

      <Box sx={{ opacity: isFetching && !isLoading ? 0.7 : 1, transition: 'opacity 300ms ease-in-out', flexGrow: 1 }}>
        {isLoading ? (
          <Stack spacing={0} sx={{ p: '1px' }}>
            {Array.from(new Array(6)).map((_, index) => <Skeleton key={index} variant="rectangular" height={68} />)}
          </Stack>
        ) : !transactions || transactions.length === 0 ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>No Transactions Found</Typography>
            <Typography>Try adjusting your filters or selecting a different date range.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx._id}>
                <TransactionItem transaction={tx} />
                {index < transactions.length - 1 && <Divider component="li" variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
      
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <Stack alignItems="center" sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Pagination count={pagination.totalPages} page={pagination.currentPage} onChange={onPageChange} color="primary" size={isMobile ? 'small' : 'medium'} disabled={isFetching} />
        </Stack>
      )}
    </Paper>
  );
});
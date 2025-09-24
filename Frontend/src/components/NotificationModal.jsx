import React from 'react';
import { Dialog, DialogContent, Typography, Box, Stack, Divider, Avatar, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const typeLabels = {
    "Got Back": "You received money",
    "Borrowed": "You borrowed money",
    "Lent": "You lent money",
    "Paid Back": "You repaid money",
  };
  
  const TransactionRow = ({ transaction }) => {
    const description = typeLabels[transaction.category] || "Transaction";
  
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between" // space items left/right
        sx={{ py: 1.5, px: 2 }} // padding for breathing room
      >
        {/* Left side: type + description */}
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {transaction.category}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Box>
  
        {/* Right side: amount */}
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {transaction.totalAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
        </Typography>
      </Stack>
    );
  };
export const NotificationModal = ({ open, onClose, title, message, createdItems = [] }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar sx={{ bgcolor: 'success.main', color: 'white', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <CheckCircleOutlineIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>{message}</Typography>
                
                {createdItems.length > 0 && (
                    <Stack divider={<Divider flexItem />}>
                        {createdItems.map(item => <TransactionRow key={item._id} transaction={item} />)}
                    </Stack>
                )}

                <Button onClick={onClose} variant="contained" fullWidth sx={{ mt: 3 }}>
                    Done
                </Button>
            </DialogContent>
        </Dialog>
    );
};
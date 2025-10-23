import React from 'react';
import { Dialog, DialogContent, Typography, Box, Stack, Divider, Avatar, Button, Paper, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useCategoryMaps } from '../utils/categoryMaps';

const typeLabels = {
    "Got Back": "You got back your money",
    "Borrowed": "You borrowed money",
    "Lent": "You lent money",
    "Paid Back": "You repaid borrowed money",
};

const TransactionRow = ({ transaction }) => {
    const { categoryIcons, categoryColors } = useCategoryMaps();
    const description = typeLabels[transaction.category] || "Transaction";
  
    return (
      <ListItem sx={{ py: 1.5 }}>
        <ListItemText
          primary={transaction.category}
          secondary={description}
          primaryTypographyProps={{ fontWeight: 'medium' }}
        />
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {(transaction.totalAmount || transaction.amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
        </Typography>
      </ListItem>
    );
};

export const NotificationModal = ({ open, onClose, title, message, createdItems = [] }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar sx={{ bgcolor: 'success.main', color: 'white', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <CheckCircleOutlineIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{message}</Typography>
                
                {createdItems.length > 0 && (
                    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                        <Stack divider={<Divider flexItem />}>
                            {createdItems.map(item => <TransactionRow key={item._id || item.date} transaction={item} />)}
                        </Stack>
                    </Paper>
                )}

                <Button onClick={onClose} variant="contained" fullWidth sx={{ mt: 3 }}>
                    Done
                </Button>
            </DialogContent>
        </Dialog>
    );
};
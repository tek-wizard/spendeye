import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Box, ListSubheader, Collapse, TextField, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const EmptyState = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 250, color: 'text.secondary', textAlign: 'center' }}>
        <ReceiptLongOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>No Transactions Found This Month</Typography>
        <Typography variant="body2">Your recent transactions will appear here.</Typography>
    </Box>
);

export const RecentTransactionsList = ({ transactions, onTransactionClick, searchQuery, setSearchQuery, onSortChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  const handleSort = (sortBy) => {
    onSortChange(sortBy);
    handleFilterClose();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Box>
            <Tooltip title="Search Transactions"><IconButton onClick={() => setShowSearch(prev => !prev)}><SearchIcon /></IconButton></Tooltip>
            <Tooltip title="Sort"><IconButton onClick={handleFilterClick}><FilterListIcon /></IconButton></Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                <MenuItem onClick={() => handleSort('date')}>Sort by Date (Newest)</MenuItem>
                <MenuItem onClick={() => handleSort('amount')}>Sort by Amount (Highest)</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Collapse in={showSearch}>
            <TextField
                inputRef={searchInputRef}
                fullWidth size="small" variant="standard"
                placeholder="Search by category or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
            />
        </Collapse>
        
        {Object.keys(transactions).length === 0 ? <EmptyState /> : (
            <List sx={{ maxHeight: 380, overflowY: 'auto', position: 'relative' }}>
                {Object.entries(transactions).map(([dateGroup, txs]) => (
                    <li key={dateGroup}>
                        <ul style={{ padding: 0, margin: 0 }}>
                          <ListSubheader sx={{ bgcolor: 'background.paper', lineHeight: '32px', zIndex: 3 }}>{dateGroup}</ListSubheader>
                            {txs.map((tx) => (
                                <ListItemButton 
                                    key={tx._id} 
                                    onClick={() => onTransactionClick(tx)}
                                    sx={{ 
                                        // --- UI CHANGE FOR OVERLAP ---
                                        py: 1, // Consistent padding
                                        // Pull up the item if it's part of a group
                                        ...(tx.groupPosition && tx.groupPosition !== 'first' && { marginTop: '-16px' }),
                                        // Adjust bottom padding for top/middle items to tighten the gap
                                        ...(tx.groupPosition === 'first' || tx.groupPosition === 'middle') && { pb: '2px' },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ 
                                            bgcolor: tx.color || 'secondary.main',
                                            // --- UI CHANGE FOR CLEAN STACKING ---
                                            border: '3px solid',
                                            borderColor: 'background.paper',
                                            zIndex: 2,
                                        }}>
                                            {tx.icon}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={tx.type}
                                        secondary={tx.description} // Will be null for grouped items
                                        primaryTypographyProps={{ fontWeight: 'medium', noWrap: true }}
                                    />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 1, whiteSpace: 'nowrap' }}>
                                        {tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    </Typography>
                                </ListItemButton>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        )}
      </CardContent>
    </Card>
  );
};
import React from 'react';
import { Stack, Typography, Divider, ListItemButton, ListItemText } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// A helper to display the current value of a filter
const FilterValue = ({ value }) => (
    <Typography variant="body2" color="text.secondary" noWrap>
        {value}
    </Typography>
);

export const FilterMainView = ({ filters, dateRange, onNavigate }) => {
    // Create summary text for each filter
    const categoryValue = filters.selectedCategories.length > 0 ? `${filters.selectedCategories.length} selected` : 'All';
    const amountValue = (filters.amountRange[0] > 0 || filters.amountRange[1] < 50000) 
        ? `₹${filters.amountRange[0]} - ₹${filters.amountRange[1]}` 
        : 'All';
    const typeValue = filters.isSplitFilter === true ? 'Split' : filters.isSplitFilter === false ? 'Personal' : 'All';

    return (
        <Stack>
            <ListItemButton onClick={() => onNavigate('date')}>
                <ListItemText primary="Date Range" />
                <FilterValue value={dateRange.label} />
                <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', ml: 1 }} />
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton onClick={() => onNavigate('category')}>
                <ListItemText primary="Category" />
                <FilterValue value={categoryValue} />
                <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', ml: 1 }} />
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton onClick={() => onNavigate('amount')}>
                <ListItemText primary="Amount" />
                <FilterValue value={amountValue} />
                <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', ml: 1 }} />
            </ListItemButton>
            <Divider component="li" />
             <ListItemButton onClick={() => onNavigate('type')}>
                <ListItemText primary="Type" />
                <FilterValue value={typeValue} />
                <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', ml: 1 }} />
            </ListItemButton>
        </Stack>
    );
};
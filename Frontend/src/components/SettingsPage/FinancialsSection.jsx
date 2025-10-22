import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Stack, TextField, Button, InputAdornment, CircularProgress, Tooltip } from '@mui/material';
import { useUpdateBudget } from '../../hooks/useUpdateBudget';
import { differenceInDays, addDays, format } from 'date-fns';

export const FinancialsSection = ({ user }) => {
    const [budget, setBudget] = useState(user.budget);
    const { updateBudget, isUpdatingBudget } = useUpdateBudget();

    // Determine if the budget can be edited
    let canEdit = true;
    let nextEditDate = null;
    if (user.budgetLastUpdated) {
        const daysSinceLastUpdate = differenceInDays(new Date(), new Date(user.budgetLastUpdated));
        if (daysSinceLastUpdate < 7) {
            canEdit = false;
            nextEditDate = addDays(new Date(user.budgetLastUpdated), 7);
        }
    }

    // A bug fix to prevent showing "Save" if the user types and then reverts
    const isChanged = Number(budget) !== user.budget;

    const handleSave = () => {
        if (!isChanged || !canEdit) return;
        updateBudget({ budget: Number(budget) });
    };

    // Sync local state if the user prop changes
    useEffect(() => {
        setBudget(user.budget);
    }, [user.budget]);
    
    const numberInputSx = {
        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
        },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        },
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Financials</Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ maxWidth: 400 }}>
                <TextField
                    label="Monthly Budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={!canEdit || isUpdatingBudget}
                    fullWidth // Allow it to take available space
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={numberInputSx} // Apply the spinner-hiding styles
                />
                <Tooltip title={!canEdit ? `You can change your budget again on ${format(nextEditDate, 'MMM d, yyyy')}` : ""}>
                    <span>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={!isChanged || !canEdit || isUpdatingBudget}
                            sx={{ flexShrink: 0 }} // Prevent the button from shrinking
                        >
                            {isUpdatingBudget ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                        </Button>
                    </span>
                </Tooltip>
            </Stack>
            {!canEdit && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Your budget is locked until {format(nextEditDate, 'MMMM do')}.
                </Typography>
            )}
        </Paper>
    );
};
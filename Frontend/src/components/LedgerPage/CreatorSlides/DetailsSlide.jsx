import React, { useState, useRef } from 'react';
import { Stack, TextField, InputAdornment, Chip, Avatar, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isToday, isYesterday, format } from 'date-fns';

export const DetailsSlide = ({ formData, onAmountChange, onNoteChange, onDateChange }) => {
    const [pickerOpen, setPickerOpen] = useState(false);
    const dateChipRef = useRef(null);

    const formatDate = (date) => {
        const d = new Date(date);
        if (isToday(d)) return 'Today';
        if (isYesterday(d)) return 'Yesterday';
        return format(d, 'MMM d, yyyy');
    };

    return (
        <Stack spacing={3} sx={{ pt: 2 }}>
            {/* --- Summary Chips --- */}
            <Stack spacing={1} alignItems="center">
                    <Chip
                        label={formData.type === 'Given' ? 'Given to' : 'Taken from'}
                        color={formData.type === 'Given' ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                    />
                    <Tooltip title={formData.contact.name} arrow>
                        <Chip
                            avatar={<Avatar sx={{ width: 24, height: 24 }}>{formData.contact.name.charAt(0).toUpperCase()}</Avatar>}
                            label={formData.contact.name.length > 15 ? `${formData.contact.name.substring(0, 15)}…` : formData.contact.name}
                            size="small"
                        />
                    </Tooltip>
                <Chip
                    ref={dateChipRef}
                    label={formatDate(formData.date)}
                    onClick={() => setPickerOpen(true)}
                    size="small"
                    variant="outlined"
                />
            </Stack>

            {/* --- Amount Input --- */}
            <TextField
                label="Amount"
                variant="standard"
                type="number"
                value={formData.amount}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || Number(value) >= 1) {
                        onAmountChange(value);
                    }
                }}
                autoFocus
                inputProps={{ min: 1 }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    sx: { fontSize: '2rem', fontWeight: 'bold' }
                }}
                sx={{
                    '& input': { textAlign: 'center' },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                    '& input[type=number]': {
                        MozAppearance: 'textfield',
                    },
                    '& .MuiInput-underline:before, & .MuiInput-underline:after': { borderBottomWidth: '2px' }
                }}
            />

            {/* --- Optional Notes --- */}
            <TextField
                label="Note (Optional)"
                multiline
                rows={2}
                variant="outlined"
                value={formData.note}
                onChange={(e) => onNoteChange(e.target.value)}
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.note.length} / 200`}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {/* --- Hidden DatePicker --- */}
            <DatePicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                value={new Date(formData.date)}
                onChange={(newDate) => onDateChange(newDate)}
                enableAccessibleFieldDOMStructure={false}
                slotProps={{
                    popper: {
                        anchorEl: dateChipRef.current,
                    },
                }}
                slots={{ textField: (params) => <TextField {...params} sx={{ display: 'none' }} /> }}
            />
        </Stack>
    );
};
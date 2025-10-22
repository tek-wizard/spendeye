import React, { useState } from 'react';
import { Paper, Typography, Stack, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ChangePasswordModal } from './ChangePasswordModal';

export const SecuritySection = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Security</Typography>
                <ListItemButton onClick={() => setModalOpen(true)} sx={{ borderRadius: 1 }}>
                    <ListItemText primary="Change Password" />
                    <ArrowForwardIosIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                </ListItemButton>
            </Paper>
            <ChangePasswordModal open={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};
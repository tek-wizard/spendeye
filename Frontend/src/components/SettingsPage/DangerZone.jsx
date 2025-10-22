import React, { useState } from 'react';
import { Paper, Typography, Box, Stack, Button, TextField, CircularProgress, Divider } from '@mui/material';
import { useLogoutUser } from '../../hooks/useLogoutUser';
import { useDeleteAccount } from '../../hooks/useDeleteAccount'; // THE FIX: Import the hook
import { ConfirmationModal } from '../ConfirmationModal';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const DangerZone = () => {
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    
    const { logoutUser, isLoggingOut } = useLogoutUser();
    // THE FIX: Use the real hook to get the delete function and loading state
    const { deleteAccount, isDeletingAccount } = useDeleteAccount();

    // THE FIX: This function now calls the hook to permanently delete the account
    const handleDeleteAccount = () => {
        deleteAccount();
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteConfirmText('');
        setDeleteModalOpen(false);
    };

    return (
        <>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'error.main' }}>
                <Stack spacing={2.5} divider={<Divider />}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontWeight: 'medium' }}>Logout</Typography>
                            <Typography variant="body2" color="text.secondary">
                                You will be returned to the login screen.
                            </Typography>
                        </Box>
                        <Button 
                            variant="outlined"
                            onClick={() => setLogoutModalOpen(true)}
                            sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
                        >
                            Logout
                        </Button>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontWeight: 'medium', color: 'error.main' }}>Delete Account</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Permanently delete your account and all of your data.
                            </Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            color="error"
                            onClick={() => setDeleteModalOpen(true)}
                            sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
                        >
                            Delete Account
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <ConfirmationModal
                open={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={logoutUser}
                title="Logout?"
                confirmText="Logout"
                isLoading={isLoggingOut}
            >
                <Typography>Are you sure you want to log out of your account?</Typography>
            </ConfirmationModal>
            
            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteAccount}
                title="Are you absolutely sure?"
                confirmText="Delete My Account"
                confirmColor="error"
                // THE FIX: Use the real loading state from the hook
                isLoading={isDeletingAccount}
                isConfirmDisabled={deleteConfirmText !== 'DELETE'}
            >
                <Stack spacing={2}>
                    <Typography>
                        This action is irreversible. All of your data will be permanently deleted.
                    </Typography>
                    <Typography>
                        To confirm, please type <strong>DELETE</strong> in the box below.
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="DELETE"
                        autoFocus
                    />
                </Stack>
            </ConfirmationModal>
        </>
    );
};
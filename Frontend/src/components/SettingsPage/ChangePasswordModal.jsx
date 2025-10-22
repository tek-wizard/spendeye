import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChangePassword } from '../../hooks/useChangePassword';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// A robust schema for password validation
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from your current one.",
  path: ["newPassword"],
});

export const ChangePasswordModal = ({ open, onClose }) => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const { changePassword, isChangingPassword } = useChangePassword();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit = (data) => {
        changePassword(data, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ component: 'form', onSubmit: handleSubmit(onSubmit) }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Change Password</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                        label="Current Password"
                        type={showCurrent ? "text" : "password"}
                        {...register("currentPassword")}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword?.message}
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrent(p => !p)} edge="end">
                                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="New Password"
                        type={showNew ? "text" : "password"}
                        {...register("newPassword")}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                         InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew(p => !p)} edge="end">
                                        {showNew ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type={showNew ? "text" : "password"}
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isChangingPassword}>
                    {isChangingPassword ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
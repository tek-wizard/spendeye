import React, { useState, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, CircularProgress, Typography, InputAdornment,Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "./auth.schema";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useForgotPassword } from "../../hooks/useForgotPassword";

export const ForgotPasswordModal = ({ open, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });
    
const { forgotPassword, isPending, isSuccess, reset: resetMutation } = useForgotPassword();

    const onSubmit = (data) => {
        forgotPassword(data);
    };

    const handleClose = useCallback(() => {
        onClose();
        setTimeout(() => {
            reset();
            resetMutation();
        }, 300);
    }, [onClose, reset, resetMutation]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ fontWeight: "bold", textAlign: 'center', pb: 1 }}>
                    {isSuccess ? 'Success!' : 'Forgot Password?'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1, minHeight: 120 }}>
                        {isSuccess ? (
                            <Stack alignItems="center" spacing={2}>
                                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48 }} />
                                <Typography align="center" color="text.secondary">
                                    If an account exists with this email, a link to reset your password has been sent.
                                </Typography>
                            </Stack>
                        ) : (
                            <>
                                <Typography align="center" color="text.secondary">
                                    Enter your account's email address to receive a password reset link.
                                </Typography>
                                <TextField
                                    label="Email Address"
                                    type="email"
                                    {...register("email")}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    autoFocus
                                    disabled={isPending}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={handleClose} disabled={isPending}>
                        {isSuccess ? 'Done' : 'Cancel'}
                    </Button>
                    {!isSuccess && (
                        <Button
                            type="submit" 
                            variant="contained"
                            disabled={isPending}
                        >
                            {isPending ? <CircularProgress size={24} /> : "Send Reset Link"}
                        </Button>
                    )}
                </DialogActions>
            </Box>
        </Dialog>
    );
};
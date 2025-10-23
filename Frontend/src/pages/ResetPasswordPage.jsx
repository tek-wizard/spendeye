import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../components/auth/auth.schema";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useResetPassword } from "../hooks/useResetPassword";
import { toast } from "sonner";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, isResetting } = useResetPassword();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data) => {
        if (!token) {
            toast.error("Invalid reset link. Please try again.");
            navigate('/auth');
            return;
        }
        
        resetPassword({ token, newPassword: data.newPassword });
    };

    return (
        // THE DEFINITIVE FIX: Apply centering styles directly to the container
        <Grid 
            container 
            sx={{ 
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2 // Add some padding for smaller screens
            }} 
            className="auth-background"
        >
            {/* The item is no longer needed for centering */}
            <Box
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    bgcolor: "rgba(30, 30, 46, 0.6)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    border: "1px solid",
                    borderColor: "rgba(255, 255, 255, 0.125)",
                    borderRadius: 4,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Set New Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
                    Your new password must be at least 8 characters long.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label="New Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            {...register("newPassword")}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            autoFocus
                            disabled={isResetting}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            disabled={isResetting}
                        />
                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ py: 1.5, mt: 1 }}
                            disabled={isResetting}
                        >
                            {isResetting ? (
                                <CircularProgress size={26} color="inherit" />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Grid>
    );
};

export default ResetPasswordPage;
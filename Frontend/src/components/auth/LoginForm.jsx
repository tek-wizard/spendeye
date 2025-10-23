import React, { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "./auth.schema" 

// Icons
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

//hooks
import { useLoginUser } from "../../hooks/useLoginUser"
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { SocialAuthDivider } from "./SocialAuthDivider"

export const LoginForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const { loginUser, isLoggingIn } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    loginUser(data);
  };

  return (
    <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Log in to continue to your dashboard.
        </Typography>

        {/* <SocialAuthDivider /> */}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <TextField
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Link
                        href="#"
                        variant="body2"
                        onClick={(e) => { e.preventDefault(); setForgotModalOpen(true); }}
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" }, 
                        }}
                    >
                        Forgot Password?
                    </Link>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ py: 1.5 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <CircularProgress size={26} color="inherit" />
                    ) : (
                        "Log in"
                    )}
                </Button>
            </Stack>
        </Box>

        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
        >
            Don't have an account?{" "}
            <Link
                href="#"
                onClick={onToggle}
                sx={{ fontWeight: "bold", color: "primary.main" }}
            >
                Sign up
            </Link>
        </Typography>
        
        <ForgotPasswordModal open={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} />
    </Box>
  );
};
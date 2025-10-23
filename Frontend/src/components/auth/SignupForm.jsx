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
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "./auth.schema"

// Icons
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"

//hooks
import { useRegisterUser } from '../../hooks/useRegisterUser';
import { SocialAuthDivider } from "./SocialAuthDivider" 

// Helper to check password requirements
const checkPasswordRequirements = (password) => {
  if (!password) return [];
  return [
    { label: "At least 6 characters", valid: password.length >= 6 },
  ];
};

export const SignupForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { registerUser, isRegistering } = useRegisterUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password", "")
  const requirements = checkPasswordRequirements(password)
  const allValid = requirements.every(req => req.valid);

  const onSubmit = async (data) => {
    registerUser(data);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start organizing your finances today.
      </Typography>

      <SocialAuthDivider />
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
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

          {/* Professional Checklist and Feedback */}
          {password.length > 0 && (
            <List dense sx={{ py: 0 }}>
              {requirements.map((req) => (
                <ListItem key={req.label} disableGutters sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: req.valid ? 'success.main' : 'text.secondary' }}>
                    {req.valid ? <CheckCircleIcon fontSize="small" /> : <RemoveCircleOutlineIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={req.label}
                    primaryTypographyProps={{ variant: 'caption', color: req.valid ? 'success.main' : 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5 }}
            disabled={isSubmitting || (password.length > 0 && !allValid)}
          >
            {isSubmitting ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
        </Stack>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 3, textAlign: "center" }}
      >
        Already have an account?{" "}
        <Link
          href="#"
          onClick={onToggle}
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Log in
        </Link>
      </Typography>
    </Box>
  )
}
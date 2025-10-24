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
  ListItemText,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "./auth.schema"

// Icons
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import CloudOffIcon from '@mui/icons-material/CloudOff'

// Hooks
import { useRegisterUser } from '../../hooks/useRegisterUser'
import { useHealthCheck } from '../../hooks/useHealthCheck'
import { SocialAuthDivider } from "./SocialAuthDivider" 

// Helper to check password requirements (unchanged)
const checkPasswordRequirements = (password) => {
  if (!password) return []
  return [
    { label: "At least 6 characters", valid: password.length >= 6 },
  ]
}

export const SignupForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { registerUser, isRegistering } = useRegisterUser()
  
  // The hook now provides more information for a better UX
  const { isBackendReady, isCheckingHealth, isError, failureCount } = useHealthCheck()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password", "")
  const requirements = checkPasswordRequirements(password)
  const allValid = requirements.every(req => req.valid)

  const onSubmit = async (data) => {
    registerUser(data)
  }

  // --- A multi-stage loading and error UI ---

  // Stage 1: The patient loader, with informative feedback
  if (isCheckingHealth) {
    return (
        <Stack spacing={2} alignItems="center" sx={{ minHeight: 400, justifyContent: 'center' }}>
            <CircularProgress />
            <Typography color="text.secondary">Connecting to service...</Typography>
            <Typography variant="caption" color="text.disabled">
                This can take up to 45 seconds on a cold start.
            </Typography>
        </Stack>
    )
  }

  // Stage 2: The final error state, with no retry button as requested
  if (isError && !isBackendReady) {
    return (
        <Stack spacing={2} alignItems="center" sx={{ minHeight: 400, justifyContent: 'center' }}>
            <CloudOffIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Service Unavailable</Typography>
            <Typography color="text.secondary" align="center">
                Could not connect to the server. Please refresh the page to try again.
            </Typography>
        </Stack>
    )
  }

  // Stage 3: The final, ready-to-use form
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start organizing your finances today.
      </Typography>

      {/* <SocialAuthDivider /> */}
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={isRegistering} 
          />
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isRegistering}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isRegistering} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isRegistering} 
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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
            disabled={isRegistering || (password.length > 0 && !allValid)} 
          >
            {isRegistering ? ( 
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
          onClick={(e) => { 
            e.preventDefault(); 
            if (!isRegistering) onToggle(); 
          }}
          sx={{ 
            fontWeight: "bold", 
            color: isRegistering ? 'text.disabled' : 'primary.main',
            pointerEvents: isRegistering ? 'none' : 'auto', 
          }}
        >
          Log in
        </Link>
      </Typography>
    </Box>
  )
}
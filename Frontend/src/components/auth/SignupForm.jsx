import React from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "./auth.schema"

// Icons
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

//hooks
import { useRegisterUser } from '../../hooks/useRegisterUser';

// Helper to check password strength
const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "inherit" }
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  let score = 1 // Base score for any password
  if (password.length > 8) score++
  if (hasNumber || hasSpecialChar) score++
  if (hasNumber && hasSpecialChar && hasUpperCase) score++

  switch (score) {
    case 1:
      return { score: 25, label: "Weak", color: "error" }
    case 2:
      return { score: 50, label: "Medium", color: "warning" }
    case 3:
      return { score: 75, label: "Good", color: "success" }
    case 4:
      return { score: 100, label: "Strong", color: "success" }
    default:
      return { score: 0, label: "", color: "inherit" }
  }
}

export const SignupForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const { registerUser, isRegistering } = useRegisterUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password", "") // Watch the password field for the strength meter
  const strength = checkPasswordStrength(password)

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

          {password.length > 0 && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={strength.score}
                color={strength.color}
              />
              <Typography
                variant="caption"
                color={strength.color + ".main"}
                sx={{ mt: 0.5, display: "block" }}
              >
                {strength.label}
              </Typography>
            </Box>
          )}

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

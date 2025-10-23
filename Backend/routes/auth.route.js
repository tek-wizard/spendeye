import express from "express";

// Middlewares
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

// Validation schemas
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "../validators/user.validator.js";

// Controllers
import { 
  handleGetMe, 
  handleloginUser, 
  handleRegistorUser,
  handleLogoutUser,          
  handleChangePassword,       
  handleForgotPassword,
  handleDeleteAccount,
  handleResetPassword,
  handleHealthCheck,       
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register a new user
router.post('/register', validate(registerSchema), handleRegistorUser);

// Login user
router.post('/login', validate(loginSchema), handleloginUser);

// Get current user details
router.get('/me', authMiddleware, handleGetMe);

// Health check route
router.get('/health', handleHealthCheck);

// Logout the current user
router.post('/logout', authMiddleware, handleLogoutUser);

// Change password (only when logged in)
router.post('/change-password', authMiddleware, validate(changePasswordSchema), handleChangePassword);

// Send password reset link
router.post('/forgot-password', validate(forgotPasswordSchema), handleForgotPassword);

// Reset password using token
router.post('/reset-password/:token', validate(resetPasswordSchema), handleResetPassword);

// Delete account
router.delete('/me', authMiddleware, handleDeleteAccount);

export default router;

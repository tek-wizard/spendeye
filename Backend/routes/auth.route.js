import express from "express";

//middlewares
import { authMiddleware } from "../middlewares/auth.middleware.js";

//validation
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema } from "../validators/user.validator.js";

//controllers
import { 
    handleGetMe, 
    handleloginUser, 
    handleRegistorUser,
    handleLogoutUser,          
    handleChangePassword,       
    handleForgotPassword,
    handleDeleteAccount,       
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', validate(registerSchema), handleRegistorUser);
router.post('/login', validate(loginSchema), handleloginUser);
router.get('/me', authMiddleware, handleGetMe);
// Route for logging out
router.post('/logout', authMiddleware, handleLogoutUser);

// Route for changing password while logged in
router.post('/change-password', authMiddleware, validate(changePasswordSchema), handleChangePassword);

// Route for initiating the forgot password process
router.post('/forgot-password', validate(forgotPasswordSchema), handleForgotPassword);

router.delete('/me', authMiddleware, handleDeleteAccount);


export default router;
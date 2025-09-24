import express from "express"

//middlewares
import { authMiddleware } from "../middlewares/auth.middleware.js"

//validation
import { validate } from "../middlewares/validate.middleware.js"
import { registerSchema,loginSchema } from "../validators/user.validator.js"

//controllers
import { handleGetMe, handleloginUser, handleRegistorUser } from "../controllers/auth.controller.js"

const router=express.Router()

router.post('/register',validate(registerSchema),handleRegistorUser)
router.post('/login',validate(loginSchema),handleloginUser)
router.get('/me',authMiddleware,handleGetMe)

export default router
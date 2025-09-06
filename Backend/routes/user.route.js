import express from "express"
import { registerSchema } from "../validators/user.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
import { handleAddContact, handleGetContacts, handleRegistorUser,handleloginUser } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router=express.Router()

router.post('/register',validate(registerSchema),handleRegistorUser)
router.post('/login',handleloginUser)
router.get('/contacts',authMiddleware,handleGetContacts)
router.patch('/contacts/add',authMiddleware,handleAddContact)

export default router
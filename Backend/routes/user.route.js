import express from "express"
import { contactSchema, updateProfileSchema } from "../validators/user.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
import { 
  handleAddContact, 
  handleGetContacts,
  handleUpdateBudget, 
  handleUpdateProfile
} from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Route for retrieving all contacts of the logged-in user
router.get('/contacts', authMiddleware, handleGetContacts)

// Route for adding a new contact
router.patch('/contacts/add', authMiddleware, validate(contactSchema), handleAddContact)

// Route for updating the user's budget
router.patch('/budget', authMiddleware, handleUpdateBudget)

// Route for updating user's profile information
router.patch('/profile', authMiddleware, validate(updateProfileSchema), handleUpdateProfile)

export default router

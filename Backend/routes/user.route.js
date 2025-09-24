import express from "express"
import { contactSchema } from "../validators/user.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
import { handleAddContact, handleGetContacts,handleUpdateBudget} from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router=express.Router()

router.get('/contacts',authMiddleware,handleGetContacts)
router.patch('/contacts/add',authMiddleware,validate(contactSchema),handleAddContact)
router.patch('/budget',authMiddleware,handleUpdateBudget)

export default router
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { handleExpenseCreation, handleExpenseRetrieval } from "../controllers/expense.controller.js";
import { validate } from "../middlewares/validate.middleware.js"
import { expenseSchema } from "../validators/expense.validator.js";

const router=express.Router()

router.post('/create',authMiddleware,validate(expenseSchema),handleExpenseCreation)
router.get('/',authMiddleware,handleExpenseRetrieval)

export default router
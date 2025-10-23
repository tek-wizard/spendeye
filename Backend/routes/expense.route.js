import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {
  handleExpenseCreation,
  handleExpenseRetrieval,
  handleExpenseSummary,
  handleEditExpense,
  handleDeleteExpense,
  getAnalyzedExpenses,
  getMonthlyStory,
} from "../controllers/expense.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { expenseSchema, editExpenseSchema } from "../validators/expense.validator.js"

const router = express.Router()

// Route for retrieving all expenses of the logged-in user
router.get("/", authMiddleware, handleExpenseRetrieval)

// Route for retrieving expense summary and category totals
router.get("/summary", authMiddleware, handleExpenseSummary)

// Route for analyzing user expenses with insights
router.get("/analyze", authMiddleware, getAnalyzedExpenses)

// Route for generating monthly financial story
router.get("/monthly-story", authMiddleware, getMonthlyStory)

// Route for creating a new expense entry
router.post("/create", authMiddleware, validate(expenseSchema), handleExpenseCreation)

// Route for editing an existing expense
router.put("/:id", authMiddleware, validate(editExpenseSchema), handleEditExpense)

// Route for deleting an expense
router.delete("/:id", handleDeleteExpense)

export default router

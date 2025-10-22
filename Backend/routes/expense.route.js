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
import { expenseSchema,editExpenseSchema } from "../validators/expense.validator.js"

const router = express.Router()

//GET
router.get("/", authMiddleware, handleExpenseRetrieval)
router.get("/summary", authMiddleware, handleExpenseSummary)
router.get("/analyze", authMiddleware, getAnalyzedExpenses);
router.get("/monthly-story", authMiddleware, getMonthlyStory);

//POST
router.post(
  "/create",
  authMiddleware,
  validate(expenseSchema),
  handleExpenseCreation
)

//PUT
router.put("/:id",authMiddleware,validate(editExpenseSchema), handleEditExpense)

//DELETE
router.delete("/:id", handleDeleteExpense)

export default router

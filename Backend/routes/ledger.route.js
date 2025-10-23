import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {
  handleCreateLedger,
  handleLedgerSummary,
  handleLedgerRetrieval,
  handleLedgerDebtorsRetrieval,
  handleLedgerCreditorsRetrieval,
  handleLedgerSettlement,
  handleDeleteLedger,
  getPeopleSummary,
  getHistoryByPerson,
} from "../controllers/ledger.controller.js"

const router = express.Router()

// Route for creating a new ledger entry
router.post("/create", authMiddleware, handleCreateLedger)

// Route for settling a ledger (marking debts as paid)
router.post("/settle", authMiddleware, handleLedgerSettlement)

// Route for retrieving overall ledger summary
router.get("/summary", authMiddleware, handleLedgerSummary)

// Route for retrieving all ledger entries
router.get("/", authMiddleware, handleLedgerRetrieval)

// Route for retrieving all debtors (people who owe the user)
router.get("/debtors", authMiddleware, handleLedgerDebtorsRetrieval)

// Route for retrieving all creditors (people whom the user owes)
router.get("/creditors", authMiddleware, handleLedgerCreditorsRetrieval)

// Route for deleting a specific ledger entry
router.delete("/:id", authMiddleware, handleDeleteLedger)

// Route for getting a summary of all people involved in ledgers
router.get("/people", authMiddleware, getPeopleSummary)

// Route for retrieving the ledger history with a specific person
router.get("/history/:personName", authMiddleware, getHistoryByPerson)

export default router

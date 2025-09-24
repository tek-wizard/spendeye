import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { handleCreateLedger,handleLedgerSummary,handleLedgerRetrieval,handleLedgerDebtorsRetrieval,handleLedgerCreditorsRetrieval,handleLedgerSettlement,handleDeleteLedger } from "../controllers/ledger.controller.js"

const router = express.Router()

router.post("/create",authMiddleware, handleCreateLedger)
router.post("/settle",authMiddleware, handleLedgerSettlement)
router.get("/summary",authMiddleware, handleLedgerSummary)
router.get("/",authMiddleware, handleLedgerRetrieval)
router.get("/debtors",authMiddleware, handleLedgerDebtorsRetrieval)
router.get("/creditors",authMiddleware, handleLedgerCreditorsRetrieval)
router.delete("/:id",authMiddleware,handleDeleteLedger)

export default router

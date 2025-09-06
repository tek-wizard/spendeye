import express from "express"
import Ledger from "../models/ledger.model.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create",authMiddleware, async (req, res) => {
  try {
    const { person, amount, type, notes, date } = req.body
    const userId = req.user._id

    const newLedger = new Ledger({
      userId,
      person,
      amount,
      type,
      notes,
      date,
    })

    await newLedger.save()

    res.status(201).json({
        success:true,
        message:"Ledger created successfully",
        ledger:newLedger
    })
  } catch (error) {
    res.status(500).json({
        success:false,
        message:"Error while creating a new Ledger",
        error:error
    })
  }
})

export default router

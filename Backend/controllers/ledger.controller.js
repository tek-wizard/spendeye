import Ledger from "../models/ledger.model.js"
import Expense from "../models/expense.model.js"
import mongoose from "mongoose"

// A helper function to round numbers to 2 decimal places reliably
const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100

export const handleCreateLedger = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { person, amount, notes, date } = req.body
    let { type } = req.body
    const userId = new mongoose.Types.ObjectId(req.user._id)
    const numericAmount = round(parseFloat(amount))

    // STEP 1: Calculate the current balance for this person
    const balancePipeline = [
      { $match: { userId, person } },
      {
        $group: {
          _id: null,
          netBalance: {
            $sum: {
              $cond: [
                { $in: ["$type", ["Borrowed", "Got Back"]] },
                { $multiply: ["$amount", -1] },
                "$amount",
              ],
            },
          },
        },
      },
    ]
    const balanceResult = await Ledger.aggregate(balancePipeline, { session })
    const netBalance = round(balanceResult[0]?.netBalance || 0)

    const debtOwedByUser = round(-netBalance) // you owe this much
    const debtOwedToUser = round(netBalance) // they owe you this much

    // STEP 2: Determine actual type based on intent and debt state
    if (type === "Given") {
      type = debtOwedByUser > 0 ? "Paid Back" : "Lent"
    } else if (type === "Received") {
      type = debtOwedToUser > 0 ? "Got Back" : "Borrowed"
    }

    let responsePayload = { success: true }

    const isCloseEnough = Math.abs(numericAmount - debtOwedByUser) < 0.01
    const isOverpayment =
      (type === "Paid Back" || type === "Lent") &&
      debtOwedByUser > 0 &&
      numericAmount > debtOwedByUser &&
      !isCloseEnough

    const isOverCollection =
      (type === "Got Back" || type === "Borrowed") &&
      debtOwedToUser > 0 &&
      numericAmount > debtOwedToUser + 0.001

    // --- SCENARIO A: Overpayment ---
    if (isOverpayment) {
      const settlementAmount = debtOwedByUser
      const overpaymentAmount = round(numericAmount - settlementAmount)
      const groupId = new mongoose.Types.ObjectId()

      const settlementLedger = new Ledger({
        userId,
        person,
        amount: settlementAmount,
        type: "Paid Back",
        notes,
        date,
        groupId,
      })
      const settlementExpense = new Expense({
        userId,
        person,
        totalAmount: settlementAmount,
        category: "Debt Repayment",
        notes,
        date,
        groupId,
      })
      const overpaymentLedger = new Ledger({
        userId,
        person,
        amount: overpaymentAmount,
        type: "Lent",
        notes,
        date,
        groupId,
      })
      const overpaymentExpense = new Expense({
        userId,
        person,
        totalAmount: overpaymentAmount,
        category: "Loan Given",
        notes,
        date,
        groupId,
      })

      await Promise.all([
        settlementLedger.save({ session }),
        settlementExpense.save({ session }),
        overpaymentLedger.save({ session }),
        overpaymentExpense.save({ session }),
      ])

      responsePayload.message = "Payment processed successfully"
      // Manually construct the response object to be consistent.
      responsePayload.createdExpenses = [
        { ...settlementExpense.toObject(), category: "Paid Back" },
        { ...overpaymentExpense.toObject(), category: "Lent" },
      ]

      // --- SCENARIO B: Over-collection ---
    } else if (isOverCollection) {
      const settlementAmount = debtOwedToUser
      const overCollectionAmount = round(numericAmount - settlementAmount)
      const groupId = new mongoose.Types.ObjectId()

      const settlementLedger = new Ledger({
        userId,
        person,
        amount: settlementAmount,
        type: "Got Back",
        notes,
        date,
        groupId,
      })
      const overCollectionLedger = new Ledger({
        userId,
        person,
        amount: overCollectionAmount,
        type: "Borrowed",
        notes,
        date,
        groupId,
      })

      await Promise.all([
        settlementLedger.save({ session }),
        overCollectionLedger.save({ session }),
      ])

      responsePayload.message = "Payment received successfully"
      responsePayload.createdLedgers = [
        settlementLedger,
        overCollectionLedger,
      ].map((l) => ({
        ...l.toObject(),
        totalAmount: l.amount,
        category: l.type,
      }))

      // --- SCENARIO C: Normal transaction ---
    } else {
      const finalAmount =
        type === "Paid Back" && isCloseEnough ? debtOwedByUser : numericAmount
      const newLedger = new Ledger({
        userId,
        person,
        amount: finalAmount,
        type,
        notes,
        date,
      })
      await newLedger.save({ session })
      responsePayload.message = "Ledger entry created"

      if (type === "Paid Back" || type === "Lent") {
        const category = type === "Paid Back" ? "Debt Repayment" : "Loan Given"
        const newExpense = new Expense({
          userId,
          person,
          totalAmount: finalAmount,
          category,
          notes,
          date,
          linkedLedgerId: newLedger._id,
        })
        await newExpense.save({ session })
        responsePayload.createdExpenses = [newExpense]
      }
    }

    await session.commitTransaction()
    return res.status(201).json(responsePayload)
  } catch (error) {
    await session.abortTransaction()
    console.error("Error creating ledger entry:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while creating ledger entry",
    })
  } finally {
    session.endSession()
  }
}

export const handleLedgerRetrieval = async (req, res) => {
  try {
    const userId = req.user._id

    const ledgers = await Ledger.find({ userId }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      message: "Ledgers Retrieved",
      ledgers,
    })
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error while retrieving ledgers",
      error,
    })
  }
}

export const handleLedgerSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const summary = await Ledger.aggregate([
      { $match: { userId } },
      {
        $project: {
          person: { $trim: { input: "$person" } },
          type: 1,
          signedAmount: {
            $cond: [
              { $in: ["$type", ["Borrowed", "Got Back"]] },
              { $multiply: [{ $toDouble: { $ifNull: ["$amount", 0] } }, -1] },
              { $toDouble: { $ifNull: ["$amount", 0] } },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$person",
          netByPerson: { $sum: "$signedAmount" },
        },
      },
      {
        $addFields: {
          netByPerson: { $round: ["$netByPerson", 2] },
        },
      },
      {
        $match: {
          netByPerson: { $ne: 0 },
        },
      },
      {
        $project: {
          type: {
            $cond: [{ $gt: ["$netByPerson", 0] }, "Lent", "Borrowed"],
          },
          amount: { $abs: "$netByPerson" },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      message: "Ledgers Retrieved",
      summary,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieving ledgers",
      error,
    })
  }
}

export const handleLedgerDebtorsRetrieval = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: "$person",
          totalAmount: {
            $sum: {
              $cond: [
                { $in: ["$type", ["Borrowed", "Got Back"]] },
                { $multiply: [{ $toDouble: "$amount" }, -1] },
                { $toDouble: "$amount" },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAmount: { $round: ["$totalAmount", 2] },
        },
      },
      { $match: { totalAmount: { $gt: 0 } } },
      { $sort: { totalAmount: -1 } },
    ]

    const Debtors = await Ledger.aggregate(pipeline)

    res.status(200).json({
      success: true,
      message: "List of debtors Retrieved",
      Debtors,
    })
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error while retrieving list of debtors",
      error,
    })
  }
}

export const handleLedgerCreditorsRetrieval = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: "$person",
          totalAmount: {
            $sum: {
              $cond: [
                { $in: ["$type", ["Borrowed", "Got Back"]] },
                { $toDouble: { $ifNull: ["$amount", 0] } },
                { $multiply: [{ $toDouble: { $ifNull: ["$amount", 0] } }, -1] },
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAmount: { $round: ["$totalAmount", 2] },
        },
      },
      { $match: { totalAmount: { $gt: 0 } } },
      { $sort: { totalAmount: -1 } },
    ]

    const Creditors = await Ledger.aggregate(pipeline)

    res.status(200).json({
      success: true,
      message: "List of creditors Retrieved",
      Creditors,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieving list of creditors",
      error,
    })
  }
}

export const handleLedgerSettlement = async (req, res) => {
  try {
    const listOfExpenses = req.body.listOfExpenses

    listOfExpenses.map(async (expense) => {
      const { name, amount, notes, date } = expense

      const newLedger = new Ledger({
        userId: req.user._id,
        person: name,
        amount,
        type: "Settle",
        notes,
        date,
      })

      await newLedger.save()

      const newExpense = new Expense({
        userId: req.user._id,
        totalAmount: amount,
        personalShare: amount,
        category: "Debt Repayment",
        notes,
        date,
        isSplit: false,
      })

      await newExpense.save()
    })

    res.status(200).json({
      success: true,
      message: "Debt settled",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while settling debts",
      error,
    })
  }
}

export const handleDeleteLedger = async (req, res) => {
  try {
    const { id } = req.params

    const ledger = await Ledger.findByIdAndDelete(id)

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "No ledger found",
      })
    }

    return res.status(201).json({
      success: true,
      message: "Ledger deleted",
    })
  } catch (error) {
    return res.status(201).json({
      success: false,
      message: "Error while deleting ledger",
    })
  }
}

export const getPeopleSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: "$person",
          netBalance: {
            $sum: {
              $cond: [
                { $in: ["$type", ["Borrowed", "Got Back"]] },
                { $multiply: ["$amount", -1] },
                "$amount",
              ],
            },
          },
        },
      },
      { $addFields: { netBalance: { $round: ["$netBalance", 2] } } },
      { $sort: { netBalance: -1 } },
      { $project: { _id: 0, person: "$_id", netBalance: 1 } },
    ]

    const people = await Ledger.aggregate(pipeline)

    res.status(200).json({
      success: true,
      message: "Ledger people summary retrieved successfully",
      people,
    })
  } catch (error) {
    console.error("Error fetching people summary:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching people summary",
    })
  }
}

export const getHistoryByPerson = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)
    const { personName } = req.params

    if (!personName) {
      return res
        .status(400)
        .json({ success: false, message: "Person name is required" })
    }

    const history = await Ledger.find({
      userId,
      person: personName,
    }).sort({ date: "asc" })

    res.status(200).json({
      success: true,
      message: `History with ${personName} retrieved successfully`,
      history,
    })
  } catch (error) {
    console.error("Error fetching history by person:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching history",
    })
  }
}

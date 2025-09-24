import Expense from "../models/expense.model.js"
import Ledger from "../models/ledger.model.js"
import mongoose from "mongoose"
import User from "../models/user.model.js"

export const handleExpenseCreation = async (req, res) => {
  try {
    const {
      totalAmount,
      personalShare,
      category,
      notes,
      date,
      isSplit,
      splitDetails,
    } = req.validatedData
    const { _id: userId } = req.user

    const newExpense = new Expense({
      userId,
      totalAmount,
      personalShare,
      category,
      notes,
      date,
      isSplit,
    })

    if (isSplit && splitDetails.length > 0) {
      const entries = await Promise.all(
        splitDetails.map(async (split) => {
          const { person, amountOwed: amount } = split
          const newLedger = new Ledger({
            userId,
            person,
            amount,
            type: "Lent",
            notes,
            date,
          })

          await newLedger.save()

          return {
            ...split,
            ledgerId: newLedger._id,
          }
        })
      )

      newExpense.splitDetails = entries
    }

    await newExpense.save()

    res.status(201).json({
      success: true,
      message: "Expense created",
      expense: newExpense,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating expense",
      error: error,
    })
  }
}

export const handleEditExpense = async (req, res) => {
  try {
    const { id } = req.params
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "No expense found",
      })
    }

    // Delete old ledgers if expense was split
    if (expense.isSplit && Array.isArray(expense.splitDetails)) {
      await Promise.all(
        expense.splitDetails.map((split) =>
          Ledger.findByIdAndDelete(split.ledgerId)
        )
      )
    }

    const { notes, date, isSplit, splitDetails = [] } = req.body
    const userId = req.user._id
    let fullSplitDetails = splitDetails

    // Create new ledgers if updated expense is split
    if (isSplit && splitDetails.length > 0) {
      fullSplitDetails = await Promise.all(
        splitDetails.map(async (split) => {
          const { person, amountOwed: amount } = split
          const newLedger = new Ledger({
            userId,
            person,
            amount,
            type: "Lent",
            notes,
            date,
          })

          await newLedger.save()

          return {
            ...split,
            ledgerId: newLedger._id,
          }
        })
      )
    }

    // Update the expense
    await Expense.findByIdAndUpdate(
      id,
      { $set: { ...req.body, splitDetails: fullSplitDetails } },
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      success: true,
      message: "Expense edited",
    })
  } catch (error) {
    console.error("Error editing expense:", error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong while editing expense",
      error: error.message,
    })
  }
}



export const handleExpenseRetrieval = async (req, res) => {
  try {
    const { _id: userId } = req.user

    const { startDate = "1970-01-01T00:00:00Z", endDate = new Date() } =
      req.query

    const allExpenses = await Expense.find({
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      expenses: allExpenses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching expenses",
      error,
    })
  }
}

export const handleExpenseSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    // Date range from query, defaults if missing
    const { startDate = "1970-01-01T00:00:00Z", endDate = new Date() } =
      req.query

    // Calculate previous month range for trend
    const currentStart = new Date(startDate)
    const currentEnd = new Date(endDate)

    const prevStart = new Date(currentStart)
    prevStart.setMonth(prevStart.getMonth() - 1)

    const prevEnd = new Date(currentEnd)
    prevEnd.setMonth(prevEnd.getMonth() - 1)

    // Aggregation pipeline for current period
    const pipeline = [
      {
        $match: {
          userId,
          date: { $gte: currentStart, $lte: currentEnd },
        },
      },
      {
        $facet: {
          summaryCard: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          sparklineData: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                total: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          spendingChartData: [
            { $group: { _id: "$category", total: { $sum: "$totalAmount" } } },
            { $sort: { total: -1 } },
          ],
        },
      },
    ]

    const [result] = await Expense.aggregate(pipeline)

    const currentTotal = result?.summaryCard[0]?.total || 0

    // Previous period total (for trend)
    const [prevResult] = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])
    const prevTotal = prevResult?.total || 0

    // Trend calculation
    const trendPercentage =
      prevTotal === 0 ? 100 : ((currentTotal - prevTotal) / prevTotal) * 100

    // Get user budget
    const user = await User.findById(userId)
    const budget = user?.budget || 0

    res.status(200).json({
      success: true,
      message: "Expense summary fetched successfully",
      summaryCard: {
        total: currentTotal,
        budget,
        trendPercentage: Number(trendPercentage.toFixed(2)),
      },
      sparklineData: result.sparklineData.map((d) => ({
        day: d._id,
        total: d.total,
      })),
      spendingChartData: result.spendingChartData.map((d) => ({
        category: d._id,
        total: d.total,
      })),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Error while fetching expenses",
      error,
    })
  }
}

export const handleDeleteExpense = async (req, res) => {
  try {
    const { id } = req.params

    const expense = await Expense.findByIdAndDelete(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "No expense found",
      })
    }

    if (expense.isSplit) {
      await Promise.all(
        expense.splitDetails.map((split) => {
          Ledger.findByIdAndDelete(split.ledgerId)
        })
      )
    }

    return res.status(201).json({
      success: true,
      message: "Expense deleted",
    })
  } catch (error) {
    return res.status(201).json({
      success: false,
      message: "Error while deleting expense",
    })
  }
}

import Expense from "../models/expense.model.js"
import Ledger from "../models/ledger.model.js"
import mongoose from "mongoose"
import User from "../models/user.model.js"
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns"

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
    if (
      expense.isSplit &&
      expense.splitDetails &&
      expense.splitDetails.length > 0
    ) {
      const ledgerIdsToDelete = expense.splitDetails
        .map((split) => split.ledgerId)
        .filter((id) => id)
      if (ledgerIdsToDelete.length > 0) {
        await Ledger.deleteMany({ _id: { $in: ledgerIdsToDelete } })
      }
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

    if (
      expense.isSplit &&
      expense.splitDetails &&
      expense.splitDetails.length > 0
    ) {
      const ledgerIdsToDelete = expense.splitDetails
        .map((split) => split.ledgerId)
        .filter((id) => id)
      if (ledgerIdsToDelete.length > 0) {
        await Ledger.deleteMany({ _id: { $in: ledgerIdsToDelete } })
      }
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

export const getAnalyzedExpenses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    // --- Destructure all possible query parameters ---
    const {
      startDate = "1970-01-01T00:00:00Z",
      endDate = new Date().toISOString(),
      search = "",
      categories = "",
      minAmount = "0",
      maxAmount = "100000000",
      isSplit,
      page = "1",
      limit = "25",
    } = req.query

    // --- Build the initial $match stage for the aggregation pipeline ---
    const matchStage = {
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      totalAmount: { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) },
    }

    if (search) {
      matchStage.notes = { $regex: search, $options: "i" } // Case-insensitive search
    }
    if (categories) {
      matchStage.category = { $in: categories.split(",") } // Handle multiple categories
    }
    if (isSplit !== undefined) {
      matchStage.isSplit = isSplit === "true" // Handle boolean filter
    }

    // --- Calculate pagination variables ---
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    // --- Main Aggregation Pipeline using $facet ---
    const aggregationPipeline = [
      { $match: matchStage },
      {
        $facet: {
          // Pipeline 1: Get metadata and metrics
          metadata: [
            {
              $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalSpent: { $sum: "$totalAmount" },
              },
            },
          ],
          // Pipeline 2: Get category breakdown for the bar chart
          categoryBreakdown: [
            { $group: { _id: "$category", total: { $sum: "$totalAmount" } } },
            { $project: { category: "$_id", total: 1, _id: 0 } },
            { $sort: { total: -1 } },
          ],
          // Pipeline 3: Get the paginated transaction data
          transactions: [
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: limitNum },
          ],
        },
      },
    ]

    const [results] = await Expense.aggregate(aggregationPipeline)

    // --- Format the response ---
    const metadata = results.metadata[0] || {
      totalTransactions: 0,
      totalSpent: 0,
    }
    const totalPages = Math.ceil(metadata.totalTransactions / limitNum)

    const dateDiffInDays =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 3600 * 24)
    const averageDailySpend = metadata.totalSpent / (dateDiffInDays || 1)

    res.status(200).json({
      success: true,
      message: "Analyzed expenses fetched successfully",
      data: {
        transactions: results.transactions || [],
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalTransactions: metadata.totalTransactions,
        },
        metrics: {
          totalSpent: metadata.totalSpent,
          averageDailySpend: parseFloat(averageDailySpend.toFixed(2)),
        },
        categoryBreakdown: results.categoryBreakdown || [],
      },
    })
  } catch (error) {
    console.error("Error fetching analyzed expenses:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while analyzing expenses.",
      error: error.message,
    })
  }
}

export const getMonthlyStory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)
    const monthQuery = req.query.month ? new Date(req.query.month) : new Date()

    const startDate = startOfMonth(monthQuery)
    const endDate = endOfMonth(monthQuery)
    const prevMonthStart = startOfMonth(subMonths(monthQuery, 1))

    // A single, top-level $facet with parallel pipelines. No nesting.
    const pipeline = [
      {
        $facet: {
          // --- Pipeline 1: Get all raw expenses for the current month ---
          currentMonthExpenses: [
            { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
          ],
          // --- Pipeline 2: Get the total for the previous month (runs in parallel) ---
          prevMonthTotal: [
            {
              $match: {
                userId,
                date: { $gte: prevMonthStart, $lt: startDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ]

    const [results] = await Expense.aggregate(pipeline)
    const currentMonthExpenses = results.currentMonthExpenses

    // Gracefully handle a month with no expenses
    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
      const emptyPayload = {
        aiSummary: {
          totalSpent: 0,
          changeVsPreviousMonth: 0,
          topCategory: "N/A",
        },
        heatmapData: [],
        categoryBreakdown: [],
        notableTransactions: {
          largestExpense: null,
          mostFrequentCategory: null,
          highestSpendingDay: null,
        },
      }
      return res.status(200).json({ success: true, data: emptyPayload })
    }

    // --- Perform final calculations in JavaScript from the pre-filtered data ---
    const currentTotal = currentMonthExpenses.reduce(
      (sum, tx) => sum + tx.totalAmount,
      0
    )
    const prevTotal = results.prevMonthTotal[0]?.total || 0

    const changeVsPreviousMonth =
      prevTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - prevTotal) / prevTotal) * 100

    const categoryMap = currentMonthExpenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.totalAmount
      return acc
    }, {})
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)

    const heatmapData = Object.entries(
      currentMonthExpenses.reduce((acc, tx) => {
        const day = format(new Date(tx.date), "yyyy-MM-dd")
        acc[day] = (acc[day] || 0) + tx.totalAmount
        return acc
      }, {})
    ).map(([date, amount]) => ({ date, amount }))

    const largestExpense = [...currentMonthExpenses].sort(
      (a, b) => b.totalAmount - a.totalAmount
    )[0]
    const freqMap = currentMonthExpenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + 1
      return acc
    }, {})
    const mostFrequentCategory = Object.entries(freqMap).sort(
      (a, b) => b[1] - a[1]
    )[0]
    const dayMap = currentMonthExpenses.reduce((acc, tx) => {
      const day = format(new Date(tx.date), "yyyy-MM-dd")
      acc[day] = (acc[day] || 0) + tx.totalAmount
      return acc
    }, {})
    const highestSpendingDay = Object.entries(dayMap).sort(
      (a, b) => b[1] - a[1]
    )[0]

    const payload = {
      aiSummary: {
        totalSpent: currentTotal,
        changeVsPreviousMonth: Number(changeVsPreviousMonth.toFixed(2)),
        topCategory: categoryBreakdown[0]?.category || "N/A",
      },
      heatmapData,
      categoryBreakdown,
      notableTransactions: {
        largestExpense,
        mostFrequentCategory: {
          category: mostFrequentCategory[0],
          count: mostFrequentCategory[1],
        },
        highestSpendingDay: {
          date: highestSpendingDay[0],
          amount: highestSpendingDay[1],
        },
      },
    }

    res.status(200).json({ success: true, data: payload })
  } catch (error) {
    console.error("Error fetching monthly story:", error)
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching insights" })
  }
}

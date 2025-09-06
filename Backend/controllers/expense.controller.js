import Expense from "../models/expense.model.js"
import Ledger from "../models/ledger.model.js"

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

      console.log(entries)
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

export const handleExpenseRetrieval = async (req, res) => {
  try {
    const { _id: userId } = req.user

    const allExpenses = await Expense.find({ userId }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      message: "Expenses fetched succesfully",
      expenses: allExpenses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching expenses",
      error: error,
    })
  }
}

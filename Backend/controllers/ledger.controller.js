import Ledger from "../models/ledger.model.js";
import Expense from "../models/expense.model.js";
import mongoose from "mongoose";

export const handleCreateLedger = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { person, amount, notes, date } = req.body;
    let { type } = req.body; // User's initial intent: "Given" or "Received"
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const numericAmount = parseFloat(amount);

    // STEP 1: Always calculate the current balance to understand the context.
    const balancePipeline = [
      { $match: { userId, person } },
      { $group: { _id: null, netBalance: { $sum: { $cond: [{ $in: ["$type", ["Borrowed", "Got Back"]] }, { $multiply: ["$amount", -1] }, "$amount"] } } } }
    ];
    const balanceResult = await Ledger.aggregate(balancePipeline, { session });
    const netBalance = balanceResult[0]?.netBalance || 0;
    
    const debtOwedByUser = -netBalance;
    const debtOwedToUser = netBalance;

    // STEP 2: Translate the user's simple intent into a specific accounting type.
    if (type === 'Given') {
        type = debtOwedByUser > 0 ? 'Paid Back' : 'Lent';
    } else if (type === 'Received') {
        type = debtOwedToUser > 0 ? 'Got Back' : 'Borrowed';
    }

    let responsePayload = { success: true };

    // SCENARIO A: Handling an overpayment (creates a group)
    if ((type === 'Paid Back' || type === 'Lent') && debtOwedByUser > 0 && numericAmount > debtOwedByUser) {
        const settlementAmount = debtOwedByUser;
        const overpaymentAmount = numericAmount - settlementAmount;
        const groupId = new mongoose.Types.ObjectId(); // Create a single ID to group these transactions

        const settlementLedger = new Ledger({ userId, person, amount: settlementAmount, type: 'Paid Back', notes, date, groupId });
        const settlementExpense = new Expense({ userId, person, totalAmount: settlementAmount, category: 'Debt Repayment', notes, date, groupId });
        const overpaymentLedger = new Ledger({ userId, person, amount: overpaymentAmount, type: 'Lent', notes, date, groupId });
        const overpaymentExpense = new Expense({ userId, person, totalAmount: overpaymentAmount, category: 'Loan Given', notes, date, groupId });
        
        await Promise.all([
            settlementLedger.save({ session }), settlementExpense.save({ session }),
            overpaymentLedger.save({ session }), overpaymentExpense.save({ session })
        ]);

        responsePayload.message = "Payment processed successfully";
        responsePayload.createdExpenses = [settlementExpense, overpaymentExpense];

    // SCENARIO B: Handling an over-collection (creates a group)
    } else if ((type === 'Got Back' || type === 'Borrowed') && debtOwedToUser > 0 && numericAmount > debtOwedToUser) {
        const settlementAmount = debtOwedToUser;
        const overCollectionAmount = numericAmount - settlementAmount;
        const groupId = new mongoose.Types.ObjectId();

        const settlementLedger = new Ledger({ userId, person, amount: settlementAmount, type: 'Got Back', notes, date, groupId });
        const overCollectionLedger = new Ledger({ userId, person, amount: overCollectionAmount, type: 'Borrowed', notes, date, groupId });
        
        await Promise.all([settlementLedger.save({ session }), overCollectionLedger.save({ session })]);
        
        responsePayload.message = "Payment received successfully";
        // Map ledger data to a consistent format for the notification modal
        responsePayload.createdLedgers = [settlementLedger, overCollectionLedger].map(l => ({...l.toObject(), totalAmount: l.amount, category: l.type}));

    // DEFAULT: Handling a simple, non-grouped transaction
    } else {
      const newLedger = new Ledger({ userId, person, amount: numericAmount, type, notes, date });
      await newLedger.save({ session });
      responsePayload.message = "Ledger entry created";

      if (type === "Paid Back" || type === "Lent") {
        const category = type === "Paid Back" ? "Debt Repayment" : "Loan Given";
        const newExpense = new Expense({ userId, person, totalAmount: numericAmount, category, notes, date });
        await newExpense.save({ session });
        responsePayload.createdExpenses = [newExpense];
      }
    }
    
    await session.commitTransaction();
    return res.status(201).json(responsePayload);

  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating ledger entry:", error);
    return res.status(500).json({ success: false, message: "Server error while creating ledger entry" });
  } finally {
    session.endSession();
  }
};

// ... (the rest of the functions: handleLedgerRetrieval, handleLedgerSummary, etc. remain unchanged)
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
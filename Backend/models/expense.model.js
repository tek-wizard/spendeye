import mongoose from "mongoose"

const ExpenseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    personalShare: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "Housing",
        "Utilities",
        "Food",
        "Transportation",
        "Health",
        "Education",
        "Entertainment",
        "Shopping",
        "Debt Repayment",
        "Loan Given",
        "Miscellaneous",
      ],
      required: true,
    },
    notes: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    isSplit: {
      type: Boolean,
      default: false,
    },

    // This array has the objects of the friends involved
    splitDetails: [
      {
        person: {
          type: String,
          required: true,
        },
        amountOwed: {
          type: Number,
          required: true,
        },
        ledgerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ledger",
        },
      },
    ],
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  { timestamps: true }
)

const Expense = mongoose.model("Expense", ExpenseSchema)

export default Expense

// Housing → Rent, Mortgage, Property tax, Repairs
// Food→ Groceries, Dining out, Coffee/Tea, Snacks
// Transportation → Fuel, Public transport, Parking, Car maintenance
// Health → Medical bills, Insurance, Medicines, Gym
// Education → School fees, Courses, Books, Subscriptions (e.g. Coursera)
// Entertainment & Leisure → Movies, Games, Hobbies, Vacations, Streaming services (Netflix, Spotify),Mobile Recharge
// Shopping → Clothes, Electronics, Furniture
// Debt Repayment → settling debts
// Loan Given → amount given to contacts
// Miscellaneous → Gifts, Donations, Pet care

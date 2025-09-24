import { z } from "zod"

// Schema for a single item in the split details array.
const splitDetailSchema = z.object({
  person: z.string().min(1, "Friend's name cannot be empty"),
  amountOwed: z.coerce.number().positive("Amount owed must be greater than 0"),
})

// The main expense schema
export const expenseSchema = z
  .object({
    totalAmount: z.coerce
      .number()
      .positive("Total amount must be greater than 0"),
    personalShare: z.coerce
      .number()
      .min(0, "Your share cannot be negative")
      .default(0),
    category: z.enum([
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
    ]),
    notes: z.string().max(200).optional(),
    date: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid date format. Use YYYY-MM-DD",
      })
      .transform((val) => new Date(val)),
    isSplit: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((val) => {
        if (typeof val === "boolean") return val
        return val === "true"
      })
      .default(false),
    splitDetails: z.array(splitDetailSchema).default([]), // always an array
  })
  .superRefine((data, ctx) => {
    // If the expense is NOT a split → personalShare = totalAmount
    if (!data.isSplit) {
      data.personalShare = data.totalAmount
      return
    }

    // If the expense IS a split...
    if (data.splitDetails.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["splitDetails"],
        message:
          "You must provide at least one friend when splitting an expense.",
      })
      return
    }

    // Check math
    const totalOwedByFriends = data.splitDetails.reduce(
      (acc, split) => acc + split.amountOwed,
      0
    )

    if (
      Math.abs(data.personalShare + totalOwedByFriends - data.totalAmount) >=
      0.01
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["totalAmount"],
        message:
          "The sum of your share and amounts owed by friends must equal the total amount.",
      })
    }
  })

export const editExpenseSchema=z
.object({
  totalAmount: z.coerce
    .number()
    .positive("Total amount must be greater than 0").optional(),
  personalShare: z.coerce
    .number()
    .min(0, "Your share cannot be negative")
    .default(0).optional(),
  category: z.enum([
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
  ]).optional(),
  notes: z.string().max(200).optional(),
  date: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format. Use YYYY-MM-DD",
    })
    .transform((val) => new Date(val)).optional(),
  isSplit: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((val) => {
      if (typeof val === "boolean") return val
      return val === "true"
    })
    .default(false).optional(),
  splitDetails: z.array(splitDetailSchema).default([]).optional(), // always an array
})
.superRefine((data, ctx) => {
  // If the expense is NOT a split → personalShare = totalAmount
  if (!data.isSplit) {
    data.personalShare = data.totalAmount
    return
  }

  // If the expense IS a split...
  if (data.splitDetails.length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["splitDetails"],
      message:
        "You must provide at least one friend when splitting an expense.",
    })
    return
  }

  // Check math
  const totalOwedByFriends = data.splitDetails.reduce(
    (acc, split) => acc + split.amountOwed,
    0
  )

  if (
    Math.abs(data.personalShare + totalOwedByFriends - data.totalAmount) >=
    0.01
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["totalAmount"],
      message:
        "The sum of your share and amounts owed by friends must equal the total amount.",
    })
  }
})

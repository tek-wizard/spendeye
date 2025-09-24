import { z } from "zod"

const phoneRegex = /^(?:\+91)?[6-9][0-9]{9}$/

export const contactSchema = z.object({
  contactName: z.string().min(1, { message: "Contact name is required" }),
  phoneNumber: z
    .string()
    .regex(phoneRegex, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
  email: z.email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .regex(phoneRegex, { message: "Invalid Indian phone number" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  contacts: z
    .array(contactSchema)
    .optional()
    .default([])
    .refine(
      (contacts) => {
        const names = contacts.map((c) => c.name.toLowerCase().trim())
        return names.length === new Set(names).size
      },
      { message: "Duplicate contact names are not allowed" }
    ),
})

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").regex(/^\S*$/, "Password cannot contain spaces"),
});

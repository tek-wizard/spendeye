import { z } from "zod";

const phoneRegex = /^(?:\+91)?[6-9][0-9]{9}$/;

export const contactSchema = z.object({
  contactName: z.string().min(1, { message: "Contact name is required" }),
  phoneNumber: z
    .string()
    .regex(phoneRegex, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
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
        const names = contacts.map((c) => c.name.toLowerCase().trim());
        return names.length === new Set(names).size;
      },
      { message: "Duplicate contact names are not allowed" }
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").regex(/^\S*$/, "Password cannot contain spaces"),
});

// For the "Change Password" feature (when logged in)
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from the current password.",
  path: ["newPassword"],
});

// For the "Forgot Password" request (user provides email)
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

// For the "Reset Password" action (user provides new password via a token link)
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
});
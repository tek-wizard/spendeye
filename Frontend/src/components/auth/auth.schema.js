import { z } from 'zod';

const phoneRegex = /^(?:\+91)?[6-9][0-9]{9}$/;

// Schema for the Signup form
export const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot be longer than 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(phoneRegex, "Please enter a valid Indian phone number").optional().or(z.literal('')),
  password: z.string().min(6, "Password must be at least 6 characters long").regex(/^\S*$/, "Password cannot contain spaces"),
});

// Schema for the Login form
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").regex(/^\S*$/, "Password cannot contain spaces"),
});

// Schema for add contact form
export const contactSchema = z.object({
  contactName: z.string()
    .min(1, { message: "Contact name is required" })
    .max(30, { message: "Contact name cannot be longer than 30 characters" }),
  phoneNumber: z.string()
    .regex(phoneRegex, { message: "Invalid Indian phone number" })
    .optional()
    .or(z.literal('')),
});

// THE FIX: Schema for the Forgot Password flow
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address to proceed"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
import { z } from "zod";

const contactSchema = z.object({
  name: z.string(),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
  email: z
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  contacts: z.array(contactSchema).optional().default([]),
});

export const loginSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(30, { message: "Username must be at most 30 characters long" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });
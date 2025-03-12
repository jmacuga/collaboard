"use server";
import { z } from "zod";

/**
 * Schema for validating login form data using Zod.
 *
 */
export const schemaLogin = z.object({
  /**
   * Validates the email field.
   * - Must be a string.
   * - Must be a valid email address.
   */
  email: z.string().email({ message: "Invalid email address" }),

  /**
   * Validates the password field.
   * - Must be a string.
   * - Must be at least 6 characters long.
   */
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

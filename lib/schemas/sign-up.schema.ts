"use server";
import { z } from "zod";

/**
 * Schema for validating sign-up form data using Zod.
 *
 */
export const schemaSignUp = z.object({
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

  /**
   * Validates the name field.
   * - Must be a string.
   * - Must be at least 3 characters long.
   */
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),

  /**
   * Validates the surname field.
   * - Must be a string.
   * - Must be at least 3 characters long.
   */
  surname: z
    .string()
    .min(3, { message: "Surname must be at least 3 characters long" }),

  /**
   * Validates the username field.
   * - Must be a string.
   * - Must be at least 3 characters long.
   */
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),

  /**
   * Validates the confirm password field.
   * - Must be a string.
   * - Must be at least 6 characters long.
   */
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters long" }),
});

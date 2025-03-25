"use server";
import { z } from "zod";

/**
 * @file sign-in.schema.ts
 * @description Schema for validating sign-in form data using Zod.
 */
export const schemaSignIn = z.object({
  /**
   * Validates the email field.
   * - Must be a string.
   * - Must be a valid email address.
   */
  email: z.string().email("Invalid email address"),

  /**
   * Validates the password field.
   * - Must be a string.
   * - Must be at least 8 characters long.
   */
  password: z.string().min(8, "Password must be at least 8 characters"),
});

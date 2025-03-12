"use server";
import { z } from "zod";

/**
 * Schema for validating login form data using Zod.
 *
 */
export const schemaTeam = z.object({
  /**
   * Validates the name field.
   * - Must be a string.
   * - Must be at least 3 characters long.
   */
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

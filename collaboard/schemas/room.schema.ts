import { z } from "zod";

/**
 * Schema for validating create room form data using Zod.
 *
 */
export const schemaRoom = z.object({
  /**
   * Validates the name field.
   */
  name: z
    .string({
      message: "Name must be a string",
      required_error: "Name is required",
    })
    .min(1, { message: "Name must be at least 1 character long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

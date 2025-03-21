import { z } from "zod";
import prisma from "@/db/prisma";

/**
 * Schema for validating board form data using Zod.
 */
export const schemaBoard = z.object({
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

// Define the type for the schema's output
type BoardSchema = z.infer<typeof schemaBoard>;

/**
 * Helper function to validate a board name is unique within a team
 * @param name The board name to check
 * @param teamId The team ID to check within
 * @returns A promise that resolves to true if the name is unique, or throws an Error
 */
export async function validateBoardNameUniqueness(
  name: string,
  teamId: string
): Promise<boolean> {
  const existingBoard = await prisma.board.findFirst({
    where: {
      teamId,
      name,
      archived: false,
    },
  });

  if (existingBoard) {
    throw new Error("A board with this name already exists in this team");
  }

  return true;
}

/**
 * Creates a Zod schema that validates a board name is unique within a team
 * @param teamId The team ID to check within
 * @returns A Zod schema that validates the board data including uniqueness
 */
export function createBoardSchemaWithTeamCheck(teamId: string) {
  return schemaBoard.superRefine(async (data, ctx) => {
    if (!teamId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Team ID is required to check name uniqueness",
      });
      return;
    }

    try {
      await validateBoardNameUniqueness(data.name, teamId);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Error checking name uniqueness",
        path: ["name"],
      });
    }
  });
}

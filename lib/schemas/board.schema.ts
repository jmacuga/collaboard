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

export type BoardSchema = z.infer<typeof schemaBoard>;

/**
 * Custom error for board name uniqueness validation
 */
export class BoardNameNotUniqueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BoardNameNotUniqueError";
  }
}

/**
 * Helper function to validate a board name is unique within a team
 * @param name The board name to check
 * @param teamId The team ID to check within
 * @returns A promise that resolves to true if the name is unique
 * @throws BoardNameNotUniqueError when the name is not unique
 */
export async function validateBoardNameUniqueness(
  name: string,
  teamId: string
): Promise<true> {
  const existingBoard = await prisma.board.findFirst({
    where: {
      teamId,
      name,
      archived: false,
    },
  });

  if (existingBoard) {
    throw new BoardNameNotUniqueError(
      "A board with this name already exists in this team"
    );
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
        path: ["name"],
      });
      return;
    }

    try {
      await validateBoardNameUniqueness(data.name, teamId);
    } catch (error) {
      if (error instanceof BoardNameNotUniqueError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error.message,
          path: ["name"],
        });
      } else {
        console.error("Error checking board name uniqueness:", error);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Unable to verify if this board name is available. Please try again.",
          path: ["name"],
        });
      }
    }
  });
}

export type BoardSchemaWithTeamCheck = z.infer<
  ReturnType<typeof createBoardSchemaWithTeamCheck>
>;

"use server";

import { signIn } from "@/lib/auth";
import { IBoard } from "@/models/Board";
import { AuthError } from "next-auth";
import { createBoard, deleteBoard } from "@/lib/data";
import { ISyncService } from "@/services/sync/types";
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log("Sign in:");
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createBoardAction(
  formData: { name: string },
  teamId: string
): Promise<IBoard | null> {
  try {
    const name = formData.name;
    const board = await createBoard({
      teamId,
      name,
    });
    if (!board) {
      console.error("Error: Board creation failed");
      return null;
    }
    return JSON.parse(JSON.stringify(board));
  } catch (error) {
    console.error("Error creating board. Error: ", error);
    return null;
  }
}

export async function deleteBoardAction(boardId: string): Promise<boolean> {
  try {
    const result = await deleteBoard(boardId);
    return result !== null;
  } catch (error) {
    console.error("Error deleting board:", error);
    return false;
  }
}

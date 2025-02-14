"use server";

import { IBoard } from "@/models/Board";
import { createBoard, deleteBoard } from "@/lib/data";
import { signIn } from "next-auth/react";
import { schemaLogin } from "@/schemas/login.schema";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<{ error: string; isLoading: boolean }> {
  try {
    const parsedFormData = schemaLogin.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const result = await signIn("credentials", {
      email: parsedFormData.email,
      password: parsedFormData.password,
      redirect: false,
    });
    if (result?.error) {
      return { error: "Invalid email or password", isLoading: false };
    }
  } catch (error) {
    return { error: "An error occurred. Please try again.", isLoading: false };
  }
  return { error: "", isLoading: false };
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

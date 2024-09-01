"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import User from "./types/User";
import { createRoom } from "./data";
import { getUser } from "./data";

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

export async function createRoomAction(
  formData: { name: string },
  user_email: string
) {
  const user = await getUser(user_email);
  if (user === null) {
    console.error("Error fetching user");
    throw new Error("Error fetching user");
  }
  console.log("User: ", user);
  try {
    const room = await createRoom({
      name: formData.name,
      createdBy: String(user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [String(user.id)],
      canvasId: "canvas1",
    });
    if (room === null) {
      console.error("Error creating room");
      throw new Error("Error creating room");
    }
    return room;
  } catch (error) {
    throw error;
  }
}

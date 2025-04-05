"use server";

import { prisma } from "@/db/prisma";
import { User } from "@prisma/client";

export async function getUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

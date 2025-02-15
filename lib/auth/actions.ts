"use server";

import { signIn } from "next-auth/react";
import { schemaLogin } from "@/styles/schemas/login.schema";

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

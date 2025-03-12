import { signIn } from "next-auth/react";

export async function authenticate(formData: FormData) {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/teams",
    });

    if (result?.error) {
      return {
        error: result.error || "Invalid email or password",
        isLoading: false,
      };
    }

    return { error: "", isLoading: false };
  } catch (error) {
    return { error: "An error occurred. Please try again.", isLoading: false };
  }
}

export async function register(formData: FormData) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
        surname: formData.get("surname"),
        username: formData.get("username"),
        confirmPassword: formData.get("confirmPassword"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "An error occurred", isLoading: false };
    }

    return { error: "", isLoading: false };
  } catch (error) {
    return { error: "An error occurred. Please try again.", isLoading: false };
  }
}

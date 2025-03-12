import { NextApiRequest, NextApiResponse } from "next";
import { schemaLogin } from "@/lib/schemas/login.schema";
import { signIn } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const parsedData = schemaLogin.parse(req.body);

    const result = await signIn("credentials", {
      email: parsedData.email,
      password: parsedData.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again." });
  }
}

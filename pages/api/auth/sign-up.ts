import { NextApiRequest, NextApiResponse } from "next";
import { schemaSignUp } from "@/lib/schemas/sign-up.schema";
import { prisma } from "@/db/prisma";
import { hash } from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const parsedData = schemaSignUp.parse(req.body);

    const emailExists = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (emailExists) {
      return res
        .status(400)
        .json({ error: "Account with this email already exists" });
    }

    if (parsedData.password !== parsedData.confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const usernameExists = await prisma.user.findUnique({
      where: { username: parsedData.username },
    });

    if (usernameExists) {
      return res
        .status(400)
        .json({ error: "Account with this username already exists" });
    }

    const hashedPassword = await hash(parsedData.password, 10);
    await prisma.user.create({
      data: {
        email: parsedData.email,
        passwordHash: hashedPassword,
        name: parsedData.name,
        surname: parsedData.surname,
        username: parsedData.username,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again." });
  }
}

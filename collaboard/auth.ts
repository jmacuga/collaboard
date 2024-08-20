import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser } from "./app/lib/data";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Authorizing");
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          console.log("Bcrypt compare:");

          const hashedPass = await bcrypt.hash(password, 10);
          const passwordsMatch = await bcrypt.compare(password, hashedPass);
          console.log("Return user/ null");

          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});

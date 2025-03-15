import { z } from "zod";

export const schemaTeamInvitation = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

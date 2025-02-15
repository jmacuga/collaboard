import "next-auth";
import { IUser } from "@/providers/db/models/User";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User extends IUser {}
}

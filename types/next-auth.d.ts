import "next-auth";
import { IUser } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User extends IUser {}
}

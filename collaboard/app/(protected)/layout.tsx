import { auth } from "@/auth";
import { useSession, SessionProvider } from "next-auth/react";

export default async function RoomLayout({ children }) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

import { auth } from "@/auth";
import { useSession, SessionProvider } from "next-auth/react";

export default async function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

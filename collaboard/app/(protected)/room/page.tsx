"use client";
import { useSession, SessionProvider } from "next-auth/react";

import CreateRoomButton from "@/components/room/create-room-button";

export default function CreateRoomPage() {
  const session = useSession();
  return <CreateRoomButton />;
}

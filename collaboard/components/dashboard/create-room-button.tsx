"use client";
import { createRoom } from "@/lib/data";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/data";
import { useSession, SessionProvider } from "next-auth/react";

export default function CreateRoomButton({ children }) {
  const router = useRouter();
  const session = useSession();
  console.log("Session: ", session);

  const onClick = async () => {
    console.log("Creating room...");
    if (!session.data?.user) {
      console.log("No user found");
      return;
    }

    const user = await getUser(session.data?.user?.email ?? "");
    if (user === null) {
      console.log("Error fetching user");
      return;
    }

    const room = await createRoom({
      name: "room1",
      createdBy: String(user.id) ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [session.data?.user?.id ?? ""],
      canvasId: "canvas1",
    });
    if (room === null) {
      console.log("Error creating room");
      return <div>Error creating room</div>;
    }
    router.push(`/room/${room._id}`);
  };

  return <button onClick={onClick}>{children}</button>;
}

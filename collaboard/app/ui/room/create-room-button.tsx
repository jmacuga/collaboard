"use client";
import { createRoom } from "@/app/lib/data";
import { useRouter } from "next/navigation";

export default function CreateRoomButton() {
  const router = useRouter();

  const onClick = async () => {
    console.log("Creating room...");
    const room = await createRoom({
      name: "room1",
      createdBy: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
      canvasId: "canvas1",
    });
    console.log("Room created: ", room);
    console.log("Room id: ", room._id);

    router.push(`/room/${room._id}`);
  };

  return <button onClick={onClick}>Create Room</button>;
}

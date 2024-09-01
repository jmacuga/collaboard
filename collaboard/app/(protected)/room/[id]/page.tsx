"use client";
import Room from "@/components/room/room";

export default function RoomPage({ params }: { params: { id: string } }) {
  console.log("Room id: ", params.id);
  return <Room id={params.id} />;
}

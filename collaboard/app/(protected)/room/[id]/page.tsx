import { getCanvasById, getRoomById } from "@/lib/data";
import Room from "@/components/room/room";

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  if (room === null) {
    return <div>Room not found</div>;
  }
  const fabricCanvas = await getCanvasById(room?.canvasId);
  if (fabricCanvas === null) {
    return <div>Canvas not found</div>;
  }

  return <Room id={params.id} fabricCanvas={fabricCanvas} />;
}

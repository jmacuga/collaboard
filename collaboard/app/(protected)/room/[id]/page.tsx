import { getStageById, getRoomById } from "@/lib/data";
import Room from "@/components/room/room";
import { SocketContextProvider } from "@/lib/context/socketContext";
import { RoomContextProvider } from "@/lib/context/roomContext";

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  if (room === null) {
    return <div>Room not found</div>;
  }
  const stage = await getStageById(room?.stageId);
  if (stage === null) {
    return <div>Canvas stage not found</div>;
  }

  return (
    <RoomContextProvider>
      <SocketContextProvider>
        <Room roomId={params.id} />
      </SocketContextProvider>
    </RoomContextProvider>
  );
}

import { fetchUserRooms } from "@/lib/data";
import CreateRoomButton from "./create-room-button";
import Link from "next/link";

export default async function RoomCards({ userId }: { userId: string }) {
  const userRooms = await fetchUserRooms(userId);
  return (
    <div>
      <h1 className="text-3xl text-burnt-sienna font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 text-oxford-blue md:grid-cols-2s lg:grid-cols-3 gap-6">
        {userRooms ? (
          userRooms.map((room) => (
            <Link
              href={`/room/${room._id}`}
              className="p-4 rounded-lg shadow-md hover:bg-gray-100"
              key={room._id as string}
            >
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="">{room._id as string}</p>
            </Link>
          ))
        ) : (
          <div>No rooms found</div>
        )}
        <CreateRoomButton>
          <div className="p-4 bg-burnt-sienna rounded-lg shadow-md hover:bg-burnt-sienna-darker">
            <h2 className="text-xl text-white font-semibold mb-2">
              Create Room
            </h2>
          </div>
        </CreateRoomButton>
      </div>
    </div>
  );
}

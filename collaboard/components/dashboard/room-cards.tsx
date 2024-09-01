import { fetchUserRooms } from "@/lib/data";
import CreateRoomButton from "./create-room-button";

export default async function RoomCards() {
  const userRooms = await fetchUserRooms();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2s lg:grid-cols-3 gap-6">
        {userRooms ? (
          userRooms.map((room) => (
            <div className="p-4 bg-white rounded-lg shadow-md" key={room.id}>
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600">description</p>
            </div>
          ))
        ) : (
          <div>No rooms found</div>
        )}
        <CreateRoomButton>
          <div className="p-4 bg-blue-400 rounded-lg shadow-md">
            <h2 className="text-xl text-white font-semibold mb-2">
              Create Room
            </h2>
          </div>
        </CreateRoomButton>
      </div>
    </div>
  );
}

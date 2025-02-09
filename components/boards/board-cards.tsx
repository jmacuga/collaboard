import CreateTeamButton from "./create-team-button";
import { Board, IBoard } from "@/models/Board";
import Link from "next/link";

export default async function RoomCards({
  teamBoards,
}: {
  teamBoards: IBoard[] | null;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 text-oxford-blue md:grid-cols-2s lg:grid-cols-3 gap-6">
        {teamBoards ? (
          teamBoards.map((board) => (
            <Link
              href={`/board/${board._id}`}
              className="p-4 rounded-lg shadow-md hover:bg-gray-100"
              key={board._id as string}
            >
              <h2 className="text-xl font-semibold mb-2">{board.name}</h2>
              <p className="">{board._id as string}</p>
            </Link>
          ))
        ) : (
          <div>No boards found</div>
        )}
        <CreateTeamButton>
          <div className="p-4 bg-burnt-sienna rounded-lg shadow-md hover:bg-burnt-sienna-darker">
            <h2 className="text-xl text-white font-semibold mb-2">
              Create Board
            </h2>
          </div>
        </CreateTeamButton>
      </div>
    </div>
  );
}

"use server";
import { getTeamBoards } from "@/lib/data";
import { getTeam } from "@/lib/data";
import BoardCards from "@/components/boards/board-cards";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";

export default async function TeamBoardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const teamBoards = await getTeamBoards(teamId);
  const team = await getTeam(teamId);
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        {team && (
          <h1 className="text-3xl font-bold text-burnt-sienna">
            {team.name} Boards
          </h1>
        )}
        <CreateBoardDialog teamId={teamId} />
      </div>
      <BoardCards teamBoards={teamBoards} />
    </div>
  );
}

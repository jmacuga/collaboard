"use server";
import BoardCards from "@/components/boards/board-cards";
import { getTeamBoards } from "@/lib/data";
import { getTeam } from "@/lib/data";

export default async function TeamBoardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const teamBoards = await getTeamBoards(teamId);
  const team = await getTeam(teamId);

  return (
    <div>
      {team && (
        <h1 className="text-3xl text-burnt-sienna font-bold mb-4">
          Team {team?.name} Boards
        </h1>
      )}
      <BoardCards teamBoards={JSON.parse(JSON.stringify(teamBoards))} />
    </div>
  );
}

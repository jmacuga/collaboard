"use server";
import BoardCards from "@/components/boards/board-cards";
import { getTeamBoards } from "@/lib/data";

export default async function teamBoards({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const teamBoards = await getTeamBoards(teamId);

  return (
    <div>
      <h1 className="text-3xl text-burnt-sienna font-bold mb-4">
        Team id: {teamId} Boards
      </h1>
      <BoardCards teamBoards={JSON.parse(JSON.stringify(teamBoards))} />
    </div>
  );
}

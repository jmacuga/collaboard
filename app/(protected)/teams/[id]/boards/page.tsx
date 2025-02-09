"use server";
import { getTeamBoards } from "@/lib/data";
import { getTeam } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TeamBoardsCards from "@/components/boards/board-cards";

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
        <Button className="bg-burnt-sienna hover:bg-burnt-sienna-darker">
          <Plus className="mr-2 h-4 w-4" />
          Create Board
        </Button>
      </div>
      <TeamBoardsCards teamBoards={teamBoards} />
    </div>
  );
}

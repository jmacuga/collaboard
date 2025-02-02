"use server";
import BoardCards from "@/components/teamBoards/board-cards";
import { getTeamBoards } from "@/lib/data";

export default async function teamBoards({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const teamBoards = await getTeamBoards(teamId);
  console.log("Team Boards", JSON.parse(JSON.stringify(teamBoards)));

  return (
    <main>
      <BoardCards teamBoards={JSON.parse(JSON.stringify(teamBoards))} />
    </main>
  );
}

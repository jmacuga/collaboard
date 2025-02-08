import { getBoardById } from "@/lib/data";
import { BoardWrapper } from "@/components/board/board-wrapper";

export default async function boardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: boardId } = await params;
  const board = await getBoardById(boardId);

  if (!board || !board.docUrl) {
    console.error("Board or docUrl not found");
    return <div>Board not found</div>;
  }

  const docUrl = board.docUrl.toString();

  return <BoardWrapper docUrl={docUrl} />;
}

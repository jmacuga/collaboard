import { getBoardById } from "@/lib/data";
import { BoardPage } from "@/components/board/board-page";

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

  return <BoardPage docUrl={docUrl} />;
}

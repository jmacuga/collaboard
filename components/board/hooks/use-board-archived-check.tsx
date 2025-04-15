import { Board } from "@prisma/client";
import { useRouter } from "next/router";

export const useBoardArchivedCheck = () => {
  const router = useRouter();
  const getBoardId = (): string => {
    const boardId = router.query.id;
    if (!boardId || Array.isArray(boardId)) {
      throw new Error("Invalid board ID");
    }
    return boardId;
  };

  const fetchBoard = async (): Promise<Board | null> => {
    try {
      const boardId = getBoardId();
      const response = await fetch(`/api/boards/${boardId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch board:", error);
      return null;
    }
  };

  const isBoardArchived = async (): Promise<boolean | null> => {
    const board = await fetchBoard();
    if (!board) {
      return null;
    }
    return board.archived;
  };

  return { isBoardArchived };
};

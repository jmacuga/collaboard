import { Board } from "@prisma/client";

export interface IBoardService {
  create(data: { name: string; teamId: string }): Promise<Board>;
  delete(boardId: string): Promise<boolean>;
}

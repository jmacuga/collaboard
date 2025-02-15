import { IBoard } from "@/providers/db/models/Board";

export interface IBoardService {
  create(data: { name: string; teamId: string }): Promise<IBoard>;
  delete(boardId: string): Promise<boolean>;
}

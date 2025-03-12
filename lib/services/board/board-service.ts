"use server";
import { IBoardService } from "./types";
import dbConnect from "@/db/dbConnect";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { createAutomergeServer } from "@/lib/automerge-server";
import { createBoard, deleteBoard, getBoardById } from "@/db/data";
import { Board } from "@prisma/client";
export class BoardService implements IBoardService {
  constructor() {}

  async create(data: { name: string; teamId: string }): Promise<Board | null> {
    try {
      await dbConnect();
      const serverRepo = await createAutomergeServer(null, "server");
      const handle = serverRepo.create<LayerSchema>();
      const docUrl = handle.url;
      const board = await createBoard({
        name: data.name,
        teamId: data.teamId,
        docUrl: docUrl,
      });
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(boardId: string): Promise<boolean> {
    try {
      await dbConnect();
      const board = await deleteBoard(boardId);
      return !!board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getTeamIdByBoardId(boardId: string): Promise<string | null> {
    try {
      await dbConnect();
      const board = await getBoardById(boardId);
      return board?.teamId || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

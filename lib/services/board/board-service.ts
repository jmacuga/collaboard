"use server";
import { IBoard, Board } from "@/db/models/Board";
import { IBoardService } from "./types";
import dbConnect from "@/db/dbConnect";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { createAutomergeServer } from "@/lib/automerge-server";

export class BoardService implements IBoardService {
  constructor() {}

  async create(data: { name: string; teamId: string }): Promise<IBoard> {
    try {
      await dbConnect();
      const serverRepo = await createAutomergeServer(null, "server");
      const handle = serverRepo.create<LayerSchema>();
      const docUrl = handle.url;
      const board = await Board.create({
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
      const board = await Board.findByIdAndDelete(boardId);
      return !!board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDocUrl(boardId: string): Promise<string> {
    await dbConnect();
    const board = await Board.findById(boardId);
    return board?.docUrl || "";
  }
}

"use server";
import { IBoard, Board } from "@/models/Board";
import { IBoardService } from "./types";
import dbConnect from "@/lib/dbConnect";
import { AutomergeService } from "@/services/automerge";

export class BoardService implements IBoardService {
  async create(data: { name: string; teamId: string }): Promise<IBoard> {
    try {
      await dbConnect();
      const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
      if (!websocketUrl) {
        throw new Error("WebSocket URL is not defined");
      }
      const automergeService = new AutomergeService(websocketUrl);
      const docUrl = automergeService.createServerDoc();
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

  delete(boardId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

"use server";
import { IBoard, Board } from "@/models/Board";
import { IBoardService } from "./types";
import dbConnect from "@/lib/dbConnect";
import { AutomergeService } from "@/services/automerge";
import { Model } from "mongoose";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { SyncService } from "../sync/syc-service";

export class BoardService implements IBoardService {
  private readonly boardModel: Model<IBoard>;
  private readonly automergeService: AutomergeService<KonvaNodeSchema>;
  constructor() {
    const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
    this.boardModel = Board;
    this.automergeService = new AutomergeService(websocketUrl);
  }

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
}

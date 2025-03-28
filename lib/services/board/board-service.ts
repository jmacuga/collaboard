"use server";
import dbConnect from "@/db/dbConnect";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Board } from "@prisma/client";
import prisma from "@/db/prisma";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";
import { AnyDocumentId, Repo } from "@automerge/automerge-repo";

export class BoardServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BoardServiceError";
  }
}

export class BoardNotFoundError extends BoardServiceError {
  constructor(boardId: string) {
    super(`Board with ID ${boardId} not found`);
    this.name = "BoardNotFoundError";
  }
}

export class BoardService {
  constructor() {}

  static async create(data: {
    name: string;
    teamId: string;
  }): Promise<Board | null> {
    try {
      await dbConnect();
      const mongoAdapter = new MongoDBStorageAdapter(
        process.env.MONGODB_URI || "",
        {
          dbName: process.env.MONGODB_DB_NAME,
          collectionName: process.env.DOCS_COLLECTION_NAME,
          keyStorageStrategy: "array",
        }
      );
      const serverRepo = new Repo({ storage: mongoAdapter, network: [] });
      const handle = serverRepo.create<LayerSchema>();
      const docUrl = handle.url;
      const board = await prisma.board.create({
        data: {
          name: data.name,
          teamId: data.teamId,
          docUrl: docUrl,
          isMergeRequestRequired: false,
        },
      });
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async archive(boardId: string): Promise<void> {
    let board: Board | null = null;

    board = await prisma.board.findUnique({
      where: { id: boardId, archived: false },
    });

    if (!board) {
      throw new BoardNotFoundError(boardId);
    }

    const url = board.docUrl;
    const mongoAdapter = new MongoDBStorageAdapter(
      process.env.MONGODB_URI || "",
      {
        dbName: "collaboard",
        collectionName: "docs",
        keyStorageStrategy: "array",
      }
    );
    const serverRepo = new Repo({
      storage: mongoAdapter,
    });
    serverRepo.delete(url as AnyDocumentId);
    await prisma.board.update({
      where: { id: boardId },
      data: { archived: true },
    });

    return;
  }

  static async getTeamIdByBoardId(boardId: string): Promise<string | null> {
    const board = await prisma.board.findUnique({
      where: { id: boardId, archived: false },
      select: { teamId: true },
    });
    return board?.teamId || null;
  }

  static async getBoardById(
    boardId: string,
    includeArchived: boolean = false
  ): Promise<Board | null> {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ...(includeArchived ? {} : { archived: false }),
      },
    });
    return board || null;
  }

  static async getBoardDocUrl(
    boardId: string,
    includeArchived: boolean = false
  ): Promise<string | null> {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ...(includeArchived ? {} : { archived: false }),
      },
    });
    return board?.docUrl || null;
  }
}

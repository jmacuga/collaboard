"use server";
import dbConnect from "@/db/dbConnect";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Board, MergeRequest } from "@prisma/client";
import prisma from "@/db/prisma";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { getOrCreateRepo } from "@/lib/automerge-server";
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
      const serverRepo = await getOrCreateRepo();
      if (!serverRepo) {
        throw new Error("Server repo not found");
      }
      const handle = serverRepo.create<LayerSchema>();
      const board = await prisma.board.create({
        data: {
          name: data.name,
          teamId: data.teamId,
          automergeDocId: handle.documentId,
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
    const serverRepo = await getOrCreateRepo();
    if (!serverRepo) {
      throw new Error("Server repo not found");
    }
    serverRepo.delete(board.automergeDocId as AnyDocumentId);
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

  static async getBoardDocId(
    boardId: string,
    includeArchived: boolean = false
  ): Promise<string | null> {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ...(includeArchived ? {} : { archived: false }),
      },
    });
    return board?.automergeDocId || null;
  }

  static async getMergeRequests(boardId: string): Promise<MergeRequest[]> {
    const mergeRequests = await prisma.mergeRequest.findMany({
      where: { boardId },
      include: {
        requester: true,
        reviewRequests: {
          include: {
            reviewer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return mergeRequests;
  }
}

"use server";
import dbConnect from "@/db/dbConnect";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Board, BoardAction, MergeRequest, Prisma } from "@prisma/client";
import prisma from "@/db/prisma";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { getOrCreateRepo } from "@/lib/automerge-server";
import { Doc } from "@/db/models/Doc";
import { CodeSquare } from "lucide-react";
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
export type PrismaTransactionalClient = Prisma.TransactionClient;

export class BoardService {
  constructor() {}

  static async create(data: {
    name: string;
    teamId: string;
    userId: string;
  }): Promise<Board | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        await dbConnect();
        const serverRepo = await getOrCreateRepo();
        if (!serverRepo) {
          throw new Error("Server repo not found");
        }
        const handle = serverRepo.create<LayerSchema>();
        const board = await tx.board.create({
          data: {
            name: data.name,
            teamId: data.teamId,
            automergeDocId: handle.documentId,
            isMergeRequestRequired: false,
          },
        });
        await tx.boardLog.create({
          data: {
            boardId: board.id,
            action: BoardAction.CREATED,
            userId: data.userId,
          },
        });
        return board;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private static async deleteReviewRequests(
    boardId: string,
    tx: PrismaTransactionalClient
  ): Promise<void> {
    await tx.mergeRequest.deleteMany({
      where: { boardId },
    });
  }

  private static async deleteMergeRequests(
    boardId: string,
    tx: PrismaTransactionalClient
  ): Promise<void> {
    await tx.mergeRequest.deleteMany({
      where: { boardId },
    });
  }

  static async archive(boardId: string, userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      let board: Board | null = null;
      board = await tx.board.findUnique({
        where: { id: boardId, archived: false },
      });
      if (!board) {
        throw new BoardNotFoundError(boardId);
      }
      const serverRepo = await getOrCreateRepo();
      if (!serverRepo) {
        throw new Error("Server repo not found");
      }
      await this.deleteReviewRequests(boardId, tx);
      await this.deleteMergeRequests(boardId, tx);
      serverRepo.delete(board.automergeDocId as AnyDocumentId);
      await tx.board.update({
        where: { id: boardId },
        data: { archived: true },
      });

      await tx.boardLog.create({
        data: {
          boardId: boardId,
          action: BoardAction.DELETED,
          userId: userId,
        },
      });
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

  static async getBoardById(boardId: string): Promise<Board | null> {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
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

  static async getBoardLastUpdated(boardId: string): Promise<Date | null> {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: {
        automergeDocId: true,
      },
    });
    if (!board) {
      throw new BoardNotFoundError(boardId);
    }
    const lastUpdated = await this.getDocLastUpdated(
      board.automergeDocId as string
    );
    if (!lastUpdated) {
      return null;
    }
    return lastUpdated;
  }

  private static async getDocLastUpdated(
    docId: string
  ): Promise<Date | undefined> {
    await dbConnect();

    try {
      const doc = await Doc.findOne({ "key.0": docId })
        .sort({ updatedAt: -1 })
        .select("updatedAt");

      return doc?.updatedAt;
    } catch (error) {
      console.error("Error getting document last updated:", error);
      return undefined;
    }
  }
}

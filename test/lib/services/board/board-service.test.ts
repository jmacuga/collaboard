import {
  BoardService,
  BoardNotFoundError,
} from "@/lib/services/board/board-service";
import { getOrCreateRepo } from "@/lib/automerge-server";
import dbConnect from "@/db/dbConnect";
import { TeamAction, MergeRequestStatus } from "@prisma/client";
import type { PrismaTransactionalClient } from "@/lib/services/board/board-service";
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    board: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    mergeRequest: {
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
    teamLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/automerge-server", () => ({
  getOrCreateRepo: jest.fn(),
}));

jest.mock("@/db/dbConnect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/db/models/Doc", () => ({
  findOne: jest.fn(() => ({
    sort: jest.fn(() => ({
      select: jest.fn(() => ({
        updatedAt: new Date("2023-01-01"),
      })),
    })),
  })),
}));

describe("BoardService", () => {
  const mockUserId = "user-1";
  const mockTeamId = "team-1";
  const mockBoardId = "board-1";
  const mockDocId = "doc-1";
  const mockBoard = {
    id: mockBoardId,
    name: "Test Board",
    teamId: mockTeamId,
    automergeDocId: mockDocId,
    archived: false,
    isMergeRequestRequired: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockServerRepo = {
    create: jest.fn(() => ({ documentId: mockDocId })),
    delete: jest.fn(),
  };

  const mockTransactionClient = {
    board: {
      create: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
    },
    teamLog: {
      create: jest.fn() as jest.Mock,
    },
    mergeRequest: {
      deleteMany: jest.fn() as jest.Mock,
    },
  } as unknown as PrismaTransactionalClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (getOrCreateRepo as jest.Mock).mockResolvedValue(mockServerRepo);
    jest
      .spyOn(prisma, "$transaction")
      .mockImplementation(
        async (callback: (tx: PrismaTransactionalClient) => Promise<any>) => {
          return callback(mockTransactionClient);
        }
      );
  });

  describe("create", () => {
    it("should create a new board successfully", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.board, "create")
        .mockResolvedValue(mockBoard);

      // Execute
      const result = await BoardService.create({
        name: "Test Board",
        teamId: mockTeamId,
        userId: mockUserId,
      });

      // Assert
      expect(dbConnect).toHaveBeenCalled();
      expect(getOrCreateRepo).toHaveBeenCalled();
      expect(mockServerRepo.create).toHaveBeenCalled();
      expect(mockTransactionClient.board.create).toHaveBeenCalledWith({
        data: {
          name: "Test Board",
          teamId: mockTeamId,
          automergeDocId: mockDocId,
          isMergeRequestRequired: false,
        },
      });
      expect(mockTransactionClient.teamLog.create).toHaveBeenCalledWith({
        data: {
          teamId: mockTeamId,
          action: TeamAction.BOARD_CREATED,
          userId: mockUserId,
          message: `Board ${mockBoard.name} created`,
        },
      });
      expect(result).toEqual(mockBoard);
    });

    it("should throw an error if server repo is not found", async () => {
      // Setup
      (getOrCreateRepo as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(
        BoardService.create({
          name: "Test Board",
          teamId: mockTeamId,
          userId: mockUserId,
        })
      ).rejects.toThrow("Server repo not found");
    });

    it("should propagate database errors", async () => {
      // Setup
      const dbError = new Error("Database error");
      jest
        .spyOn(mockTransactionClient.board, "create")
        .mockRejectedValue(dbError);

      // Execute & Assert
      await expect(
        BoardService.create({
          name: "Test Board",
          teamId: mockTeamId,
          userId: mockUserId,
        })
      ).rejects.toThrow(dbError);
    });
  });

  describe("archive", () => {
    it("should archive a board successfully", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.board, "findUnique")
        .mockResolvedValue(mockBoard);

      // Execute
      await BoardService.archive(mockBoardId, mockUserId);

      // Assert
      expect(mockTransactionClient.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId, archived: false },
      });
      expect(
        mockTransactionClient.mergeRequest.deleteMany
      ).toHaveBeenCalledTimes(2);
      expect(mockServerRepo.delete).toHaveBeenCalledWith(mockDocId);
      expect(mockTransactionClient.board.update).toHaveBeenCalledWith({
        where: { id: mockBoardId },
        data: { archived: true },
      });
      expect(mockTransactionClient.teamLog.create).toHaveBeenCalledWith({
        data: {
          teamId: mockTeamId,
          action: TeamAction.BOARD_DELETED,
          userId: mockUserId,
          message: `Board ${mockBoard.name} deleted`,
        },
      });
    });

    it("should throw BoardNotFoundError if board does not exist", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.board, "findUnique")
        .mockResolvedValue(null);

      // Execute & Assert
      await expect(
        BoardService.archive(mockBoardId, mockUserId)
      ).rejects.toThrow(BoardNotFoundError);
      expect(mockTransactionClient.board.update).not.toHaveBeenCalled();
    });

    it("should throw error if server repo is not found", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.board, "findUnique")
        .mockResolvedValue(mockBoard);
      (getOrCreateRepo as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(
        BoardService.archive(mockBoardId, mockUserId)
      ).rejects.toThrow("Server repo not found");
    });
  });

  describe("getTeamIdByBoardId", () => {
    it("should return teamId when board exists", async () => {
      // Setup
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue({
        id: "board-1",
        name: "Test Board",
        teamId: mockTeamId,
        isMergeRequestRequired: false,
        automergeDocId: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Execute
      const result = await BoardService.getTeamIdByBoardId(mockBoardId);

      // Assert
      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId, archived: false },
        select: { teamId: true },
      });
      expect(result).toBe(mockTeamId);
    });

    it("should return null when board does not exist", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(null);

      const result = await BoardService.getTeamIdByBoardId(mockBoardId);

      expect(result).toBeNull();
    });
  });

  describe("getBoardById", () => {
    it("should return board when it exists", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(mockBoard);

      const result = await BoardService.getBoardById(mockBoardId);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId },
      });
      expect(result).toEqual(mockBoard);
    });

    it("should return null when board does not exist", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(null);

      const result = await BoardService.getBoardById(mockBoardId);

      expect(result).toBeNull();
    });
  });

  describe("getBoardDocId", () => {
    it("should return docId when board exists and is not archived", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(mockBoard);

      const result = await BoardService.getBoardDocId(mockBoardId);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId, archived: false },
      });
      expect(result).toBe(mockDocId);
    });

    it("should include archived boards when includeArchived is true", async () => {
      const archivedBoard = { ...mockBoard, archived: true };
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(archivedBoard);

      const result = await BoardService.getBoardDocId(mockBoardId, true);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId },
      });
      expect(result).toBe(mockDocId);
    });

    it("should return null when board does not exist", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(null);

      const result = await BoardService.getBoardDocId(mockBoardId);

      expect(result).toBeNull();
    });
  });

  describe("getMergeRequests", () => {
    const mockMergeRequests = [
      {
        id: "mr-1",
        boardId: mockBoardId,
        requesterId: "user-1",
        changesId: null,
        status: MergeRequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        requester: { id: "user-1", name: "User 1" },
        reviewRequests: [],
      },
    ];

    it("should return merge requests for a board", async () => {
      jest
        .spyOn(prisma.mergeRequest, "findMany")
        .mockResolvedValue(mockMergeRequests);

      const result = await BoardService.getMergeRequests(mockBoardId);

      expect(prisma.mergeRequest.findMany).toHaveBeenCalledWith({
        where: { boardId: mockBoardId },
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
      expect(result).toEqual(mockMergeRequests);
    });
  });

  describe("getBoardLastUpdated", () => {
    it("should throw BoardNotFoundError when board does not exist", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(null);

      await expect(
        BoardService.getBoardLastUpdated(mockBoardId)
      ).rejects.toThrow(BoardNotFoundError);
    });

    it("should return null when doc is not found", async () => {
      jest.spyOn(prisma.board, "findUnique").mockResolvedValue(mockBoard);

      const result = await BoardService.getBoardLastUpdated(mockBoardId);

      expect(result).toBeNull();
    });
  });
});

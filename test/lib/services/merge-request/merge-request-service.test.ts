import {
  MergeRequestService,
  MergeRequestError,
  ReviewRequestError,
  ValidationError,
} from "@/lib/services/merge-request/merge-request-service";
import { getOrCreateRepo } from "@/lib/automerge-server";
import dbConnect from "@/db/dbConnect";
import { Change } from "@/db/models/Change";
import { MergeRequestStatus, ReviewRequestStatus } from "@prisma/client";
import type { PrismaTransactionalClient } from "@/lib/services/merge-request/merge-request-service";
import prisma from "@/db/prisma";
import * as Automerge from "@automerge/automerge";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    mergeRequest: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      findById: jest.fn(),
    },
    reviewRequest: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      findById: jest.fn(),
    },
    board: {
      findUnique: jest.fn(),
      findById: jest.fn(),
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

jest.mock("@/db/models/Change", () => {
  // Mock the mongoose Change model
  const mockChangeData = {
    _id: "change-1",
    data: new Array(Buffer.from("test")),
  };
  return {
    Change: {
      create: jest.fn().mockResolvedValue(mockChangeData),
      findById: jest.fn().mockResolvedValue(mockChangeData),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    },
  };
});

jest.mock("@automerge/automerge", () => ({
  applyChanges: jest.fn(() => [{}, []]),
}));

describe("MergeRequestService", () => {
  const mockUserId = "user-1";
  const mockReviewerId = "reviewer-1";
  const mockBoardId = "board-1";
  const mockMergeRequestId = "mr-1";
  const mockChangeId = "change-1";
  const mockDocId = "doc-1";

  const mockBuffer = Buffer.from("test");
  const mockChanges = [mockBuffer];
  const mockUint8Array = new Uint8Array(mockBuffer);

  const mockBoard = {
    id: mockBoardId,
    name: "Test Board",
    teamId: "team-1",
    automergeDocId: mockDocId,
    archived: false,
    isMergeRequestRequired: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    team: {
      members: [
        {
          userId: mockReviewerId,
          role: {
            name: "Admin",
          },
        },
      ],
    },
  };

  const mockMergeRequest = {
    id: mockMergeRequestId,
    requesterId: mockUserId,
    boardId: mockBoardId,
    status: MergeRequestStatus.OPEN,
    changesId: mockChangeId,
    createdAt: new Date(),
    updatedAt: new Date(),
    requester: {
      id: mockUserId,
      name: "Test User",
    },
    reviewRequests: [
      {
        id: "rr-1",
        mergeRequestId: mockMergeRequestId,
        reviewerId: mockReviewerId,
        boardId: mockBoardId,
        status: ReviewRequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewer: {
          id: mockReviewerId,
          name: "Test Reviewer",
        },
      },
    ],
  };

  const mockReviewRequest = {
    id: "rr-1",
    mergeRequestId: mockMergeRequestId,
    reviewerId: mockReviewerId,
    boardId: mockBoardId,
    status: ReviewRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChange = {
    _id: mockChangeId,
    data: mockChanges,
  };

  const mockServerRepo = {
    find: jest.fn(() => ({
      update: jest.fn((callback) => callback({})),
    })),
  };

  const mockTransactionClient = {
    mergeRequest: {
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      findMany: jest.fn() as jest.Mock,
      updateMany: jest.fn() as jest.Mock,
    },
    reviewRequest: {
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      findMany: jest.fn() as jest.Mock,
      updateMany: jest.fn() as jest.Mock,
    },
    board: {
      findUnique: jest.fn() as jest.Mock,
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

  describe("createMergeRequest", () => {
    it("should create a merge request successfully", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.mergeRequest, "create")
        .mockResolvedValue(mockMergeRequest);
      jest
        .spyOn(mockTransactionClient.board, "findUnique")
        .mockResolvedValue(mockBoard);
      jest
        .spyOn(mockTransactionClient.reviewRequest, "create")
        .mockResolvedValue(mockReviewRequest);

      // Execute
      const result = await MergeRequestService.createMergeRequest(
        mockUserId,
        mockBoardId,
        mockChanges
      );

      // Assert
      expect(dbConnect).toHaveBeenCalled();
      expect(Change.create).toHaveBeenCalledWith({ data: mockChanges });
      expect(mockTransactionClient.mergeRequest.create).toHaveBeenCalledWith({
        data: {
          requesterId: mockUserId,
          boardId: mockBoardId,
          status: MergeRequestStatus.OPEN,
          changesId: mockChangeId,
        },
      });
      expect(mockTransactionClient.board.findUnique).toHaveBeenCalledWith({
        where: { id: mockBoardId },
        include: {
          team: {
            include: {
              members: {
                include: {
                  role: true,
                },
                where: {
                  role: {
                    name: "Admin",
                  },
                },
              },
            },
          },
        },
      });
      expect(mockTransactionClient.reviewRequest.create).toHaveBeenCalledWith({
        data: {
          mergeRequestId: mockMergeRequestId,
          reviewerId: mockReviewerId,
          boardId: mockBoardId,
          status: ReviewRequestStatus.PENDING,
        },
      });
      expect(result).toEqual(mockMergeRequest);
    });

    it("should throw error when no admin is found", async () => {
      // Setup
      jest
        .spyOn(mockTransactionClient.mergeRequest, "create")
        .mockResolvedValue(mockMergeRequest);

      // Board without admin members
      jest.spyOn(mockTransactionClient.board, "findUnique").mockResolvedValue({
        id: mockBoardId,
        name: "Test Board",
        teamId: "team-1",
        automergeDocId: mockDocId,
        archived: false,
        isMergeRequestRequired: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: {
          members: [],
        } as any,
      });

      // Execute & Assert
      await expect(
        MergeRequestService.createMergeRequest(
          mockUserId,
          mockBoardId,
          mockChanges
        )
      ).rejects.toThrow(MergeRequestError);
    });
  });

  describe("getMergeRequestById", () => {
    it("should return merge request with changes", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);

      const result = await MergeRequestService.getMergeRequestById(
        mockMergeRequestId
      );

      expect(prisma.mergeRequest.findUnique).toHaveBeenCalledWith({
        where: { id: mockMergeRequestId },
        include: {
          requester: true,
          reviewRequests: {
            include: {
              reviewer: true,
            },
          },
        },
      });
      expect(Change.findById).toHaveBeenCalledWith(mockChangeId);
      expect(result).toEqual({
        mergeRequest: mockMergeRequest,
        changes: [mockUint8Array],
      });
    });

    it("should return null when merge request is not found", async () => {
      // Setup
      jest.spyOn(prisma.mergeRequest, "findUnique").mockResolvedValue(null);

      // Execute
      const result = await MergeRequestService.getMergeRequestById(
        mockMergeRequestId
      );

      // Assert
      expect(result).toBeNull();
    });

    it("should return null when changes are not found", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);
      // Override global mock for this test only
      jest.spyOn(Change, "findById").mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue({ data: [] }),
          } as any)
      );

      // Execute
      const result = await MergeRequestService.getMergeRequestById(
        mockMergeRequestId
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("getOpenMergeRequest", () => {
    it("should return open merge request", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);

      // Execute
      const result = await MergeRequestService.getOpenMergeRequest(
        mockMergeRequestId
      );

      // Assert
      expect(prisma.mergeRequest.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockMergeRequestId,
          status: MergeRequestStatus.OPEN,
        },
      });
      expect(result).toEqual(mockMergeRequest);
    });

    it("should return null when merge request is not found", async () => {
      // Setup
      jest.spyOn(prisma.mergeRequest, "findUnique").mockResolvedValue(null);

      // Execute
      const result = await MergeRequestService.getOpenMergeRequest(
        mockMergeRequestId
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("isUserReviewer", () => {
    it("should return true when user is a reviewer", async () => {
      // Setup
      jest
        .spyOn(prisma.reviewRequest, "findFirst")
        .mockResolvedValue(mockReviewRequest);

      // Execute
      const result = await MergeRequestService.isUserReviewer(
        mockReviewerId,
        mockMergeRequestId
      );

      // Assert
      expect(prisma.reviewRequest.findFirst).toHaveBeenCalledWith({
        where: {
          mergeRequestId: mockMergeRequestId,
          reviewerId: mockReviewerId,
          status: { in: [ReviewRequestStatus.PENDING] },
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when user is not a reviewer", async () => {
      // Setup
      jest.spyOn(prisma.reviewRequest, "findFirst").mockResolvedValue(null);

      // Execute
      const result = await MergeRequestService.isUserReviewer(
        mockReviewerId,
        mockMergeRequestId
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("accept", () => {
    it("should accept merge request when all reviews are accepted", async () => {
      // Setup

      const acceptedReviewRequest = {
        ...mockReviewRequest,
        status: ReviewRequestStatus.ACCEPTED,
      };
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);
      jest
        .spyOn(prisma.reviewRequest, "findFirst")
        .mockResolvedValue(acceptedReviewRequest);
      jest
        .spyOn(mockTransactionClient.reviewRequest, "findFirst")
        .mockResolvedValue(acceptedReviewRequest);
      jest
        .spyOn(mockTransactionClient.reviewRequest, "findMany")
        .mockResolvedValue([acceptedReviewRequest]);
      jest
        .spyOn(mockTransactionClient.board, "findUnique")
        .mockResolvedValue(mockBoard);

      jest.spyOn(Change, "findById").mockResolvedValue(mockChange);
      // Execute
      await MergeRequestService.accept(mockReviewerId, mockMergeRequestId);

      // Assert
      expect(mockTransactionClient.reviewRequest.update).toHaveBeenCalledWith({
        where: { id: mockReviewRequest.id },
        data: { status: ReviewRequestStatus.ACCEPTED },
      });
      expect(mockTransactionClient.mergeRequest.update).toHaveBeenCalledWith({
        where: { id: mockMergeRequestId },
        data: { status: MergeRequestStatus.MERGED },
      });
      expect(getOrCreateRepo).toHaveBeenCalled();
      expect(mockServerRepo.find).toHaveBeenCalledWith(mockDocId);
      expect(Automerge.applyChanges).toHaveBeenCalledWith({}, [mockUint8Array]);
    });

    it("should throw error when merge request is not found", async () => {
      // Setup
      jest.spyOn(prisma.mergeRequest, "findUnique").mockResolvedValue(null);

      // Execute & Assert
      await expect(
        MergeRequestService.accept(mockReviewerId, mockMergeRequestId)
      ).rejects.toThrow(MergeRequestError);
    });

    it("should throw error when user is not a reviewer", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);
      jest.spyOn(prisma.reviewRequest, "findFirst").mockResolvedValue(null);

      // Execute & Assert
      await expect(
        MergeRequestService.accept(mockReviewerId, mockMergeRequestId)
      ).rejects.toThrow(ReviewRequestError);
    });
  });

  describe("reject", () => {
    it("should reject merge request", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);
      jest
        .spyOn(prisma.reviewRequest, "findFirst")
        .mockResolvedValue(mockReviewRequest);
      jest
        .spyOn(mockTransactionClient.reviewRequest, "findFirst")
        .mockResolvedValue(mockReviewRequest);

      // Execute
      await MergeRequestService.reject(mockReviewerId, mockMergeRequestId);

      // Assert
      expect(mockTransactionClient.reviewRequest.update).toHaveBeenCalledWith({
        where: { id: mockReviewRequest.id },
        data: { status: ReviewRequestStatus.REJECTED },
      });
      expect(mockTransactionClient.mergeRequest.update).toHaveBeenCalledWith({
        where: { id: mockMergeRequestId },
        data: { status: MergeRequestStatus.CLOSED },
      });
    });

    it("should throw error when merge request is not found", async () => {
      // Setup
      jest.spyOn(prisma.mergeRequest, "findUnique").mockResolvedValue(null);

      // Execute & Assert
      await expect(
        MergeRequestService.reject(mockReviewerId, mockMergeRequestId)
      ).rejects.toThrow(MergeRequestError);
    });

    it("should throw error when user is not a reviewer", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);
      jest.spyOn(prisma.reviewRequest, "findFirst").mockResolvedValue(null);

      // Execute & Assert
      await expect(
        MergeRequestService.reject(mockReviewerId, mockMergeRequestId)
      ).rejects.toThrow(ReviewRequestError);
    });
  });

  describe("update", () => {
    it("should update merge request", async () => {
      // Setup
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mockMergeRequest);

      jest.spyOn(Change, "findById").mockResolvedValue(mockChange);
      // Execute
      await MergeRequestService.update(mockMergeRequestId, mockChanges);

      // Assert
      expect(mockTransactionClient.mergeRequest.update).toHaveBeenCalledWith({
        where: { id: mockMergeRequestId },
        data: {
          updatedAt: expect.any(Date),
          status: MergeRequestStatus.PENDING,
        },
      });
      expect(
        mockTransactionClient.reviewRequest.updateMany
      ).toHaveBeenCalledWith({
        where: {
          mergeRequestId: mockMergeRequestId,
          status: { not: ReviewRequestStatus.PENDING },
        },
        data: {
          status: ReviewRequestStatus.PENDING,
          updatedAt: expect.any(Date),
        },
      });
      expect(Change.updateOne).toHaveBeenCalledWith(
        { _id: mockChangeId },
        { data: mockChanges }
      );
    });

    it("should throw error when merge request is not found", async () => {
      // Setup
      jest.spyOn(prisma.mergeRequest, "findUnique").mockResolvedValue(null);
      // Override global mock for this test
      jest.spyOn(Change, "findById").mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(null),
          } as any)
      );

      // Execute & Assert
      await expect(
        MergeRequestService.update(mockMergeRequestId, mockChanges)
      ).rejects.toThrow(MergeRequestError);
    });

    it("should throw error when merge request is already merged", async () => {
      // Setup
      const mergedRequest = {
        ...mockMergeRequest,
        status: MergeRequestStatus.MERGED,
      };
      jest
        .spyOn(prisma.mergeRequest, "findUnique")
        .mockResolvedValue(mergedRequest);
      // Change.findById is already mocked globally

      // Execute & Assert
      await expect(
        MergeRequestService.update(mockMergeRequestId, mockChanges)
      ).rejects.toThrow(MergeRequestError);
    });
  });

  describe("close", () => {
    it("should close merge request", async () => {
      // Execute
      await MergeRequestService.close(mockMergeRequestId);

      // Assert
      expect(mockTransactionClient.mergeRequest.update).toHaveBeenCalledWith({
        where: { id: mockMergeRequestId },
        data: { status: MergeRequestStatus.CLOSED },
      });
    });

    it("should throw validation error when merge request id is missing", async () => {
      // Execute & Assert
      await expect(MergeRequestService.close("")).rejects.toThrow(
        ValidationError
      );
    });
  });
});

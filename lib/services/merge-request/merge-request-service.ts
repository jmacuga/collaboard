import prisma from "@/db/prisma";
import dbConnect from "@/db/dbConnect";
import { Change } from "@/db/models/Change";
import {
  MergeRequest,
  ReviewRequest,
  Prisma,
  MergeRequestStatus,
  ReviewRequestStatus,
} from "@prisma/client";
import { AnyDocumentId } from "@automerge/automerge-repo";
import * as A from "@automerge/automerge";

export class MergeRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MergeRequestError";
  }
}

export class ReviewRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewRequestError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface IMergeRequestWithReviews extends MergeRequest {
  reviewRequests: ReviewRequest[];
}

export interface IMergeRequestWithChanges {
  mergeRequest: IMergeRequestWithReviews;
  changes: Uint8Array[];
}

export type PrismaTransactionalClient = Prisma.TransactionClient;

export class MergeRequestService {
  /**
   * Validates input parameters for merge request operations
   */
  private static validateInput(params: { [key: string]: any }): void {
    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        throw new ValidationError(`${key} is required`);
      }
    });
  }

  /**
   * Gets an existing merge request for a requester
   */
  static async getRequesterMergeRequest(
    boardId: string,
    requesterId: string
  ): Promise<MergeRequest | null> {
    this.validateInput({ boardId, requesterId });

    return prisma.mergeRequest.findFirst({
      where: {
        boardId,
        requesterId,
        status: { in: [MergeRequestStatus.OPEN, MergeRequestStatus.PENDING] },
      },
    });
  }

  /**
   * Creates a new merge request with associated review requests
   */
  static async createMergeRequest(
    requesterId: string,
    boardId: string,
    changes: Buffer[]
  ): Promise<MergeRequest | null> {
    this.validateInput({ requesterId, boardId, changes });

    try {
      return await prisma.$transaction(async (prismaTx) => {
        const change = await this.createChange(changes);
        const mergeRequest = await this.createMergeRequestRecord(
          requesterId,
          boardId,
          change._id,
          prismaTx
        );
        await this.createReviewRequest(mergeRequest.id, boardId, prismaTx);
        return mergeRequest;
      });
    } catch (error) {
      console.error("Error creating merge request:", error);
      throw error;
    }
  }

  /**
   * Creates a new change record
   */
  private static async createChange(changes: Buffer[]) {
    await dbConnect();
    return Change.create({ data: changes });
  }

  /**
   * Creates a merge request record
   */
  private static async createMergeRequestRecord(
    requesterId: string,
    boardId: string,
    changesId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<MergeRequest> {
    return prismaTx.mergeRequest.create({
      data: {
        requesterId,
        boardId,
        status: MergeRequestStatus.OPEN,
        changesId,
      },
    });
  }

  /**
   * Creates a review request for team admins
   */
  private static async createReviewRequest(
    mergeRequestId: string,
    boardId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    const board = await prismaTx.board.findUnique({
      where: { id: boardId },
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

    if (!board?.team?.members[0]?.userId) {
      throw new MergeRequestError("No admin found for review");
    }

    await prismaTx.reviewRequest.create({
      data: {
        mergeRequestId,
        reviewerId: board.team.members[0].userId,
        boardId,
        status: ReviewRequestStatus.PENDING,
      },
    });
  }

  /**
   * Gets a merge request by ID with its changes
   */
  static async getMergeRequestById(
    mergeReqId: string
  ): Promise<IMergeRequestWithChanges | null> {
    this.validateInput({ mergeReqId });

    const mergeRequest = await prisma.mergeRequest.findUnique({
      where: { id: mergeReqId },
      include: {
        requester: true,
        reviewRequests: {
          include: {
            reviewer: true,
          },
        },
      },
    });

    if (!mergeRequest) {
      return null;
    }

    const changes = await Change.findById(mergeRequest.changesId);
    if (!changes?.data?.length) {
      return null;
    }

    return {
      mergeRequest,
      changes: changes.data.map((change: Buffer) => new Uint8Array(change)),
    };
  }

  /**
   * Gets an open merge request
   */
  public static async getOpenMergeRequest(
    mergeReqId: string
  ): Promise<MergeRequest | null> {
    this.validateInput({ mergeReqId });

    return prisma.mergeRequest.findUnique({
      where: { id: mergeReqId, status: MergeRequestStatus.OPEN },
    });
  }

  /**
   * Accepts a merge request and applies changes if all reviewers have accepted
   */
  public static async accept(
    userId: string,
    mergeReqId: string
  ): Promise<void> {
    this.validateInput({ userId, mergeReqId });

    await prisma.$transaction(async (prismaTx) => {
      const mergeRequest = await this.getOpenMergeRequest(mergeReqId);
      if (!mergeRequest) {
        throw new MergeRequestError("Merge request not found");
      }

      if (!(await this.isUserReviewer(userId, mergeReqId))) {
        throw new ReviewRequestError("User is not a reviewer");
      }

      await this.acceptReviewRequest(userId, mergeReqId, prismaTx);

      if (await this.allReviewRequestsAccepted(mergeRequest.id, prismaTx)) {
        const changesArray = await this.getChangesArray(mergeRequest);
        await this.acceptMergeRequest(mergeRequest, prismaTx);
        await this.applyChanges(mergeRequest.boardId, changesArray, prismaTx);
      }
    });
  }

  /**
   * Accepts a review request
   */
  private static async acceptReviewRequest(
    userId: string,
    mergeReqId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    const reviewRequest = await this.getReviewRequest(
      userId,
      mergeReqId,
      prismaTx
    );

    await prismaTx.reviewRequest.update({
      where: { id: reviewRequest.id },
      data: { status: ReviewRequestStatus.ACCEPTED },
    });
  }

  /**
   * Gets a review request for a user
   */
  private static async getReviewRequest(
    userId: string,
    mergeReqId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<ReviewRequest> {
    const reviewRequest = await prismaTx.reviewRequest.findFirst({
      where: { mergeRequestId: mergeReqId, reviewerId: userId },
    });

    if (!reviewRequest) {
      throw new ReviewRequestError("Review request not found");
    }

    return reviewRequest;
  }

  /**
   * Checks if all review requests have been accepted
   */
  private static async allReviewRequestsAccepted(
    mergeRequestId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<boolean> {
    const reviewRequests = await prismaTx.reviewRequest.findMany({
      where: { mergeRequestId },
    });

    return reviewRequests.every(
      (request) => request.status === ReviewRequestStatus.ACCEPTED
    );
  }

  /**
   * Gets changes array for a merge request
   */
  private static async getChangesArray(
    mergeRequest: MergeRequest
  ): Promise<Uint8Array[]> {
    const changes = await Change.findById(mergeRequest.changesId);
    if (!changes) {
      throw new MergeRequestError("Changes not found");
    }

    return changes.data.map((change: Buffer) => new Uint8Array(change));
  }

  /**
   * Accepts a merge request
   */
  private static async acceptMergeRequest(
    mergeRequest: MergeRequest,
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    await prismaTx.mergeRequest.update({
      where: { id: mergeRequest.id },
      data: { status: MergeRequestStatus.MERGED },
    });
  }

  /**
   * Applies changes to the board document
   */
  private static async applyChanges(
    boardId: string,
    changes: Uint8Array[],
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    const board = await prismaTx.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new MergeRequestError("Board not found");
    }

    const serverRepo = global.__serverRepo;
    if (!serverRepo) {
      throw new MergeRequestError("Server repo not found");
    }

    const handle = serverRepo.find(board.docUrl as AnyDocumentId);
    handle.update((doc) => {
      return A.applyChanges(doc, changes)[0];
    });
  }

  /**
   * Closes a merge request
   */
  public static async close(id: string): Promise<void> {
    this.validateInput({ id });

    try {
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.mergeRequest.update({
          where: { id },
          data: { status: MergeRequestStatus.CLOSED },
        });
      });
    } catch (error) {
      console.error("Error closing merge request:", error);
      throw error;
    }
  }

  /**
   * Checks if a user is a reviewer for a merge request
   */
  public static async isUserReviewer(
    userId: string,
    mergeReqId: string
  ): Promise<boolean> {
    this.validateInput({ userId, mergeReqId });

    const reviewRequest = await prisma.reviewRequest.findFirst({
      where: {
        mergeRequestId: mergeReqId,
        reviewerId: userId,
        status: { in: [ReviewRequestStatus.PENDING] },
      },
    });

    return reviewRequest !== null;
  }

  /**
   * Rejects a merge request
   */
  public static async reject(
    userId: string,
    mergeReqId: string
  ): Promise<void> {
    this.validateInput({ userId, mergeReqId });

    await prisma.$transaction(async (prismaTx) => {
      const mergeRequest = await this.getOpenMergeRequest(mergeReqId);
      if (!mergeRequest) {
        throw new MergeRequestError("Merge request not found");
      }

      if (!(await this.isUserReviewer(userId, mergeReqId))) {
        throw new ReviewRequestError("User is not a reviewer");
      }

      await this.rejectReviewRequest(userId, mergeReqId, prismaTx);
      await this.close(mergeReqId);
    });
  }

  /**
   * Rejects a review request
   */
  private static async rejectReviewRequest(
    userId: string,
    mergeReqId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    const reviewRequest = await this.getReviewRequest(
      userId,
      mergeReqId,
      prismaTx
    );

    await prismaTx.reviewRequest.update({
      where: { id: reviewRequest.id },
      data: { status: ReviewRequestStatus.REJECTED },
    });
  }

  private static async updateReviewRequests(
    mergeRequestId: string,
    prismaTx: PrismaTransactionalClient
  ): Promise<void> {
    await prismaTx.reviewRequest.updateMany({
      where: { mergeRequestId, status: { not: ReviewRequestStatus.PENDING } },
      data: {
        status: ReviewRequestStatus.PENDING,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Updates a merge request
   */
  public static async update(
    mergeRequestId: string,
    changes: Buffer[]
  ): Promise<void> {
    this.validateInput({ mergeRequestId, changes });
    await prisma.$transaction(async (prismaTx) => {
      const result = await this.getMergeRequestById(mergeRequestId);
      if (!result) {
        throw new MergeRequestError("Merge request not found");
      }
      const { mergeRequest } = result;
      if (mergeRequest.status === MergeRequestStatus.MERGED) {
        throw new MergeRequestError("Merge request is already merged");
      }
      await prismaTx.mergeRequest.update({
        where: { id: mergeRequest.id },
        data: {
          updatedAt: new Date(),
          status: MergeRequestStatus.PENDING,
        },
      });
      await this.updateReviewRequests(mergeRequest.id, prismaTx);
      await Change.updateOne(
        { _id: mergeRequest.changesId },
        { data: changes }
      );
    });
  }
}

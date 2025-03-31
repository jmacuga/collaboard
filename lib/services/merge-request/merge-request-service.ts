import prisma from "@/db/prisma";
import dbConnect from "@/db/dbConnect";
import { Change } from "@/db/models/Change";
import { MergeRequest, ReviewRequest, Prisma } from "@prisma/client";
import { MongoDBStorageAdapter } from "@/lib/automerge-repo-storage-mongodb";
import {
  AnyDocumentId,
  Doc,
  DocHandle,
  DocumentId,
  Repo,
} from "@automerge/automerge-repo";
import * as A from "@automerge/automerge";
import { v4 as uuidv4 } from "uuid";
export type PrismaTransactionalClient = Prisma.TransactionClient;
import { getOrCreateRepo } from "@/lib/automerge-server";
export class MergeRequestService {
  static async getMergeRequest(boardId: string, userId: string) {
    const mergeRequest = await prisma.mergeRequest.findFirst({
      where: {
        boardId,
        requesterId: userId,
        status: { in: ["OPEN", "PENDING"] },
      },
    });
    return mergeRequest;
  }

  static async createMergeRequest(
    userId: string,
    boardId: string,
    changes: Buffer[]
  ) {
    let mergeRequest: MergeRequest | null = null;
    try {
      const existingMergeRequest = await this.getMergeRequest(boardId, userId);
      if (existingMergeRequest) {
        throw new Error("Merge request already exists");
      }

      await prisma.$transaction(async (prismaTx) => {
        await dbConnect();
        const change = await Change.create({
          data: changes,
        });

        mergeRequest = await prismaTx.mergeRequest.create({
          data: {
            requesterId: userId,
            boardId,
            status: "OPEN",
            changesId: change._id,
          },
        });

        const board = await prismaTx.board.findUnique({
          where: {
            id: boardId,
          },
        });
        const team = await prismaTx.team.findUnique({
          where: {
            id: board?.teamId,
          },
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
        });

        if (team?.members[0].userId) {
          await prismaTx.reviewRequest.create({
            data: {
              mergeRequestId: mergeRequest.id,
              reviewerId: team?.members[0].userId,
              boardId,
              status: "PENDING",
            },
          });
        } else {
          await Change.deleteOne({ _id: change._id });
          throw new Error("No admin found");
        }
      });

      return mergeRequest;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getMergeRequestById(mergeReqId: string): Promise<{
    mergeRequest: MergeRequest & { reviewRequests: ReviewRequest[] };
    changes: Uint8Array[];
  } | null> {
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

    const changes = await Change.findById(mergeRequest?.changesId);
    if (!changes) {
      return null;
    }
    if (changes && changes.data && changes.data.length > 0) {
      const result = changes.data.map(
        (change: Buffer) => new Uint8Array(change)
      );
      return { mergeRequest, changes: result };
    } else {
      return null;
    }
  }

  public static async accept(userId: string, mergeReqId: string) {
    await prisma.$transaction(async (prismaTx) => {
      const mergeRequest = await prisma.mergeRequest.findUnique({
        where: { id: mergeReqId },
      });
      if (!mergeRequest) {
        throw new Error("Merge request not found");
      }
      if (mergeRequest.status !== "OPEN") {
        throw new Error("Merge request not open");
      }
      await this.acceptReviewRequest(userId, mergeReqId, prismaTx);
      if (await this.canCloseMergeRequest(mergeRequest.id, prismaTx)) {
        await this.acceptMergeRequest(mergeRequest, prismaTx);
      }
    });
  }

  static async acceptReviewRequest(
    userId: string,
    mergeReqId: string,
    prismaTx?: PrismaTransactionalClient
  ) {
    prismaTx = prismaTx ? prismaTx : prisma;
    const reviewRequests = await prismaTx.reviewRequest.findMany({
      where: { mergeRequestId: mergeReqId },
    });
    const userReviewRequests = reviewRequests.filter(
      (reviewRequest) => reviewRequest.reviewerId === userId
    );

    if (reviewRequests.length === 0 || userReviewRequests.length === 0) {
      throw new Error("Review requests not found");
    }

    userReviewRequests.forEach(async (reviewRequest) => {
      await prismaTx.reviewRequest.update({
        where: { id: reviewRequest.id },
        data: { status: "ACCEPTED" },
      });
    });
  }

  private static async canCloseMergeRequest(
    id: string,
    prismaTx?: PrismaTransactionalClient
  ): Promise<boolean> {
    prismaTx = prismaTx ? prismaTx : prisma;
    const reviewRequests = await prismaTx.reviewRequest.findMany({
      where: { mergeRequestId: id },
    });
    reviewRequests.forEach(async (reviewRequest) => {
      if (reviewRequest.status !== "ACCEPTED") {
        return false;
      }
    });
    return true;
  }

  private static async acceptMergeRequest(
    mergeRequest: MergeRequest,
    prismaTx?: PrismaTransactionalClient
  ) {
    prismaTx = prismaTx ? prismaTx : prisma;
    const changes = await Change.findById(mergeRequest.changesId);
    if (!changes) {
      throw new Error("Changes not found");
    }
    const changesArray = changes.data.map((change: Buffer) => {
      return new Uint8Array(change);
    });
    await this.applyChanges(mergeRequest.boardId, changesArray);
    await prismaTx.mergeRequest.update({
      where: { id: mergeRequest.id },
      data: { status: "MERGED" },
    });
  }

  private static async applyChanges(
    boardId: string,
    changes: Uint8Array[],
    prismaTx?: PrismaTransactionalClient
  ) {
    prismaTx = prismaTx ? prismaTx : prisma;
    const board = await prismaTx.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new Error("Board not found");
    }
    const hostname = process.env.HOSTNAME || "localhost";
    const serverRepo = global.__serverRepo;
    if (!serverRepo) {
      throw new Error("Server repo not found");
    }
    const handle = serverRepo.find(board.docUrl as AnyDocumentId);
    const serverDoc = await handle.doc();
    if (!serverDoc) {
      throw new Error("Server doc not found");
    }
    console.log("doc before saving", serverDoc);
    console.log("changes", changes);

    // const doc = A.applyChanges(serverDoc, changes)[0];
    // serverRepo.storageSubsystem?.saveDoc(handle.documentId, doc);
    // const handle2 = serverRepo.clone(handle);
    // const clonedDoc = await handle2.doc();
    // const updatedDoc = A.applyChanges(clonedDoc, changes)[0];

    // handle.merge(handle2);
    handle.update((doc) => {
      return A.applyChanges(doc, changes)[0];
    });
    console.log("doc after saving", serverDoc);
  }

  public static async close(id: string) {
    try {
      await prisma.$transaction(async (prismaTx) => {
        const reviewRequests = await prismaTx.reviewRequest.findMany({
          where: { mergeRequestId: id },
        });
        if (reviewRequests.length > 0) {
          reviewRequests.forEach(async (reviewRequest) => {
            if (reviewRequest.status !== "ACCEPTED") {
              await prismaTx.reviewRequest.update({
                where: { id: reviewRequest.id },
                data: { status: "REJECTED" },
              });
            }
          });
        }
        await prismaTx.mergeRequest.update({
          where: { id },
          data: { status: "CLOSED" },
        });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

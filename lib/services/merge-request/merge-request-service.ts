import prisma from "@/db/prisma";
import dbConnect from "@/db/dbConnect";
import { Change } from "@/db/models/Change";
import { MergeRequest, ReviewRequest } from "@prisma/client";
export class MergeRequestService {
  static async getMergeRequest(boardId: string, userId: string) {
    const mergeRequest = await prisma.mergeRequest.findFirst({
      where: {
        boardId,
        requesterId: userId,
        status: "PENDING",
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
            status: "PENDING",
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
}

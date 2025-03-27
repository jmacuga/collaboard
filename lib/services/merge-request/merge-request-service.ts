import prisma from "@/db/prisma";
import dbConnect from "@/db/dbConnect";
import { Change } from "@/db/models/Change";
import { MergeRequest } from "@prisma/client";
import { CodeSquare } from "lucide-react";

export class MergeRequestService {
  static async createMergeRequest(
    userId: string,
    boardId: string,
    changes: Buffer[]
  ) {
    let mergeRequest: MergeRequest | null = null;
    try {
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

  static async getMergeRequestById(
    mergeReqId: string
  ): Promise<{ mergeRequest: MergeRequest; changes: Uint8Array[] } | null> {
    const mergeRequest = await prisma.mergeRequest.findUnique({
      where: { id: mergeReqId },
    });
    if (!mergeRequest) {
      return null;
    }

    const changes = await Change.findById(mergeRequest?.changesId);
    if (!changes) {
      return null;
    }
    if (changes && changes.data && changes.data.length > 0) {
      console.log("changes.data", changes.data);
      const result = changes.data.map(
        (change: Buffer) => new Uint8Array(change)
      );
      console.log("result", result);
      return { mergeRequest, changes: result };
    } else {
      return null;
    }
  }
}

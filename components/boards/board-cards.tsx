import { Board } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  ArrowRight,
  GitPullRequest,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getColorForIndex } from "@/lib/utils/colors";
import { format } from "date-fns";
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog";
import { db } from "@/lib/indexed-db";
import { useEffect, useState } from "react";
import { isAfter, parseISO } from "date-fns";

export function BoardCards({
  teamBoards,
  userRole,
  lastUpdatedMap,
}: {
  teamBoards: Board[] | null;
  userRole: string;
  lastUpdatedMap: Record<string, Date>;
}) {
  const [updatedBoards, setUpdatedBoards] = useState<string[]>([]);

  useEffect(() => {
    const roundToSeconds = (date: Date): Date => {
      const newDate = new Date(date);
      newDate.setMilliseconds(0);
      return newDate;
    };

    const getUpdatedBoards = async () => {
      const boardIds: string[] = [];

      await Promise.all(
        teamBoards?.map(async (board) => {
          const boardLastUpdated = lastUpdatedMap[board.id];
          const lastSeen = await db.getBoardLastSeen(board.id);

          if (!lastSeen || !boardLastUpdated) return;

          const boardLastUpdatedDate = new Date(boardLastUpdated);

          const roundedLastUpdated = roundToSeconds(boardLastUpdatedDate);
          const roundedLastSeen = roundToSeconds(lastSeen);

          if (isAfter(roundedLastUpdated, roundedLastSeen)) {
            boardIds.push(board.id);
          }
        }) ?? []
      );
      setUpdatedBoards(boardIds);
    };

    getUpdatedBoards();
  }, [teamBoards, lastUpdatedMap]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamBoards ? (
        teamBoards.map((board, index) => (
          <Card key={board.id} className="group">
            <div
              className="inset-0 opacity-5 rounded-lg transition-opacity duration-200 group-hover:opacity-10"
              style={{
                backgroundColor: getColorForIndex(index).primary,
              }}
            />

            <CardHeader className=" pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LayoutDashboard
                    className="h-5 w-5"
                    style={{ color: getColorForIndex(index).primary }}
                  />
                  {board.name}
                  <div className="relative">
                    {updatedBoards.includes(board.id) && (
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full bg-primary"
                          aria-label="Board has unseen changes"
                        ></div>
                        <p className="text-xs text-muted-foreground">
                          New changes
                        </p>
                      </div>
                    )}
                  </div>
                </CardTitle>
                {userRole === "Admin" && (
                  <DeleteBoardDialog
                    boardId={board.id}
                    boardName={board.name}
                    teamId={board.teamId}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className=" space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p>
                  Created {format(new Date(board.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              {lastUpdatedMap[board.id as string] && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <p>
                    Last Updated{" "}
                    {format(lastUpdatedMap[board.id as string], "MMM d, HH:mm")}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/boards/${board.id}/merge-requests`}
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 hover:bg-primary/50 hover:text-primary-foreground transition-colors"
                  >
                    <GitPullRequest className="h-4 w-4" />
                    Merge Requests
                  </Button>
                </Link>
                <Link href={`/boards/${board.id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 hover:bg-accent/50 transition-colors"
                  >
                    Open Board
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>No Boards Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create a board to start collaborating
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

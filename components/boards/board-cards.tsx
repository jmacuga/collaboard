import { Board } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getColorForIndex } from "@/lib/utils/colors";
import { format } from "date-fns";
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog";

export function BoardCards({
  teamBoards,
  userRole,
}: {
  teamBoards: Board[] | null;
  userRole: string;
}) {
  console.log(userRole);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teamBoards ? (
        teamBoards.map((board, index) => (
          <Card key={board.id} className="relative group">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundColor: getColorForIndex(index).primary,
              }}
            />

            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard
                  className="h-5 w-5"
                  style={{ color: getColorForIndex(index).primary }}
                />
                {board.name}
              </CardTitle>
              {userRole === "Admin" && (
                <DeleteBoardDialog
                  boardId={board.id}
                  boardName={board.name}
                  teamId={board.teamId}
                />
              )}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Created{" "}
                {format(new Date(board.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </CardContent>
            <CardFooter className="relative justify-end">
              <Link href={`/boards/${board.id}`} className="ml-auto">
                <Button
                  variant="ghost"
                  className="hover:bg-accent/50 transition-colors flex items-center gap-2"
                >
                  Open Board
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
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

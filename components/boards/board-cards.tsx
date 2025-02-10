"use client";

import { IBoard } from "@/models/Board";
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
import { getColorForIndex } from "@/lib/colors";
import { format } from "date-fns";
import dynamic from "next/dynamic";
const DeleteBoardDialog = dynamic(
  () =>
    import("@/components/boards/delete-board-dialog").then(
      (mod) => mod.DeleteBoardDialog
    ),
  {
    ssr: false,
  }
);

export default function BoardCards({
  teamBoards,
}: {
  teamBoards: IBoard[] | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teamBoards ? (
        teamBoards.map((board, index) => (
          <Card key={board._id as string} className="relative group">
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
              <DeleteBoardDialog
                boardId={board.id as string}
                boardName={board.name}
              />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Created{" "}
                {format(new Date(board.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </CardContent>
            <CardFooter className="relative justify-end">
              <Link href={`/board/${board.id}`} className="ml-auto">
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

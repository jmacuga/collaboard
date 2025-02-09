import { IBoard } from "@/models/Board";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { getColorForIndex } from "@/lib/colors";

export default async function TeamBoardsCards({
  teamBoards,
}: {
  teamBoards: IBoard[] | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teamBoards ? (
        teamBoards.map((board, index) => (
          <Card
            key={board._id as string}
            className="hover:bg-accent/50 transition-colors overflow-hidden relative"
          >
            <Link href={`/board/${board._id}`}>
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
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground relative">
                <p className="text-sm text-muted-foreground">
                  Created at: {board.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Link>
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

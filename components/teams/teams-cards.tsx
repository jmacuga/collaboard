import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Team } from "@prisma/client";
import { ArrowRight, Clock, Users } from "lucide-react";
import { DeleteTeamDialog } from "./delete-team-dialog";
import { Button } from "../ui/button";
import { format } from "date-fns";

export default function TeamsCards({ teams }: { teams: Team[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams && teams.length > 0 ? (
        teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {team.name}
              </CardTitle>
              <DeleteTeamDialog teamId={team.id} teamName={team.name} />
            </CardHeader>
            <CardContent className="relative text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p>Created {format(new Date(team.createdAt), "MMM d, yyyy")}</p>
              </div>
              <Link href={`/teams/${team.id}/boards`}>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 mt-2 hover:bg-accent/50 transition-colors"
                >
                  Select
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Teams Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create a team to get started with collaboration
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

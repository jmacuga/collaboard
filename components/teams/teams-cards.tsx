import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Team } from "@prisma/client";
import { Users } from "lucide-react";

export default function TeamsCards({ teams }: { teams: Team[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams ? (
        teams.map((team) => (
          <Card key={team.id} className="hover:bg-accent/50 transition-colors">
            <Link href={`/teams/${team.id}/boards`}>
              <a className="block">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Team ID: {team.id}
                </CardContent>
              </a>
            </Link>
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

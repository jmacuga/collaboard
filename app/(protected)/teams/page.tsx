import { getUserTeams, getUser } from "@/lib/data";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

export default async function Teams() {
  const session = await auth();
  console.log("Session", session);

  if (!session?.user) {
    return <div>Error: User not found</div>;
  }
  const user = await getUser(session?.user?.email ?? "");
  if (user === null) {
    return <div>Error: User not found</div>;
  }
  const teams = await getUserTeams(user.id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams ? (
          teams.map((team) => (
            <Card
              key={team.id}
              className="hover:bg-accent/50 transition-colors"
            >
              <Link href={`/teams/${team.id}/boards`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Team ID: {team.id}
                </CardContent>
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
    </div>
  );
}

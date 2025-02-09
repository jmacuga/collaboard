import { getUserTeams, getUser } from "@/lib/data";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TeamsCards from "@/components/teams/teams-cards";

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

      {teams && <TeamsCards teams={teams} />}
    </div>
  );
}

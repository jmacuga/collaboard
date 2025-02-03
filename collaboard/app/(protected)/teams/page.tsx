import { getUserTeams, getUser } from "@/lib/data";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Sidenav from "@/components/teams/sidenav";

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
    <main className="flex">
      <div>
        <Sidenav />
        <h1>Teams</h1>
        <ul>
          {teams ? (
            teams.map((team) => (
              <li key={team.id}>
                <Link href={`/teams/${team.id}/boards`}>
                  {team.id}, {team.name}
                </Link>
              </li>
            ))
          ) : (
            <li>No teams found</li>
          )}
        </ul>
      </div>
    </main>
  );
}

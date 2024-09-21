import RoomCards from "@/components/dashboard/room-cards";
import { auth } from "@/auth";
import { getUser } from "@/lib/data";

export default async function Dashboard() {
  const session = await auth();
  console.log("Session", session);
  let userId = null;

  if (session) {
    if (!session.user) {
      return <div>Error: Not signed in</div>;
    }
    const user = await getUser(session?.user?.email ?? "");
    if (!user) {
      return <div>Error: User not found</div>;
    }
    userId = user.id;
  }

  return (
    <main>
      <RoomCards userId={userId} />
    </main>
  );
}

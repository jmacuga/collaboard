import { User } from "@/db/models/User";
import dbConnect from "@/db/dbConnect";
import { Board } from "@/db/models/Board";
import { Team } from "@/db/models/Team";
import { TeamMember } from "@/db/models/TeamMember";
import { TeamRole } from "@/db/models/TeamRole";

export async function populateMongodb() {
  await dbConnect();
  const user = await User.create({
    email: "test@example.com",
    name: "Test User",
    surname: "Test Surname",
    username: "testuser",
    passwordHash:
      "$2y$10$Spz7nZl8nQ9sdTkOBzaaj.dF7tVg6H7eDmRieQr0ue4rXQKoB6AqG",
  });
  console.log("User created", user);

  const team = await Team.create({
    name: "Test Team",
  });

  console.log("Team created", team);

  const teamRole = await TeamRole.create({
    name: "Admin",
  });

  const teamMember = await TeamMember.create({
    teamId: team._id,
    userId: user._id,
    role: teamRole._id,
  });

  console.log("Team Member created", teamMember);

  const board = await Board.create({
    name: "Test Board",
    teamId: team._id,
    isMergeRequestRequired: true,
  });
}

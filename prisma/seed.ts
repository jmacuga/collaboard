import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.boardLog.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.reviewRequest.deleteMany();
    await prisma.mergeRequest.deleteMany();
    await prisma.boardAction.deleteMany();
    await prisma.board.deleteMany();
    await prisma.teamInvitation.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.teamRole.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();

    // Create roles
    const adminRole = await prisma.teamRole.create({
      data: {
        name: "Admin",
      },
    });

    const memberRole = await prisma.teamRole.create({
      data: {
        name: "Member",
      },
    });

    // Create users
    const password = await hash("password123", 12);

    const john = await prisma.user.create({
      data: {
        email: "john@example.com",
        name: "John",
        surname: "Doe",
        passwordHash: password,
        username: "johndoe",
      },
    });

    const jane = await prisma.user.create({
      data: {
        email: "jane@example.com",
        name: "Jane",
        surname: "Smith",
        passwordHash: password,
        username: "janesmith",
      },
    });

    // Create teams
    const designTeam = await prisma.team.create({
      data: {
        name: "Design Team",
      },
    });

    const devTeam = await prisma.team.create({
      data: {
        name: "Development Team",
      },
    });

    // Add team members
    await prisma.teamMember.create({
      data: {
        teamId: designTeam.id,
        userId: john.id,
        roleId: adminRole.id,
      },
    });

    await prisma.teamMember.create({
      data: {
        teamId: designTeam.id,
        userId: jane.id,
        roleId: memberRole.id,
      },
    });

    await prisma.teamMember.create({
      data: {
        teamId: devTeam.id,
        userId: jane.id,
        roleId: adminRole.id,
      },
    });

    // Create boards
    const designBoard = await prisma.board.create({
      data: {
        name: "Website Redesign",
        teamId: designTeam.id,
        isMergeRequestRequired: true,
        docUrl: "https://example.com/design-doc",
      },
    });

    const devBoard = await prisma.board.create({
      data: {
        name: "Sprint Planning",
        teamId: devTeam.id,
        isMergeRequestRequired: true,
      },
    });

    // Create sample comments
    await prisma.comment.create({
      data: {
        boardId: designBoard.id,
        userId: john.id,
        text: "Please review the color scheme",
        objectId: "obj1",
      },
    });

    // Create board actions
    const createAction = await prisma.boardAction.create({
      data: {
        name: "CREATE",
        reversable: true,
      },
    });

    // Create sample merge request
    const mergeRequest = await prisma.mergeRequest.create({
      data: {
        boardId: designBoard.id,
        requesterId: jane.id,
        status: "OPEN",
        changesId: "changes-1", // Optional field for tracking changes
      },
    });

    // Create review request
    await prisma.reviewRequest.create({
      data: {
        boardId: designBoard.id,
        reviewerId: john.id,
        mergeRequestId: mergeRequest.id,
        status: "PENDING",
      },
    });

    // Create board logs
    await prisma.boardLog.create({
      data: {
        boardId: designBoard.id,
        userId: john.id,
        actionId: createAction.id,
        objectId: "obj1",
      },
    });

    console.log("Database has been seeded! 🌱");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

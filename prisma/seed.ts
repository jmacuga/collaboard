import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.comment.deleteMany();
    await prisma.reviewRequest.deleteMany();
    await prisma.mergeRequest.deleteMany();
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

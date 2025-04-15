/*
  Warnings:

  - A unique constraint covering the columns `[userId,boardId]` on the table `UserLastViewedBoardLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,teamId]` on the table `UserLastViewedTeamLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserLastViewedBoardLog_userId_boardId_key` ON `UserLastViewedBoardLog`(`userId`, `boardId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserLastViewedTeamLog_userId_teamId_key` ON `UserLastViewedTeamLog`(`userId`, `teamId`);

/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,teamId]` on the table `UserLastViewedLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,type,boardId]` on the table `UserLastViewedLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserLastViewedLog_userId_type_teamId_key` ON `UserLastViewedLog`(`userId`, `type`, `teamId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserLastViewedLog_userId_type_boardId_key` ON `UserLastViewedLog`(`userId`, `type`, `boardId`);

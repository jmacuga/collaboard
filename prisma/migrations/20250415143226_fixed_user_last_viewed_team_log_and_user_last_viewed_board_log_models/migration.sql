/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserLastViewedBoardLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserLastViewedBoardLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserLastViewedTeamLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserLastViewedTeamLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserLastViewedBoardLog` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `UserLastViewedTeamLog` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

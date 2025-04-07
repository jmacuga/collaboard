/*
  Warnings:

  - You are about to alter the column `type` on the `UserLastViewedLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `UserLastViewedLog` ADD COLUMN `boardId` VARCHAR(191) NULL,
    ADD COLUMN `teamId` VARCHAR(191) NULL,
    MODIFY `type` ENUM('ALL', 'TEAM', 'BOARD') NOT NULL;

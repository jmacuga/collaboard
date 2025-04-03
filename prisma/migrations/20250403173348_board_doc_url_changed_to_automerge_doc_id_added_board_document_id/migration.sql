/*
  Warnings:

  - You are about to drop the column `docUrl` on the `Board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Board` DROP COLUMN `docUrl`,
    ADD COLUMN `automergeDocId` VARCHAR(191) NULL,
    ADD COLUMN `documentId` VARCHAR(191) NULL;

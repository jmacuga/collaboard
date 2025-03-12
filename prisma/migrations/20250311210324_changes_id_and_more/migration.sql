/*
  Warnings:

  - You are about to drop the column `action` on the `BoardLog` table. All the data in the column will be lost.
  - You are about to drop the column `updateData` on the `MergeRequest` table. All the data in the column will be lost.
  - The values [ACCEPTED,REJECTED] on the enum `MergeRequest_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `accepted` on the `ReviewRequest` table. All the data in the column will be lost.
  - Added the required column `actionId` to the `BoardLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ReviewRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Board` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BoardLog` DROP COLUMN `action`,
    ADD COLUMN `actionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `MergeRequest` DROP COLUMN `updateData`,
    ADD COLUMN `changesId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('OPEN', 'PENDING', 'MERGED', 'CLOSED') NOT NULL;

-- AlterTable
ALTER TABLE `ReviewRequest` DROP COLUMN `accepted`,
    ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL;

-- CreateTable
CREATE TABLE `BoardAction` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `reversable` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardLog` ADD CONSTRAINT `BoardLog_actionId_fkey` FOREIGN KEY (`actionId`) REFERENCES `BoardAction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

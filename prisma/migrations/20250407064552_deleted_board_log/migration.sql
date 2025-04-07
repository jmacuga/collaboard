/*
  Warnings:

  - You are about to drop the column `metadata` on the `TeamLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetRoleId` on the `TeamLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetUserId` on the `TeamLog` table. All the data in the column will be lost.
  - You are about to drop the `BoardLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BoardLog` DROP FOREIGN KEY `BoardLog_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardLog` DROP FOREIGN KEY `BoardLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamLog` DROP FOREIGN KEY `TeamLog_targetRoleId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamLog` DROP FOREIGN KEY `TeamLog_targetUserId_fkey`;

-- DropIndex
DROP INDEX `TeamLog_targetRoleId_fkey` ON `TeamLog`;

-- DropIndex
DROP INDEX `TeamLog_targetUserId_fkey` ON `TeamLog`;

-- AlterTable
ALTER TABLE `TeamLog` DROP COLUMN `metadata`,
    DROP COLUMN `targetRoleId`,
    DROP COLUMN `targetUserId`,
    MODIFY `action` ENUM('CREATED', 'DELETED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'ROLE_UPDATED', 'BOARD_CREATED', 'BOARD_DELETED', 'MERGE_REQUEST_CREATED', 'MERGE_REQUEST_UPDATED', 'REVIEW_REQUEST_CREATED', 'REVIEW_REQUEST_UPDATED') NOT NULL;

-- DropTable
DROP TABLE `BoardLog`;

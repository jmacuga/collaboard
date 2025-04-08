/*
  Warnings:

  - You are about to drop the `BoardAction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `BoardLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BoardLog` DROP FOREIGN KEY `BoardLog_actionId_fkey`;

-- DropIndex
DROP INDEX `BoardLog_actionId_fkey` ON `BoardLog`;

-- AlterTable
ALTER TABLE `BoardLog` ADD COLUMN `action` ENUM('CREATED', 'DELETED') NOT NULL;

-- DropTable
DROP TABLE `BoardAction`;
